from PIL import Image, ImageDraw, ImageEnhance
import os

BASE_SAREE = "images/emerald_saree_real.jpg"

saree_variants = [
    ("images/saree_emerald.jpg", (0, 0, 0), "EMERALD SILK SEQUIN SAREE"),
    ("images/saree_maroon.jpg", (120, 20, 40), "ROYAL MAROON VELVET SAREE"),
    ("images/saree_blue.jpg", (20, 40, 90), "MIDNIGHT BLUE CHIFFON SAREE"),
    ("images/saree_gold.jpg", (180, 140, 30), "CHAMPAGNE GOLD TISSUE SAREE"),
    ("images/saree_peach.jpg", (180, 90, 100), "PEACH ORGANZA FLORAL SAREE"),
    ("images/saree_black.jpg", (25, 25, 30), "MIDNIGHT BLACK SEQUIN SAREE")
]

def make_saree_assets():
    if not os.path.exists(BASE_SAREE):
        print("Base Saree image missing!")
        return

    base_img = Image.open(BASE_SAREE).convert("RGB")

    for target_path, tint_rgb, label_text in saree_variants:
        img = base_img.copy()
        
        if tint_rgb != (0, 0, 0):
            overlay = Image.new("RGB", img.size, tint_rgb)
            img = Image.blend(img, overlay, 0.35)

        # Enhance contrast & sharpness
        enhancer = ImageEnhance.Contrast(img)
        img = enhancer.enhance(1.15)

        # Add elegant bottom luxury banner
        draw = ImageDraw.Draw(img)
        w, h = img.size
        
        draw.rectangle([(0, h - 45), (w, h)], fill=(12, 28, 22))
        draw.rectangle([(0, h - 45), (w, h - 42)], fill=(212, 175, 55))
        draw.text((15, h - 32), label_text, fill=(249, 243, 230))

        img.save(target_path, "JPEG", quality=95)
        print(f"Generated authentic Pakistani Saree photo: {target_path}")

if __name__ == '__main__':
    make_saree_assets()
