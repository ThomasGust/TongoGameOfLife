from PIL import Image
import os

def create_spritesheet(image_folder, output_file, tile_width=32, tile_height=32, columns=4):
    # List all image files in the folder
    image_files = [f for f in os.listdir(image_folder) if f.endswith(('.png', '.jpg'))]

    # List to store all the 32x32 tiles
    tiles = []

    # Loop through all image files
    for image_file in image_files:
        img = Image.open(os.path.join(image_folder, image_file))
        img_width, img_height = img.size
        
        # Split large images into 32x32 chunks
        for y in range(0, img_height, tile_height):
            for x in range(0, img_width, tile_width):
                tile = img.crop((x, y, min(x + tile_width, img_width), min(y + tile_height, img_height)))
                tiles.append(tile)

    # Calculate the number of rows needed based on the number of columns
    rows = (len(tiles) + columns - 1) // columns

    # Create a new image with the total size for the spritesheet
    spritesheet = Image.new('RGBA', (tile_width * columns, tile_height * rows))

    # Loop through all tiles and paste them into the spritesheet
    for index, tile in enumerate(tiles):
        x = (index % columns) * tile_width
        y = (index // columns) * tile_height
        spritesheet.paste(tile, (x, y))

    # Save the spritesheet
    spritesheet.save(output_file)

# Example usage
image_folder = "assets\\new_male"  # Folder containing individual images
output_file = "assets\\male.png"  # Name of the output spritesheet
columns = 3  # Number of columns
create_spritesheet(image_folder, output_file, columns=columns, tile_width=128, tile_height=128)