import tkinter as tk
from tkinter import filedialog
from PIL import Image, ImageTk

def resize_image(image, max_width=800, max_height=600):
    """Resize the image to fit within the specified dimensions while maintaining aspect ratio."""
    original_width, original_height = image.size
    ratio = min(max_width / original_width, max_height / original_height)
    new_width = int(original_width * ratio)
    new_height = int(original_height * ratio)
    resized_image = image.resize((new_width, new_height), Image.ANTIALIAS)
    return resized_image

def select_image():
    """Open a file dialog to choose an image, and open the image in a new window with click to pick color."""
    path = filedialog.askopenfilename()
    if not path:
        return

    root = tk.Tk()
    root.title("Select Color with Eyedropper")

    # Load the image
    img = Image.open(path)
    resized_img = resize_image(img)  # Resize the image to fit the window
    img_tk = ImageTk.PhotoImage(resized_img)

    # Setup the image label
    label = tk.Label(root, image=img_tk)
    label.pack()

    def on_click(event):
        # Calculate the original image coordinates of the clicked point
        x = int(event.x / resized_img.width * img.width)
        y = int(event.y / resized_img.height * img.height)
        rgb = img.getpixel((x, y))

        # Print and store the RGB value, then close the window
        print("Selected color:", rgb)
        root.destroy()  # Close the window after color selection

    # Bind the click event
    label.bind("<Button-1>", on_click)

    root.mainloop()

if __name__ == "__main__":
    selected_color = select_image()
    print("You selected:", selected_color)
    # You can now use `selected_color` to find hotspots in the image
