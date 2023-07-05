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


`data`
------

Various data downloaded from https://pokeapi.co. An individual gziped json file for each pokemon is used as a tradeoff between space and speed.

`sprites`
---------

Different sprites from Pokemon Platinum (and others), downloaded from Spriters Resource.
