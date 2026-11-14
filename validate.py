#!/usr/bin/env python3
"""Checks research.json before every push. Exit code 1 = do not publish."""
import json, re, sys
p = sys.argv[1] if len(sys.argv) > 1 else 'research.json'
d = json.load(open(p))
err = []
BAD = re.compile(r'[<>]|javascript:|\bcure[sd]?\b|\bguarantee[sd]?\b|\bmiracle\b|\bproven to\b', re.I)
REQ = ['id', 'cats', 'study', 'title', 'finding', 'design', 'badge', 'added']
assert d.get('schema') == 1 and re.match(r'\d{4}-\d{2}-\d{2}$', d.get('updated', '')), 'bad header'
for k, pg in d['pages'].items():
    keys = {f['key'] for f in pg['filters']}
    ids = set()
    for s in pg['studies']:
        w = f"{k}/{s.get('id')}"
        for f in REQ:
            if not s.get(f): err.append(f'{w}: missing {f}')
        if s.get('id') in ids: err.append(f'{w}: duplicate id')
        ids.add(s.get('id'))
        if s.get('badge') not in ('dark', 'gold', 'tint', 'dashed'): err.append(f'{w}: bad badge')
        if (s.get('url') or s.get('auto')) and not re.match(r'^https://[^\s"\'<>]+$', s.get('url', '')): err.append(f'{w}: url must be https')
        for c in s.get('cats', []):
            if c not in keys or c == 'all': err.append(f'{w}: unknown category {c}')
        for f in ['study', 'meta', 'title', 'studied', 'finding', 'limit', 'design']:
            v = s.get(f, '')
            if len(v) > 320: err.append(f'{w}: {f} too long')
            if s.get('auto') and BAD.search(v): err.append(f'{w}: banned word or character in {f}')
        if s.get('auto') and not s.get('limit'): err.append(f'{w}: auto entries need a limitation')
if err:
    print('\n'.join(err)); sys.exit(1)
print('OK', {k: len(v['studies']) for k, v in d['pages'].items()})
