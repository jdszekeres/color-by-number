import os
import sys
import json
import numpy as np
from PIL import Image
import numpy as np
import glob


def create_image_json(name, colors_length, file):
    img = Image.open(file)
    # Resize the image to have the longest side equal to 64 pixels
    max_size = 64
    if img.width > img.height:
        new_width = max_size
        new_height = int((max_size / img.width) * img.height)
    else:
        new_height = max_size
        new_width = int((max_size / img.height) * img.width)
    img = img.resize((new_width, new_height), Image.LANCZOS)
    img = img.convert("P", dither=0, colors=colors_length)
    img = img.convert("RGBA")
    map = np.asarray(img).tolist()
    colors = img.convert("RGB").getcolors()
    colors = [list(color[1]) for color in colors]
    # limit colors to most distinct colors, but it can be less if there are not enough distinct colors
    colors = sorted(colors, key=lambda x: (x[0] + x[1] + x[2]), reverse=True)[
        :colors_length
    ]
    closest_color = lambda rgb: colors[
        np.argmin(np.sqrt(np.sum((colors - np.array(rgb)) ** 2, axis=1)))
    ]

    colors.sort(key=lambda x: (x[0] + x[1] + x[2]), reverse=False)

    for x, i in enumerate(map):
        for y, j in enumerate(i):
            val = j[0:-1]

            map[x][y] = colors.index(closest_color(val)) + 1
            # for d,c in enumerate(colors):
            #     if c == val:
            #         map[x][y] = d+1

    y = {}
    for i, v in enumerate(colors):
        y[i + 1] = "#%02x%02x%02x" % (v[0], v[1], v[2])

    v = {"name": name, "colors": y, "drawing": map}

    return v


def main():
    path = sys.argv[1]
    files = glob.glob(os.path.join(path, "*.jpg"))
    if not files:
        print("No image files found in the specified directory.")
        return
    json_data_all = []
    for file in files:
        name = os.path.splitext(os.path.basename(file))[0]
        json_data = create_image_json(name, 40, file)
        json_data_all.append(json_data)

    json.dump(json_data_all, open("files/images.json", "w+"))


if __name__ == "__main__":
    main()
