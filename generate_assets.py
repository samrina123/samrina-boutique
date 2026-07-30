from PIL import Image, ImageDraw, ImageFont, ImageEnhance
import os

IMG_DIR = "images"

# Map of product category & title to base background image and distinct color tint
asset_map = {
    # --- SAREES (Unique Saree Banners & Overlays) ---
    "images/saree_banarasi.jpg": ("images/emerald_gown.jpg", (15, 56, 44), "SAREE - BANARASI SILK"),
    "images/saree_chiffon.jpg": ("images/chiffon_formal.jpg", (20, 40, 80), "SAREE - PEARL CHIFFON"),
    "images/saree_organza.jpg": ("images/organza_bridal.jpg", (40, 70, 50), "SAREE - ORGANZA SILK"),
    "images/saree_kanjeevaram.jpg": ("images/maroon_pret.jpg", (120, 20, 30), "SAREE - KANJEEVARAM BRIDAL"),
    "images/saree_net.jpg": ("images/blush_formal.jpg", (150, 80, 100), "SAREE - SEQUIN NET"),
    "images/saree_gold.jpg": ("images/gold_bridal.jpg", (180, 140, 40), "SAREE - METALLIC TISSUE"),

    # --- SHALWAR KAMEEZ (Unique Shalwar Suits Overlays) ---
    "images/shalwar_rose.jpg": ("images/blush_formal.jpg", (160, 60, 90), "TRADITIONAL - ROSE PINK"),
    "images/shalwar_tulip.jpg": ("images/emerald_gown.jpg", (20, 80, 50), "TULIP SHALWAR SUIT"),
    "images/shalwar_patiala.jpg": ("images/lawn_pret.jpg", (190, 140, 20), "PATIALA SUIT SET"),
    "images/shalwar_black.jpg": ("images/maroon_pret.jpg", (30, 30, 35), "MIRROR WORK SHALWAR"),
    "images/shalwar_blue.jpg": ("images/chiffon_formal.jpg", (25, 60, 120), "CLASSIC SHALWAR KAMEEZ"),
    "images/shalwar_velvet.jpg": ("images/rawsilk_formal.jpg", (80, 20, 80), "VELVET LACE SHALWAR"),

    # --- CASUAL WEAR ---
    "images/casual_cotton.jpg": ("images/lawn_pret.jpg", (50, 100, 70), "CASUAL - COTTON KURTI"),
    "images/casual_teal.jpg": ("images/maroon_pret.jpg", (20, 100, 110), "EVERYDAY LINEN TUNIC"),
    "images/casual_mustard.jpg": ("images/lawn_pret.jpg", (180, 130, 10), "BLOCK PRINT KURTI"),
    "images/casual_pink.jpg": ("images/blush_formal.jpg", (180, 100, 120), "CASUAL LAWN 2-PIECE"),
    "images/casual_navy.jpg": ("images/emerald_gown.jpg", (20, 30, 70), "KHADDAR CASUAL TUNIC"),
    "images/casual_olive.jpg": ("images/lawn_pret.jpg", (80, 100, 40), "MINIMAL LINEN KURTI")
}

def create_custom_assets():
    for target_path, (base_path, color_rgb, label_text) in asset_map.items():
        if os.path.exists(base_path):
            img = Image.open(base_path).convert("RGB")
            
            # Create a subtle distinct color tint overlay
            overlay = Image.new("RGB", img.size, color_rgb)
            img = Image.blend(img, overlay, 0.22)
            
            # Draw decorative banner label at the bottom
            draw = ImageDraw.Draw(img)
            w, h = img.size
            
            # Ribbon overlay
            draw.rectangle([(0, h - 60), (w, h)], fill=(15, 30, 25, 230))
            draw.rectangle([(0, h - 60), (w, h - 57)], fill=(212, 175, 55))
            
            # Text annotation
            draw.text((20, h - 42), label_text, fill=(249, 243, 230))
            
            img.save(target_path, "JPEG", quality=92)
            print(f"Generated distinct asset: {target_path}")

if __name__ == '__main__':
    create_custom_assets()
