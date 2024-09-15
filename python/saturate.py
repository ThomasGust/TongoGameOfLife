#Loop through images in assets\\saturate and saturate them

from PIL import Image
from PIL import ImageEnhance
import os

def saturate_images(image_folder, output_folder, saturation_factor=2.0):
    # List all image files in the folder
    image_files = [f for f in os.listdir(image_folder) if f.endswith(('.png', '.jpg'))]
    print(image_files)

    # Loop through all image files
    for image_file in image_files:
        img = Image.open(os.path.join(image_folder, image_file))
        #Make image more colorful
        img = img.convert("RGB")
        #No .blend
        
        img = Image.blend(img, ImageEnhance.Color(img).enhance(saturation_factor), 1.0)
        img.save(os.path.join(output_folder, image_file))

# Example usage
image_folder = "assets\\saturate"  # Folder containing individual images
output_folder = "assets\\saturated"  # Folder to save the saturated images
saturate_images(image_folder, output_folder, saturation_factor=2.0)