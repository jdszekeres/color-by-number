import glob
import os
import json


def find_arrays(directory):
    fs = glob.glob(os.path.join(directory, "*.json"))
    l = []
    for file in fs:
        with open(file, "r") as f:
            try:
                data = json.load(f)
                if isinstance(data, list):
                    l.extend(data)
            except json.JSONDecodeError:
                continue
    return l


def paginate_arrays(array, page_size):
    for i in range(0, len(array), page_size):
        yield array[i : i + page_size]


def main():
    directory = "files"
    arrays = find_arrays(directory)
    print(len(arrays), "arrays found")
    arrays.sort(key=lambda x: x["name"])
    paginated_arrays = paginate_arrays(arrays, 3)
    if not os.path.exists("drawings"):
        os.makedirs("drawings")
    cnt = 0
    for page_number, page in enumerate(paginated_arrays):
        cnt += 1
        f = open(f"drawings/page_{page_number + 1}.json", "w")
        json.dump(page, f)
        f.close()

    info = {"total_arrays": len(arrays), "arrays_per_page": 3, "total_pages": cnt}
    with open("drawings/info.json", "w") as f:
        json.dump(info, f)


main()
