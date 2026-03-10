export class PetalParser {
    constructor(rules = []) {
        this.customRules = this._initRules(rules);
    }

    _initRules(rules) {
        return rules.map(r => {
            let oR = r.openRegex || r.open_regex;
            let cR = r.closeRegex || r.close_regex;
            return {
                ...r,
                openTag: r.open_tag || r.openTag || null,
                closeTag: r.close_tag || r.closeTag || null,
                oRgx: oR ? new RegExp(oR, 'y') : null,
                cRgx: cR ? new RegExp(cR, 'y') : null,
            };
        });
    }

    getStyles(globalCss = '') {
        const rulesCss = this.customRules.map(r => r.css).filter(Boolean).join('\n');
        return [globalCss, rulesCss].filter(Boolean).join('\n');
    }

    _matchLen(str, index, rgx, tag) {
        if (rgx) {
            rgx.lastIndex = index;
            let m = rgx.exec(str);
            return m ? m[0].length : 0;
        }
        return (tag && str.startsWith(tag, index)) ? tag.length : 0;
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
                    let hasBounds = (r.oRgx && r.cRgx) || (r.openTag && r.closeTag && r.openTag !== r.closeTag);
                    let openLen = this._matchLen(str, i, r.oRgx, r.openTag);
                    
                    if (hasBounds && openLen > 0) {
                        let d = 0, j = i;
                        let lastCloseLen = 0;
                        while (j < len) {
                            if (str[j] === '\\' && j + 1 < len) { j += 2; continue; }
                            let oL = this._matchLen(str, j, r.oRgx, r.openTag);
                            if (oL > 0) { d++; j += oL; continue; }
                            let cL = this._matchLen(str, j, r.cRgx, r.closeTag);
                            if (cL > 0) { d--; j += cL; if (d === 0) { lastCloseLen = cL; break; } continue; }
                            j++;
                        }
                        if (d === 0) {
                            let outer = str.slice(i, j), masked = outer, masks = [];
                            
                            let hasNested = false;
                            for (let testK = openLen; testK < outer.length - lastCloseLen; testK++) {
                                if (this._matchLen(outer, testK, r.oRgx, r.openTag) > 0) { hasNested = true; break; }
                            }

                            if (hasNested) {
                                let out = outer.substring(0, openLen), innerD = 0, sIdx = -1;
                                for (let k = openLen; k < outer.length - lastCloseLen; ) {
                                    if (outer[k] === '\\' && k + 1 < outer.length) { 
                                        if (innerD === 0) out += outer.substring(k, k+2); 
                                        k += 2; continue; 
                                    }
                                    let oL = this._matchLen(outer, k, r.oRgx, r.openTag);
                                    if (oL > 0) { 
                                        if (innerD === 0) sIdx = k; 
                                        innerD++; k += oL; continue; 
                                    }
                                    let cL = this._matchLen(outer, k, r.cRgx, r.closeTag);
                                    if (cL > 0) {
                                        innerD--; 
                                        if (innerD === 0 && sIdx > -1) {
                                            let key = `__M${masks.length}__`;
                                            masks.push({ key, val: outer.substring(sIdx, k + cL) });
                                            out += key; sIdx = -1;
                                        }
                                        k += cL; continue;
                                    } 
                                    if (innerD === 0) out += outer[k]; 
                                    k++; 
                                }
                                masked = out + outer.substring(outer.length - lastCloseLen);
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
