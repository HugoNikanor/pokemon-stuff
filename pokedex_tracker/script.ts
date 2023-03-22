/* Offsets when working with raw ImageData */
const R = 0;
const G = 1;
const B = 2;
const A = 3;

/* Size of Nintendo DS screen */
const screen_width = 168
const screen_height = 160

/* Size of all characters in font */
const char_height = 10
const char_width = 6

/* Size of the battle sprite of a Pokemon */
const sprite_width = 80;
const sprite_height = 80;

/* Size of the box icon of a Pokemon */
const icon_height = 32;
const icon_width = 32;

// 8 in from left, right, bottom
// 40 in from top
const box_offset_top = 40
const box_offset_side = 10
const box_width = screen_width - 2 * box_offset_side
const box_height = screen_height - box_offset_side - box_offset_top
const box_slot_width = box_width / 6
const box_slot_height = box_height / 5

/* Number of boxes on screen */
const box_x_count = 3
const box_y_count = 6

let event_pokemon = new Set([151, 251, 385, 386, 490, 491, 492, 493])

const obtained_pokemon = new Set(JSON.parse(window.localStorage.getItem('obtained_pokemon') || '[]'))
let pokemon_images: { [index: number]: [ImageBitmap, ImageBitmap] }

// obtained_pokemon.add(1);

type Font = {
    [index: string]: ImageBitmap
}

let font: Font

type FontPage = {
    x: number,
    y: number,
    c: string[],
    space_x: number,
    space_y: number,
    name?: string,
}


/* Information for loading the fonts from our spritesheet.
   x and y specify where in the spritesheet we should start looking
   c specifies which characters are there
   Letter layout is determined by layout of array `c'.
*/

/* For Pokeman Diamond Pearl - Text Entry Screen & Font */
const font_pages_1: FontPage[] = [
    {
        x: 547,
        y: 534,
        c: [
            "ABCDEFGHIJKLM",
            "NOPQRSTUVWXYZ",
            "abcdefghijklm",
            "nopqrstuvwxyz",
            "0123456789., ",
        ],
        space_x: 10,
        space_y: 9,
    },
    {
        x: 803,
        y: 534,
        c: [
            "0123456789 !?",
            "ä。,.…⋅~:;/ ♂♀",
            "「」『』()+-×÷=%@",
            "◎○□△å♥♠♦♣★♪  ",
            "☀ö☂☃ÅÅÅÅÅÅÅ  ",
            // ä is an unknown punctuation mark
            // å should be a white rhoumbous
            // ö is just a blob
            // Å since I couldn't be bothered
        ],
        space_x: 10,
        space_y: 9,
    }
];

/* For HeartGold SoulSilver - Fonts */

let charmap = [
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklm",
    "nopqrstuvwxyzÀÁÂÄÇÈÉÊËÌÍÎÏÑÒÓÔÖ×ÙÚÛÜßàáâäåçèéêëìí",
    "îïñòóôö÷ùúûüŒœªº���$¡¿!?,.…·/‘’“”„«»()♂♀+-*#=&~:;",
    "♠♣♥♦★�○□△�@🎵%☀�☂����⭜⭝💤ᵉ",
    // jp1
    // jp2
    // jp3
    // jp4 (including western characters with japaneese spacing)
    // jp5 (special characters)
]

const font_pages_2: FontPage[] = [
    {
        name: "Regular",
        x: 0,
        y: 0,
        space_x: 0,
        space_y: 0,
        c: charmap,
    },
    {
        name: "Dim",
        x: 0,
        y: 0,
        space_x: 0,
        space_y: 0,
        c: charmap,
    },
    {
        name: "Inverted",
        x: 0,
        y: 0,
        space_x: 0,
        space_y: 0,
        c: charmap,
    },
    {
        name: "Unknown",
        x: 0,
        y: 0,
        space_x: 0,
        space_y: 0,
        c: ["ABCDEFGHIJKLMNOPQRSTUVWXYZ?!"]
    },
]

const font_pages = font_pages_1

// regular
// dim
// inverted
// inverted bold
// Unknown

// ª FEMININE ORDINAL INDICATOR
// º MASCULINE ORDINAL INDICATOR

// "'" = "’"
// '"' = '”'

/* For some Pokemon alternative forms have been omitted, and are instead
reported as "blanks". This is to ensure that the small icons are always in the
top right of the pokemons block. */

/* Number of blank slots after number, defaults to 0 */
let blanks: { [index: number]: number } = {
    177: 1,
    201: 13,
    224: 1,
    351: 1,
    395: 1,
    417: 1,
    421: 1,
    422: 1,
    453: 1,
    492: 5,
}

/* Number of alternative forms of pokemon */
let multiple_forms: { [index: number]: number } = ({
    // sheet 1, 1 - 151
    3: 2, 12: 2, 19: 2, 20: 2, 25: 2, 26: 2, 41: 2, 42: 2, 44: 2, 45: 2, 64: 2,
    65: 2, 84: 2, 85: 2, 97: 2, 111: 2, 112: 2, 118: 2, 119: 2, 123: 2, 129: 2,
    130: 2,
    // sheet 2, 152 - 251
    154: 2, 165: 2, 166: 2, 178: 2, 185: 2, 186: 2, 190: 2, 194: 2, 195: 2,
    198: 2, 202: 2, 203: 2, 207: 2, 208: 2, 212: 2, 214: 2, 215: 2, 217: 2,
    221: 2, 229: 2, 232: 2,
    // sheet 3, 252 - 386
    255: 2, 256: 2, 257: 2, 267: 2, 269: 2, 272: 2, 274: 2, 275: 2, 307: 2,
    308: 2, 315: 2, 316: 2, 317: 2, 322: 2, 323: 2, 332: 2, 350: 2, 358: 2,
    369: 2, 386: 4,
    // sheet 4, 387 - 493
    396: 2, 397: 2, 398: 2, 399: 2, 400: 2, 401: 2, 402: 2, 403: 2, 404: 2,
    405: 2, 407: 2, 412: 3, 413: 3, 415: 2, 417: 2, 418: 2, 419: 2, 422: 2,
    423: 2, 424: 2, 443: 2, 444: 2, 445: 2, 449: 2, 450: 2, 453: 2, 454: 2,
    456: 2, 457: 2, 459: 2, 460: 2, 461: 2, 464: 2, 465: 2, 473: 2, 479: 6,
    487: 2, 492: 2,
})

function add_pokemon(no: number) {
    obtained_pokemon.add(no);
    window.localStorage.setItem('obtained_pokemon', JSON.stringify([...obtained_pokemon]))
}

function remove_pokemon(no: number) {
    obtained_pokemon.delete(no)
    window.localStorage.setItem('obtained_pokemon', JSON.stringify([...obtained_pokemon]))
}

/* Replace all pixels in image which match color with transparency.
   Uses the top left pixels color as  transparency if none is given */
async function fix_transparency(
    ctx: CanvasRenderingContext2D,
    bitmap: ImageBitmap,
    color?: [number, number, number],
): Promise<ImageBitmap> {
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.drawImage(bitmap, 0, 0);

    // const imageData = ctx.getImageData(0, 0, sprite_width, sprite_height);
    const imageData = ctx.getImageData(0, 0, bitmap.width, bitmap.height);
    const dat = imageData.data;
    const transparency = color || [dat[0], dat[1], dat[2]];

    for (let y = 0; y < bitmap.height; y++) {
        for (let x = 0; x < bitmap.width; x++) {
            // let idx = (y * sprite_width + x) * 4;
            let idx = (y * bitmap.width + x) * 4;
            if (transparency[R] == dat[idx + R] &&
                transparency[G] == dat[idx + G] &&
                transparency[B] == dat[idx + B]) {
                dat[idx + A] = 0;
            }
        }
    }

    ctx.putImageData(imageData, 0, 0);

    return createImageBitmap(ctx.canvas, 0, 0, bitmap.width, bitmap.height)
}

async function turn_grayscale(
    ctx: CanvasRenderingContext2D,
    bitmap: ImageBitmap,
): Promise<ImageBitmap> {
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.drawImage(bitmap, 0, 0);

    // const imageData = ctx.getImageData(0, 0, sprite_width, sprite_height);
    const imageData = ctx.getImageData(0, 0, bitmap.width, bitmap.height);
    const dat = imageData.data;

    for (let y = 0; y < bitmap.height; y++) {
        for (let x = 0; x < bitmap.width; x++) {
            // let idx = (y * sprite_width + x) * 4;
            let idx = (y * bitmap.width + x) * 4;
            const c = 0.2126 * dat[idx + R]
                + 0.7152 * dat[idx + G]
                + 0.0722 * dat[idx + B];
            dat[idx + R] = c;
            dat[idx + G] = c;
            dat[idx + B] = c;
        }
    }

    ctx.putImageData(imageData, 0, 0);

    return createImageBitmap(ctx.canvas, 0, 0, bitmap.width, bitmap.height)
}


async function load_pokemon_sprites(
    ctx: CanvasRenderingContext2D,
    filename: string,
    first: number,
    last: number,
): Promise<[ImageBitmap, ImageBitmap][]> {
    const spritesheet = new Image();
    spritesheet.src = filename;

    /* Height of header for each pokemon in spritesheet */
    let header_height = icon_height + 2;

    /* Total size of one entry. Note that pokemon with multiple forms will be
    larger */
    let full_width = 4 * sprite_width + 4;
    let full_height = 2 * sprite_height + header_height + 1;

    return new Promise((resolve, _) => {

        spritesheet.onload = async function() {

            let count_x = Math.floor(spritesheet.width / full_width);
            let count_y = Math.floor(spritesheet.height / full_height);

            let items: [ImageBitmap, ImageBitmap][] = []

            // for (let y = 0; y < count_y; y++) {
            let idx_offset = 0;
            for (let idx = 0; idx < (last - first) + 1; idx++) {
                let x = (idx + idx_offset) % count_x;
                let y = Math.floor((idx + idx_offset) / count_x);
                idx_offset += (multiple_forms[idx + first] || 1) - 1;
                idx_offset += (blanks[idx + first] || 0);

                let front1_x = x * full_width + 1;
                let front1_y = y * full_height + header_height;

                let icon1_x = x * full_width + (multiple_forms[idx + first] || 1) * full_width - 2 * icon_width - 1;
                let icon1_y = y * full_height + 1;

                let icon = createImageBitmap(
                    spritesheet,
                    icon1_x, icon1_y,
                    icon_width, icon_height)
                    .then(x => fix_transparency(ctx, x))

                if (event_pokemon.has(idx + first)) {
                    icon = icon.then(x => turn_grayscale(ctx, x))
                }

                items.push([
                    await createImageBitmap(
                        spritesheet,
                        front1_x, front1_y,
                        sprite_width, sprite_height)
                        .then(x => fix_transparency(ctx, x))
                        .then(x => turn_grayscale(ctx, x)),
                    await icon
                ])
            }

            resolve(items)
        }
    })
}

async function load_backgrounds(
): Promise<ImageBitmap[]> {
    const spritesheet = new Image();
    spritesheet.src = 'sprites/DS DSi - Pokemon Platinum - Box System.png'
    return new Promise((resolve, _) => {
        spritesheet.onload = async function() {
            let items = []
            for (let y = 0; y < 11; y++) {
                for (let x = 0; x < 3; x++) {
                    let sx = x * screen_width + x * 3 + 6;
                    let sy = y * screen_height + y * 3 + 119;
                    items.push(await createImageBitmap(
                        spritesheet,
                        sx, sy,
                        screen_width,
                        screen_height))
                }
            }
            items.pop();
            resolve(items);
        }
    })
}


function load_text(
    ctx: CanvasRenderingContext2D,
): Promise<Font> {
    const spritesheet = new Image();
    spritesheet.src = 'sprites/DS DSi - Pokemon Diamond Pearl - Text Entry Screen & Font.png'
    return new Promise((resolve, _) => {
        spritesheet.onload = async function() {
            let chars: { [index: string]: ImageBitmap } = {}
            for (let fontpage of font_pages) {
                for (let row = 0; row < fontpage.c.length; row++) {
                    for (let col = 0; col < fontpage.c[row].length; col++) {
                        let sx = col * (char_width + fontpage.space_x) + fontpage.x
                        let sy = row * (char_height + fontpage.space_y) + fontpage.y
                        chars[fontpage.c[row][col]]
                            = await fix_transparency(ctx,
                                await createImageBitmap(spritesheet, sx, sy,
                                    char_width + 1, char_height),
                                [0, 255, 0])
                    }
                }
            }
            resolve(chars);
        }
    })
}

function draw_box(
    ctx: CanvasRenderingContext2D,
    description: string,
    background: ImageBitmap,
    pokemon: (number | null)[],
    off_x: number,
    off_y: number,
) {

    ctx.drawImage(background, off_x, off_y);

    for (let i = 0; i < 30; i++) {
        let pkmn = pokemon[i];
        if (typeof pkmn !== 'number') continue;
        if (pkmn < 0 || pkmn >= 493) continue;
        let sp: ImageBitmap | null = pokemon_images[pkmn][1]
        if (!sp) continue;
        let x = (i % 6) * box_slot_width + box_slot_width / 2 - sp.width / 2 + 8;
        let y = (Math.floor(i / 6) + 1) * box_slot_height - sp.height + box_offset_top;
        ctx.drawImage(sp, off_x + Math.floor(x), off_y + Math.floor(y))
    }

    let letter_spacing = 1;
    let x = (screen_width / 2)
        - (description.length * char_width
            + (description.length - 1) * letter_spacing)
        / 2 + off_x;
    for (let c of description) {
        let sp = font[c] || font['~']
        ctx.drawImage(sp, x, off_y + 15);
        x += char_width + letter_spacing;
    }
}

function update_status_bar() {
    let status_bar = document.getElementById('status')!;
    status_bar.textContent = `${493 - obtained_pokemon.size} / 493`
}

window.addEventListener('load', async function() {

    update_status_bar();

    pokemon_images = await (async function() {
        const canvas = document.createElement('canvas');
        canvas.width = 80;
        canvas.height = 80;
        const ctx = canvas.getContext('2d')!

        let counts: [string, number, number][] = [
            ['1st', 1, 151],
            ['2nd', 152, 251],
            ['3rd', 252, 386],
            ['4th', 387, 493]
        ];

        let fin: [ImageBitmap, ImageBitmap][] = []
        for (let count of counts) {
            fin = fin.concat(await load_pokemon_sprites(
                ctx,
                `sprites/DS DSi - Pokemon Platinum - Pokemon ${count[0]} Generation.png`,
                count[1],
                count[2]))
        }
        return fin
    })()

    let backgrounds = await load_backgrounds();

    font = await (async function() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        return load_text(ctx);
    })()

    const canvas = document.getElementById('box-canvas') as HTMLCanvasElement
    canvas.width = screen_width * box_x_count
    canvas.height = screen_height * box_y_count
    let ctx = canvas.getContext('2d')!;

    window.setInterval(() => {
        for (let y = 0; y < box_y_count; y++) {
            for (let x = 0; x < box_x_count; x++) {
                let idx = y * box_x_count + x
                let start = idx * 30
                let end = Math.min(start + 30, 493);
                let desc = idx == 17 ? "MISC" : `${start + 1}-${end}`
                draw_box(ctx,
                    desc,
                    backgrounds[y * box_x_count + x],
                    // sprites.slice(start, end).map((p) => p[1]),
                    Array.from({ length: end - start }, (x, i) => i + start)
                        .map((idx) => obtained_pokemon.has(idx)
                            ? idx
                            : null),
                    x * screen_width,
                    y * screen_height);
            }
        }
    },
        1000 / 60)

    canvas.addEventListener('click', function(e) {
        let gx = e.offsetX
        let gy = e.offsetY
        let x = gx % screen_width
        let y = gy % screen_height

        let bx = Math.floor(gx / screen_width)
        let by = Math.floor(gy / screen_height)
        let box_number = by * box_x_count + bx

        x -= box_offset_side
        y -= box_offset_top

        if (x < 0 || y < 0 || x >= box_width || y >= box_height) return;

        let sx = Math.round((x - box_slot_width / 2) / box_slot_width)
        let sy = Math.round((y - box_slot_height / 2) / box_slot_height)

        let idx = Math.max(0, Math.min(30 - 1, sy * 6 + sx))

        let pkmn = box_number * 30 + idx
        if (obtained_pokemon.has(pkmn)) {
            remove_pokemon(pkmn);
        } else {
            add_pokemon(pkmn);
        }
        update_status_bar();


    });

});

