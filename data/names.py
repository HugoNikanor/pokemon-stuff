#!/usr/bin/env python3

import gzip
import json

out = {}
for sub_id in range(493):
    id = sub_id + 1
    with gzip.open(f'{id}.json.gz', 'rt') as f:
        data = json.load(f)
    out[id] = data['name']
print(out)
