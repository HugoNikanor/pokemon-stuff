#!/usr/bin/env python3

import json
import gzip

result = []
for i in range(1, 493 + 1):
    with open(f'{i}.json') as f:
        data = json.load(f)
    result.append({ st['stat']['name']: st['base_stat'] for st in data['stats'] })

with gzip.open('base_stats.json.gz', 'wt') as f:
    json.dump(result, f)


