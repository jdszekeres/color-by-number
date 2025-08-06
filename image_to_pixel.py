import os
import sys
import json
import PIL
import numpy as np
from PIL import Image
import numpy as np
name = input("Name: ")
colors = int(input("How many colors in image? "))
to_load = sys.argv[-1]

img = Image.open(to_load)
img = img.convert('P',dither=0,colors=colors)
img = img.convert('RGBA')
map = np.asarray(img).tolist()
colors = img.convert('RGB').getcolors()
colors = [list(color[1]) for color in colors]
closest_color = lambda rgb: colors[np.argmin(np.sqrt(np.sum((colors - np.array(rgb))**2, axis=1)))]
for x,i  in enumerate(map):
    for y,j in enumerate(i):
        val = j[0:-1]
        
        map[x][y] = colors.index(closest_color(val)) + 1
        # for d,c in enumerate(colors):
        #     if c == val:
        #         map[x][y] = d+1

y={}
for i, v in enumerate(colors):
    y[i+1] = '#%02x%02x%02x' % (v[0], v[1], v[2])


v = {
    "name": name,
    "colors": y,
    "drawing": map
}

json.dump(v,open(name+".json","w+"))