#!/usr/bin/env python3

import requests
import json
import gzip
import sys

def fetch_everything():
    for x in range(1, 493+1):
        print(f'{x}/493', end='\r')
        j = requests.get(f'https://pokeapi.co/api/v2/pokemon/{x}').json()
        with gzip.open(f'data/{x}.json.gz', 'wt') as f:
            json.dump(j, f)
    print()


def cleanup_lines(string: str) -> str:
    """
    Cleanup multiline string literal.

    Remove as much leading whitespace as is in the first (non-empty)
    line of the string, and strips all leading and trailing newlines.

    Also discards trailing whitespace from each line.
    """
    lines = string.split('\n')
    if not lines:
        return ''
    first = lines[0] or lines[1]
    indent = len(first) - len(first.lstrip())
    return '\n'.join(s.rstrip()[indent:]
                     for s in lines).strip()


def print_usage():
    print(cleanup_lines(
        f'''
        Usage:
            {sys.argv[0]} --really

        Downloads the first 493 Pokémon from Pokeapi, which takes a
        while becouse it becomes rate limited imidiately.
        '''))
    print()


def main():
    if len(sys.argv) == 1:
        print_usage()
        return

    if sys.argv[1] != '--really':
        print_usage()
        return

    fetch_everything()

if __name__ == '__main__':
    main()
