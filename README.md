Various Pokemon Utilities
=========================

Various scripts for tracking pokemon in different ways.

Pokedex tracker
---------------

Interactive tracker for a Platinum living Dex.

Uses local storage so should be run through a server.

Requires that `sprites` is populated.

### Quick update

Run these in your JS console. Changes will save once you click
anything.

#### Add all Pokémon
    (function () { for (let i = 0; i < 493; i++) obtained_pokemon.add(i);})()

#### Remove all Pokémon
    obtained_pokemon = new Set()


### Savefile encoding

"Saves" are implemented as a bit set (each bit represents if that entry is
present or absent). This means that $\left\lceil\frac{493}{8}\right\rceil = 62$ bytes needs to be
encoded. Different alternatives is presented in the table below. Currently
base16 is chosen, since Javascript's `atob` and `btoa` don't work on byte
arrays...


| scheme                 | len                | sample                                                                                                                         |
|------------------------|--------------------|:-------------------------------------------------------------------------------------------------------------------------------|
| base16                 | 124                | `000000000000000000000000000000000000100000000000000000000000800500e00080012000000083010000001c200200000000c0001000000000000c` |
| base64                 | 84                 | `AAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAgAUA4ACAASAAAACDAQAAABwgAgAAAADAABAAAAAAAAw=`                                         |
| [base65536][BASE65536] | 31[†](#footnote-1) | `㐀㐀㐀㐀㐀㐀㐀㐀㐀㐐㐀㐀㐀㐀㐀㦀𦘀𠘀唁㐀𠤀㐁㐀唜㐂㐀𤘀䐀㐀㐀䀀`                                                               |

<a id="footnote-1"/>
† <span style="font-size: 80%">This references abstract characters, it's "true" size is 97 bytes.</span>

`data`
------

Various data downloaded from https://pokeapi.co. An individual gziped json file for each pokemon is used as a tradeoff between space and speed.

`sprites`
---------

Different sprites from Pokemon Platinum (and others), downloaded from Spriters Resource.

[BASE65536]: https://github.com/qntm/base65536
