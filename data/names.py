#!/usr/bin/env python3

import json

for sub_id in range(493):
    id = sub_id + 1
    with open(f'{id}.json') as f:
        data = json.load(f)
    name = data['name']
    print(f'{id},{name}')
