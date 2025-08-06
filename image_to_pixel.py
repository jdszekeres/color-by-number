import os
import sys
import json
import numpy as np
from PIL import Image
import numpy as np
import glob


def create_image_json(name, file):
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
    colors = img.convert("P").convert("RGBA").convert("RGB").getcolors()
    print(f"Image: {name}, Colors: {len(colors)}")
    colors = [list(color[1]) for color in colors]
    # Remove similar colors (keep only unique colors more than 10 units apart)
    unique_colors = []
    for c in colors:
        if all(np.linalg.norm(np.array(c) - np.array(u)) > 10 for u in unique_colors):
            unique_colors.append(c)
    colors = unique_colors
    print(f"Unique Colors: {len(colors)}")

    # Get a maximum of 16 colors
    if len(colors) > 16:
        # Get the 16 colors with the widest distribution
        colors = sorted(colors, key=lambda c: np.linalg.norm(np.array(c)))[:16]
    img = img.convert("P", dither=0, colors=colors)
    img = img.convert("RGBA")
    map = np.asarray(img).tolist()

    closest_color = lambda rgb: colors[
        np.argmin(np.sqrt(np.sum((colors - np.array(rgb)) ** 2, axis=1)))
    ]
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
        json_data = create_image_json(name, file)
        json_data_all.append(json_data)

    json.dump(json_data_all, open("images.json", "w+"))


if __name__ == "__main__":
    main()
