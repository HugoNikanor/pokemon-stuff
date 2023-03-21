.PHONY: all
all:
	tsc

cursor20.png:
	ln -s cursor.png $@

cursor40.png: cursor20.png
	convert $< -resize 40x40 $@
