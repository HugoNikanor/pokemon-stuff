convert -extract 20x20+256+2501 \
	-fill '#0000' \
	-draw 'color 0,0 floodfill' \
	-draw 'color 19,19 floodfill' \
	-draw 'color 0,19 floodfill' \
	-draw 'color 19,0 floodfill' \
	'DS DSi - Pokemon Platinum - Box System.png' cursor.png

