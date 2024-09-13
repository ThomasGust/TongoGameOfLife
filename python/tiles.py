import json
import os

file_paths = []
for fname in os.listdir("assets\\tiles"):
    if fname.endswith(('.png', '.jpg')):
        file_paths.append({'path': os.path.join("assets\\tiles", fname), 'name': fname.split('.')[0]})

with open('assets\\tiles\\tiles.json', 'w') as f:
    json.dump({'files': file_paths}, f, indent=4)