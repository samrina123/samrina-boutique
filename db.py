import sqlite3
import os

DB_NAME = 'boutique.db'

def get_db_connection():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # 1. Products Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            category TEXT NOT NULL,
            fabric TEXT NOT NULL,
            price_pkr REAL NOT NULL,
            image_url TEXT NOT NULL,
            rating REAL DEFAULT 5.0,
            stock_status TEXT DEFAULT 'In Stock',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # 2. Orders Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_number TEXT UNIQUE NOT NULL,
            customer_name TEXT NOT NULL,
            customer_phone TEXT NOT NULL,
            customer_address TEXT NOT NULL,
            product_title TEXT NOT NULL,
            size TEXT NOT NULL,
            custom_measurements TEXT,
            total_price_pkr REAL NOT NULL,
            discount_applied REAL DEFAULT 0,
            order_status TEXT DEFAULT 'Pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # 36 Unique Products with 100% REAL PAKISTANI PHOTOGRAPHY FOR ALL 6 CATEGORIES
    products_36 = [
        # --- 1. BRIDAL COUTURE (REAL USER-UPLOADED PAKISTANI BRIDAL COUTURE PHOTOS) ---
        ("Deep Maroon Velvet Zardozi Barat Lehenga", "bridal", "Heavy Velvet Zardozi & Double Dupatta", 195000.0, "images/bridal_maroon_velvet.jpg", 5.0, "ROYAL BRIDAL"),
        ("Silver Diamond Embellished Walima Gown", "bridal", "Net Embroidery & Pearls Walima Dress", 165000.0, "images/bridal_silver_walima.jpg", 5.0, "EXCLUSIVE WALIMA"),
        ("Royal Red Flared Barat Bridal Lehenga Set", "bridal", "Handcrafted Dabka & Silk Lehenga", 185000.0, "images/bridal_royalred_lehenga.jpg", 5.0, "BARAT COUTURE"),
        ("Crimson Heritage Royal Barat Bridal Set", "bridal", "Traditional Zari & Organza Dupatta", 175000.0, "images/bridal_crimson_heritage.jpg", 5.0, "HERITAGE BRIDAL"),
        ("Peach Rose Gold Train Bridal Maxi Gown", "bridal", "Handcrafted Crystals & Long Train", 170000.0, "images/bridal_peach_rosegold.jpg", 5.0, "LUXURY TRAIN GOWN"),
        ("Royale Gold Handcrafted Bridal Lehenga", "bridal", "Raw Silk Gold Zardozi Barat Set", 150000.0, "images/gold_bridal.jpg", 4.9, "POPULAR BRIDAL"),

        # --- 2. LUXURY FORMALS (REAL USER-UPLOADED PAKISTANI LUXURY FORMALS PHOTOS) ---
        ("Champagne Silk Floral Long Maxi Gown", "formal", "Pure Silk & Organza Dupatta", 28500.0, "images/formal_champagne_gown.jpg", 4.9, "MUST HAVE"),
        ("Off-White Silver Zardozi Anarkali Maxi", "formal", "Net Embroidery & Pearls", 34000.0, "images/formal_offwhite_zardozi.jpg", 5.0, "TRENDING"),
        ("Lilac Purple Chiffon Sequined Long Suit", "formal", "Chiffon Sequins & Palazzo", 26500.0, "images/formal_lilac_chiffon.jpg", 4.9, "BESTSELLER"),
        ("Gold Tissue Embroidered Peshwas Maxi", "formal", "Tissue Silk & Bordered Dupatta", 39500.0, "images/formal_gold_peshwas.jpg", 5.0, "NEW ARRIVAL"),
        ("Blush Pink Embellished Formal Bridal Maxi", "formal", "Pure Net & Handcrafted Crystals", 42000.0, "images/formal_blush_maxi.jpg", 5.0, "ROYAL FORMAL"),
        ("Emerald Grace Velvet Formal Gown", "formal", "Embroidered Velvet Zardozi", 31000.0, "images/emerald_gown.jpg", 4.8, "POPULAR"),

        # --- 3. PRET (READY TO WEAR) (REAL USER-UPLOADED PAKISTANI PRET PHOTOS) ---
        ("Beige Silk Neckline Embroidered Pret Suit", "pret", "Raw Silk & Culottes", 14500.0, "images/pret_beige_embroidered.jpg", 4.9, "MUST HAVE"),
        ("Lavender Cutwork Lace Sharara Pret Suit", "pret", "Silk Chiffon & Flared Sharara", 18500.0, "images/pret_lavender_sharara.jpg", 5.0, "TRENDING"),
        ("Ivory Silver Mirror Work Sharara Suit", "pret", "Embroidered Silk & Dupatta", 19200.0, "images/pret_ivory_silver.jpg", 4.9, "BESTSELLER"),
        ("Magenta Festive Floral Print Pret Set", "pret", "3-Piece Silk Printed Suit", 16800.0, "images/pret_magenta_festive.jpg", 5.0, "NEW ARRIVAL"),
        ("Beige & Maroon Embroidered Suit with Shawl", "pret", "Embroidered Lawn Silk & Shawl", 15900.0, "images/pret_beige_maroon.jpg", 4.8, "PRET LUXURY"),
        ("Crimson Silk Kurti Pret Suit", "pret", "Pure Silk & Gold Borders", 13800.0, "images/maroon_pret.jpg", 4.7, "POPULAR"),

        # --- 4. TRADITIONAL SHALWAR KAMEEZ (REAL USER-UPLOADED PAKISTANI SHALWAR KAMEEZ PHOTOS) ---
        ("Sky Blue Printed Kurti & White Patiala Shalwar", "shalwar", "Pure Lawn & Cotton Shalwar", 8500.0, "images/shalwar_skyblue_white.jpg", 4.9, "MUST HAVE"),
        ("Crimson Red Silk Scalloped Shalwar Suit", "shalwar", "Raw Silk & Organza Dupatta", 11200.0, "images/shalwar_crimson_red.jpg", 5.0, "TRENDING"),
        ("Midnight Black Embroidered Kurti Shalwar", "shalwar", "Cotton Satin & Threadwork", 9800.0, "images/shalwar_black_embroidered.jpg", 4.9, "BESTSELLER"),
        ("Pink & Orange Printed Silk Dupatta Shalwar Suit", "shalwar", "Jacquard Silk 3-Piece", 12500.0, "images/shalwar_pink_orange.jpg", 5.0, "NEW ARRIVAL"),
        ("Midnight Black Floral Coat Shalwar Suit", "shalwar", "Linen Blend Long Jacket Suit", 10800.0, "images/shalwar_black_jacket.jpg", 4.8, "TRADITIONAL LUXURY"),
        ("Emerald Green Tulip Shalwar Suit", "shalwar", "Jacquard Cotton & Lace", 9500.0, "images/shalwar_tulip.jpg", 4.7, "POPULAR"),

        # --- 5. CASUAL WEAR (REAL USER-UPLOADED PAKISTANI CASUAL WEAR PHOTOS) ---
        ("Mustard Orange 2-Piece Linen Set", "casual", "Linen Tunic & Culottes", 5500.0, "images/casual_mustard_linen.jpg", 4.9, "MUST HAVE"),
        ("Plum Purple Georgette Tunic Suit", "casual", "Georgette Kurti & Trousers", 6200.0, "images/casual_plum_tunic.jpg", 4.8, "TRENDING"),
        ("Midnight Black Cutwork Sleeve Suit", "casual", "Silk Kurti & Palazzo", 6800.0, "images/casual_black_cutwork.jpg", 5.0, "BESTSELLER"),
        ("Navy Blue Embroidered Bell Sleeve Suit", "casual", "Embroidered Tunic & Tulip Pants", 7200.0, "images/casual_navy_embroidered.jpg", 4.9, "NEW ARRIVAL"),
        ("Off-White Tribal Print Co-ord Set", "casual", "Linen Co-ord & Matching Bag", 5900.0, "images/casual_ivory_coord.jpg", 5.0, "EVERYDAY LUXURY"),
        ("Pastel Pink Floral Lawn Casual Suit", "casual", "Pure Lawn 2-Piece", 4800.0, "images/casual_pink.jpg", 4.7, "CASUAL"),

        # --- 6. SAREES COLLECTION (6 REAL USER-UPLOADED PAKISTANI SAREE PHOTOS) ---
        ("Midnight Black Striped Sequin Saree", "saree", "Georgette & Sequin Blouse", 32500.0, "images/saree_black_sequin.jpg", 5.0, "MUST HAVE"),
        ("Royal Velvet Heavy Embroidered Saree", "saree", "Pure Velvet & Puff Sleeves", 42000.0, "images/saree_velvet_black.jpg", 5.0, "HOT SELLER"),
        ("Teal Emerald Cutwork Net Saree", "saree", "Net Lace & Silk Inner", 29500.0, "images/saree_teal_net.jpg", 4.9, "NEW ARRIVAL"),
        ("Champagne Gold Tissue Bridal Saree", "saree", "Heavy Zardozi Tissue Silk", 48000.0, "images/saree_gold_tissue.jpg", 5.0, "BRIDAL SAREE"),
        ("Crimson Red Silk Classic Saree", "saree", "Pure Silk & Full Sleeves", 26000.0, "images/saree_crimson_silk.jpg", 4.8, "POPULAR"),
        ("Emerald Green Satin Silk Saree", "saree", "Satin Silk & Sequin Blouse", 31000.0, "images/saree_emerald.jpg", 5.0, "EXCLUSIVE")
    ]

    cursor.execute('DELETE FROM products') # Reset and insert 36 unique items
    cursor.executemany('''
        INSERT INTO products (title, category, fabric, price_pkr, image_url, rating, stock_status)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', products_36)
    
    print("Database updated with 100% REAL user-provided Bridal, Formals, Pret, Shalwar Kameez, Casual & Saree photos!")

    conn.commit()
    conn.close()

if __name__ == '__main__':
    init_db()
