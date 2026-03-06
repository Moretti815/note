export class PetalParser {
    constructor(rules = []) {
        this.customRules = this._initRules(rules);
    }

    _initRules(rules) {
        return rules.map(r => ({
            ...r,
            openTag: r.open_tag || r.openTag || null,
            closeTag: r.close_tag || r.closeTag || null
        }));
    }

    getStyles(globalCss = '') {
        const rulesCss = this.customRules.map(r => r.css).filter(Boolean).join('\n');
        return [globalCss, rulesCss].filter(Boolean).join('\n');
    }

    parse(str) {
        return this.render(this.tokenize(str));
    }

    tokenize(str) {
        let tokens = [], i = 0, len = str.length;
        while (i < len) {
            if (str[i] === '\\' && i + 1 < len) { tokens.push({ type: 'text', val: str[i + 1] }); i += 2; continue; }
            let matched = false;
            for (let r of this.customRules) {
                if (r.regex) {
                    let ruleMatched = false;
                    if (r.openTag && r.closeTag && r.openTag !== r.closeTag && str.startsWith(r.openTag, i)) {
                        let d = 0, j = i;
                        while (j < len) {
                            if (str[j] === '\\' && j + 1 < len) { j += 2; continue; }
                            if (str.startsWith(r.openTag, j)) { d++; j += r.openTag.length; }
                            else if (str.startsWith(r.closeTag, j)) { d--; j += r.closeTag.length; if (d === 0) break; }
                            else j++;
                        }
                        if (d === 0) {
                            let outer = str.slice(i, j), masked = outer, masks = [];
                            if (outer.indexOf(r.openTag, r.openTag.length) > -1) {
                                let out = outer.substring(0, r.openTag.length), innerD = 0, sIdx = -1;
                                for (let k = r.openTag.length; k < outer.length - r.closeTag.length; ) {
                                    if (outer[k] === '\\' && k + 1 < outer.length) { 
                                        if (innerD === 0) out += outer.substring(k, k+2); 
                                        k += 2; continue; 
                                    }
                                    if (outer.startsWith(r.openTag, k)) { if (innerD === 0) sIdx = k; innerD++; k += r.openTag.length; }
                                    else if (outer.startsWith(r.closeTag, k)) {
                                        innerD--; k += r.closeTag.length;
                                        if (innerD === 0 && sIdx > -1) {
                                            let key = `__M${masks.length}__`;
                                            masks.push({ key, val: outer.substring(sIdx, k) });
                                            out += key; sIdx = -1;
                                        }
                                    } else { if (innerD === 0) out += outer[k]; k++; }
                                }
                                masked = out + outer.substring(outer.length - r.closeTag.length);
                            }
                            let rx = new RegExp('^' + r.regex.replace(/^\^/, ''), (r.flags || '').replace(/g/g, ''));
                            let m = masked.match(rx);
                            if (m) {
                                let resMatch = m.map(g => {
                                    if (!g) return g;
                                    let s = g; masks.forEach(mk => s = s.split(mk.key).join(mk.val)); return s;
                                });
                                tokens.push({ type: 'custom_regex', rule: r, match: resMatch });
                                i = j; ruleMatched = true;
                            }
                        }
                    } else {
                        let rx = new RegExp('^' + r.regex.replace(/^\^/, ''), (r.flags || '').replace(/g/g, ''));
                        let m = str.slice(i).match(rx);
                        if (m) { tokens.push({ type: 'custom_regex', rule: r, match: m }); i += m[0].length; ruleMatched = true; }
                    }
                    if (ruleMatched) { matched = true; break; }
                } else if (r.prefix && r.suffix) {
                    if (str.startsWith(r.prefix, i)) {
                        let end = str.indexOf(r.suffix, i + r.prefix.length);
                        if (end > -1) { tokens.push({ type: 'custom_prefix', rule: r, content: str.slice(i + r.prefix.length, end) }); i = end + r.suffix.length; matched = true; break; }
                    }
                }
            }
            if (matched) continue;
            tokens.push({ type: 'text', val: str[i] }); i++;
        }
        return tokens.reduce((a, c) => {
            if (c.type === 'text' && a.length && a[a.length - 1].type === 'text') a[a.length - 1].val += c.val;
            else a.push(c); return a;
        }, []);
    }

    render(tokens) {
        return tokens.map(t => {
            if (t.type === 'text') return t.val;
            if (t.type === 'custom_regex') return t.rule.replacement.replace(/\$(\d)/g, (_, p1) => this.parse(t.match[parseInt(p1)] || '')).replace(/@(\d)/g, (_, p1) => t.match[parseInt(p1)] || '');
            if (t.type === 'custom_prefix') return t.rule.replacement.replace(/\$1/g, this.parse(t.content));
            return '';
        }).join('');
    }
}
