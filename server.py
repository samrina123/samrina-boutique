from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import random
import time
from db import get_db_connection, init_db

app = Flask(__name__)
CORS(app)

init_db()

# Promo Code Coupons Dictionary
PROMO_CODES = {
    'SAMRINA10': 0.10, # 10% OFF
    'EID20': 0.20,      # 20% OFF
    'WELCOME5': 0.05    # 5% OFF
}

# --------------------------------------------------------------------------
# 1. Product REST Endpoints
# --------------------------------------------------------------------------
@app.route('/api/products', methods=['GET'])
def get_products():
    category = request.args.get('category')
    search = request.args.get('search')
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    query = 'SELECT * FROM products WHERE 1=1'
    params = []
    
    if category and category != 'all':
        query += ' AND category = ?'
        params.append(category)
        
    if search:
        query += ' AND (title LIKE ? OR fabric LIKE ? OR category LIKE ? OR stock_status LIKE ?)'
        params.extend([f'%{search}%', f'%{search}%', f'%{search}%', f'%{search}%'])
        
    query += ' ORDER BY id ASC'
    
    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()
    
    products = [dict(row) for row in rows]
    return jsonify({'status': 'success', 'count': len(products), 'data': products})

@app.route('/api/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM products WHERE id = ?', (product_id,))
    row = cursor.fetchone()
    conn.close()
    
    if row is None:
        return jsonify({'status': 'error', 'message': 'Product not found'}), 404
        
    return jsonify({'status': 'success', 'data': dict(row)})

@app.route('/api/products', methods=['POST'])
def add_product():
    data = request.json
    title = data.get('title')
    category = data.get('category', 'pret')
    fabric = data.get('fabric', 'Silk')
    price_pkr = data.get('price_pkr', 0)
    image_url = data.get('image_url', 'images/emerald_gown.jpg')
    stock_status = data.get('stock_status', 'In Stock')
    
    if not title or not price_pkr:
        return jsonify({'status': 'error', 'message': 'Title and Price are required'}), 400
        
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO products (title, category, fabric, price_pkr, image_url, stock_status)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (title, category, fabric, price_pkr, image_url, stock_status))
    
    conn.commit()
    new_id = cursor.lastrowid
    conn.close()
    
    return jsonify({'status': 'success', 'message': 'Product added successfully', 'product_id': new_id}), 201

@app.route('/api/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM products WHERE id = ?', (product_id,))
    conn.commit()
    conn.close()
    
    return jsonify({'status': 'success', 'message': 'Product deleted successfully'})

# --------------------------------------------------------------------------
# 2. Promo Code Endpoint
# --------------------------------------------------------------------------
@app.route('/api/promo/validate', methods=['POST'])
def validate_promo():
    data = request.json
    code = data.get('code', '').strip().upper()
    
    if code in PROMO_CODES:
        discount_rate = PROMO_CODES[code]
        return jsonify({
            'status': 'success',
            'valid': True,
            'discount_rate': discount_rate,
            'message': f'Promo code "{code}" applied! ({int(discount_rate*100)}% OFF)'
        })
    else:
        return jsonify({'status': 'error', 'valid': False, 'message': 'Invalid promo code'}), 400

# --------------------------------------------------------------------------
# 3. Orders REST Endpoints
# --------------------------------------------------------------------------
@app.route('/api/orders', methods=['POST'])
def create_order():
    data = request.json
    customer_name = data.get('customer_name')
    customer_phone = data.get('customer_phone')
    customer_address = data.get('customer_address')
    product_title = data.get('product_title')
    size = data.get('size', 'M')
    custom_measurements = data.get('custom_measurements', '')
    total_price_pkr = data.get('total_price_pkr', 0)
    discount_applied = data.get('discount_applied', 0)
    
    if not customer_name or not customer_phone or not product_title:
        return jsonify({'status': 'error', 'message': 'Customer details and product title are required'}), 400
        
    order_number = f"SB-{int(time.time())}-{random.randint(100, 999)}"
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO orders (order_number, customer_name, customer_phone, customer_address, product_title, size, custom_measurements, total_price_pkr, discount_applied)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (order_number, customer_name, customer_phone, customer_address, product_title, size, custom_measurements, total_price_pkr, discount_applied))
    
    conn.commit()
    conn.close()
    
    return jsonify({
        'status': 'success',
        'message': 'Order placed successfully and saved to SQLite Database!',
        'order_number': order_number
    }), 201

@app.route('/api/orders', methods=['GET'])
def get_orders():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM orders ORDER BY id DESC')
    rows = cursor.fetchall()
    conn.close()
    
    orders = [dict(row) for row in rows]
    return jsonify({'status': 'success', 'count': len(orders), 'data': orders})

@app.route('/api/orders/track/<order_number>', methods=['GET'])
def track_order(order_number):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM orders WHERE order_number = ?', (order_number.strip(),))
    row = cursor.fetchone()
    conn.close()
    
    if row is None:
        return jsonify({'status': 'error', 'message': 'Order number not found'}), 404
        
    order = dict(row)
    return jsonify({'status': 'success', 'data': order})

@app.route('/api/orders/<int:order_id>/status', methods=['PUT'])
def update_order_status(order_id):
    data = request.json
    new_status = data.get('status', 'Confirmed')
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('UPDATE orders SET order_status = ? WHERE id = ?', (new_status, order_id))
    conn.commit()
    conn.close()
    
    return jsonify({'status': 'success', 'message': f'Order status updated to {new_status}'})

# --------------------------------------------------------------------------
# 4. Analytics & Stats Endpoint for Admin Panel
# --------------------------------------------------------------------------
@app.route('/api/stats', methods=['GET'])
def get_stats():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('SELECT COUNT(*) FROM products')
    total_products = cursor.fetchone()[0]
    
    cursor.execute('SELECT COUNT(*), COALESCE(SUM(total_price_pkr), 0) FROM orders')
    order_stats = cursor.fetchone()
    total_orders = order_stats[0]
    total_revenue_pkr = order_stats[1]
    
    conn.close()
    
    return jsonify({
        'status': 'success',
        'data': {
            'total_products': total_products,
            'total_orders': total_orders,
            'total_revenue_pkr': total_revenue_pkr
        }
    })

if __name__ == '__main__':
    print("Starting Samrina Boutique Flask REST API Server on port 5000...")
    app.run(host='0.0.0.0', port=5000, debug=True)
