from PIL import Image
import os

# Render images on top of each other
def render(paths, op):
    images = [Image.open(path).convert("RGBA") for path in paths]
    
    # Start with the first image as the base
    base_image = images[0]
    
    # Overlay each subsequent image on top of the base image
    for image in images[1:]:
        base_image.paste(image, (0, 0), image)  # Use the image as the mask for transparency
    
    # Save the final image
    base_image.save(op)

if __name__ == "__main__":
    # Get all the images in the assets folder
    paths = [
        "assets\\_backgrounds\\tongo_background-level-01-grass.png",
        "assets\\_backgrounds\\tongo_background-level-01-trees.png",
        "assets\\_backgrounds\\tongo_background-level-01-houses.png",
    ]
    
    render(paths, "output.png")
