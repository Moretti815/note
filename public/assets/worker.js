export default {
    async fetch(request, env) {
        const corsHeaders = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Content-Type": "text/plain;charset=UTF-8",
        };

        if (request.method === "OPTIONS") {
            return new Response(null, { headers: corsHeaders });
        }

        const url = new URL(request.url);
        const path = url.pathname;

        const fetchGitHubFile = async (filePath) => {
            const apiUrl = `https://api.github.com/repos/${env.GITHUB_USER}/${env.GITHUB_REPO}/contents/${filePath}`;
            const res = await fetch(apiUrl, {
                headers: {
                    "Authorization": `Bearer ${env.GITHUB_TOKEN}`,
                    "Accept": "application/vnd.github.v3.raw",
                    "User-Agent": "Cloudflare-Worker"
                }
            });

            if (!res.ok) {
                throw new Error(`Failed to fetch ${filePath}: ${res.status} ${res.statusText}`);
            }
            return await res.text();
        };

        try {
            if (path === "/data.txt") {
                const plainText = await fetchGitHubFile(env.DATA_PATH);
                return new Response(plainText, { headers: corsHeaders });
            }

            else if (path === "/private.txt") {
                const plainText = await fetchGitHubFile(env.PRIVATE_PATH);

                const encoder = new TextEncoder();
                const pwHash = await crypto.subtle.digest("SHA-256", encoder.encode(env.AES_PASSWORD));
                const cryptoKey = await crypto.subtle.importKey(
                    "raw", pwHash, { name: "AES-GCM" }, false, ["encrypt"]
                );

                const iv = crypto.getRandomValues(new Uint8Array(12));
                const encryptedBuffer = await crypto.subtle.encrypt(
                    { name: "AES-GCM", iv: iv },
                    cryptoKey,
                    encoder.encode(plainText)
                );

                const encryptedArray = new Uint8Array(encryptedBuffer);
                const combinedArray = new Uint8Array(iv.length + encryptedArray.length);
                combinedArray.set(iv);
                combinedArray.set(encryptedArray, iv.length);

                const binaryString = combinedArray.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
                const base64Output = btoa(binaryString);

                return new Response(base64Output, { headers: corsHeaders });
            }
            else {
                return new Response("Not Found", { status: 404, headers: corsHeaders });
            }

        } catch (err) {
            return new Response(err.message, { status: 500, headers: corsHeaders });
        }
    }
};
