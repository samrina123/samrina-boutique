import sqlite3

def fix_schema():
    conn = sqlite3.connect('boutique.db')
    cursor = conn.cursor()

    # Check columns in orders table
    cursor.execute("PRAGMA table_info(orders)")
    columns = [col[1] for col in cursor.fetchall()]
    
    if 'custom_measurements' not in columns:
        cursor.execute("ALTER TABLE orders ADD COLUMN custom_measurements TEXT")
        print("Added 'custom_measurements' column to orders table.")
        
    if 'discount_applied' not in columns:
        cursor.execute("ALTER TABLE orders ADD COLUMN discount_applied REAL DEFAULT 0")
        print("Added 'discount_applied' column to orders table.")

    conn.commit()
    conn.close()
    print("Database schema fixed successfully!")

if __name__ == '__main__':
    fix_schema()
