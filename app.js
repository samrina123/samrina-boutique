/* ==========================================================================
   SAMRINA BOUTIQUE HAUTE COUTURE - CORE APPLICATION ENGINE
   Single-Page Storefront, Sizing & Custom Measurements, WhatsApp Dispatch,
   Wishlist, Cart & Admin Portal Database Synchronization
   ========================================================================== */

const API_URL = 'http://localhost:5000/api';
const PKR_TO_USD_RATE = 0.0036;

let currentCurrency = 'PKR';
let wishlistItems = JSON.parse(localStorage.getItem('sb_wishlist_items') || '[]');
let cartItems = JSON.parse(localStorage.getItem('sb_cart_items') || '[]');
let allProducts = [];
let selectedSize = 'M';
let currentOrderProd = null;

// --- 1. FULL PRODUCT CATALOGUE DATASET (63 Real Local Images) ---
const FULL_PRODUCT_CATALOGUE = [
  // SAREES COLLECTION
  { id: 1, title: "Midnight Black Striped Sequin Saree", category: "saree", fabric: "Georgette & Sequin Blouse", price_pkr: 32500, image_url: "images/saree_black_sequin.jpg", rating: 5.0, stock_status: "MUST HAVE" },
  { id: 2, title: "Royal Velvet Heavy Embroidered Saree", category: "saree", fabric: "Pure Velvet & Puff Sleeves", price_pkr: 42000, image_url: "images/saree_velvet_black.jpg", rating: 5.0, stock_status: "HOT SELLER" },
  { id: 3, title: "Teal Emerald Cutwork Net Saree", category: "saree", fabric: "Net Lace & Silk Inner", price_pkr: 29500, image_url: "images/saree_teal_net.jpg", rating: 4.9, stock_status: "NEW ARRIVAL" },
  { id: 4, title: "Champagne Gold Tissue Bridal Saree", category: "saree", fabric: "Heavy Zardozi Tissue Silk", price_pkr: 48000, image_url: "images/saree_gold_tissue.jpg", rating: 5.0, stock_status: "BRIDAL SAREE" },
  { id: 5, title: "Crimson Red Silk Classic Saree", category: "saree", fabric: "Pure Silk & Full Sleeves", price_pkr: 26000, image_url: "images/saree_crimson_silk.jpg", rating: 4.8, stock_status: "POPULAR" },
  { id: 6, title: "Emerald Green Satin Silk Saree", category: "saree", fabric: "Satin Silk & Sequin Blouse", price_pkr: 31000, image_url: "images/saree_emerald.jpg", rating: 5.0, stock_status: "EXCLUSIVE" },
  { id: 37, title: "Noir Onyx Sheer Chiffon Saree", category: "saree", fabric: "Pure Chiffon & Embroidery", price_pkr: 28500, image_url: "images/saree_black.jpg", rating: 4.9, stock_status: "HAUTE SAREE" },
  { id: 38, title: "Royal Blue Sapphire Satin Saree", category: "saree", fabric: "Royal Satin Silk", price_pkr: 34000, image_url: "images/saree_blue.jpg", rating: 4.8, stock_status: "ROYAL COUTURE" },
  { id: 39, title: "Pure Gold Embroidered Zari Saree", category: "saree", fabric: "Handcrafted Zari Silk", price_pkr: 45000, image_url: "images/saree_gold.jpg", rating: 5.0, stock_status: "BRIDAL SAREE" },
  { id: 40, title: "Deep Maroon Banarasi Brocade Saree", category: "saree", fabric: "Banarasi Woven Brocade", price_pkr: 39000, image_url: "images/saree_maroon.jpg", rating: 4.9, stock_status: "TRADITIONAL" },
  { id: 50, title: "Peachy Blush Organza Saree", category: "saree", fabric: "Pure Organza & Mirror Work", price_pkr: 33000, image_url: "images/saree_peach.jpg", rating: 4.8, stock_status: "SPRING SAREE" },
  { id: 51, title: "Gold Threaded Net Luxury Saree", category: "saree", fabric: "Pure Net & Zari Border", price_pkr: 36500, image_url: "images/saree_net.jpg", rating: 4.9, stock_status: "LUXURY SAREE" },
  { id: 52, title: "Pastel Chiffon Designer Saree", category: "saree", fabric: "Embroidered Chiffon", price_pkr: 29900, image_url: "images/saree_chiffon.jpg", rating: 4.7, stock_status: "POPULAR" },
  { id: 53, title: "Banarasi Silk Heritage Saree", category: "saree", fabric: "Traditional Handloom Brocade", price_pkr: 44000, image_url: "images/saree_banarasi.jpg", rating: 5.0, stock_status: "HERITAGE" },
  { id: 54, title: "Kanjeevaram Gold Silk Saree", category: "saree", fabric: "South Silk & Temple Border", price_pkr: 47500, image_url: "images/saree_kanjeevaram.jpg", rating: 5.0, stock_status: "ROYAL KANJEEVARAM" },

  // TRADITIONAL SHALWAR KAMEEZ
  { id: 7, title: "Sky Blue Printed Kurti & White Patiala Shalwar", category: "shalwar", fabric: "Pure Lawn & Cotton Shalwar", price_pkr: 8500, image_url: "images/shalwar_skyblue_white.jpg", rating: 4.9, stock_status: "MUST HAVE" },
  { id: 8, title: "Crimson Red Silk Scalloped Shalwar Suit", category: "shalwar", fabric: "Raw Silk & Organza Dupatta", price_pkr: 11200, image_url: "images/shalwar_crimson_red.jpg", rating: 5.0, stock_status: "TRENDING" },
  { id: 9, title: "Midnight Black Embroidered Kurti Shalwar", category: "shalwar", fabric: "Cotton Satin & Threadwork", price_pkr: 9800, image_url: "images/shalwar_black_embroidered.jpg", rating: 4.9, stock_status: "BESTSELLER" },
  { id: 10, title: "Pink & Orange Printed Silk Dupatta Shalwar Suit", category: "shalwar", fabric: "Jacquard Silk 3-Piece", price_pkr: 12500, image_url: "images/shalwar_pink_orange.jpg", rating: 5.0, stock_status: "NEW ARRIVAL" },
  { id: 11, title: "Midnight Black Floral Coat Shalwar Suit", category: "shalwar", fabric: "Linen Blend Long Jacket Suit", price_pkr: 10800, image_url: "images/shalwar_black_jacket.jpg", rating: 4.8, stock_status: "TRADITIONAL LUXURY" },
  { id: 12, title: "Emerald Green Tulip Shalwar Suit", category: "shalwar", fabric: "Jacquard Cotton & Lace", price_pkr: 9500, image_url: "images/shalwar_tulip.jpg", rating: 4.7, stock_status: "POPULAR" },
  { id: 41, title: "Heritage Black Velvet Embroidered Shalwar Suit", category: "shalwar", fabric: "Velvet Kurti & Silk Shalwar", price_pkr: 14000, image_url: "images/shalwar_black.jpg", rating: 5.0, stock_status: "ROYAL SHALWAR" },
  { id: 42, title: "Dusty Rose Silk Scalloped Shalwar Suit", category: "shalwar", fabric: "Pure Silk & Organza Dupatta", price_pkr: 11800, image_url: "images/shalwar_rose.jpg", rating: 4.9, stock_status: "ELEGANT" },
  { id: 55, title: "Royal Blue Embroidered Shalwar Kameez", category: "shalwar", fabric: "Silk Cotton & Dupatta", price_pkr: 10500, image_url: "images/shalwar_blue.jpg", rating: 4.8, stock_status: "POPULAR" },
  { id: 56, title: "Velvet Heavy Embroidered Shalwar Set", category: "shalwar", fabric: "Micro Velvet & Gold Thread", price_pkr: 15500, image_url: "images/shalwar_velvet.jpg", rating: 5.0, stock_status: "VELVET LUXURY" },
  { id: 57, title: "Classic Punjabi Patiala Suit", category: "shalwar", fabric: "Pure Cotton 3-Piece", price_pkr: 8900, image_url: "images/shalwar_patiala.jpg", rating: 4.8, stock_status: "PATIALA" },

  // CASUAL WEAR
  { id: 13, title: "Mustard Orange 2-Piece Linen Set", category: "casual", fabric: "Linen Tunic & Culottes", price_pkr: 5500, image_url: "images/casual_mustard_linen.jpg", rating: 4.9, stock_status: "MUST HAVE" },
  { id: 14, title: "Plum Purple Georgette Tunic Suit", category: "casual", fabric: "Georgette Kurti & Trousers", price_pkr: 6200, image_url: "images/casual_plum_tunic.jpg", rating: 4.8, stock_status: "TRENDING" },
  { id: 15, title: "Midnight Black Cutwork Sleeve Suit", category: "casual", fabric: "Silk Kurti & Palazzo", price_pkr: 6800, image_url: "images/casual_black_cutwork.jpg", rating: 5.0, stock_status: "BESTSELLER" },
  { id: 16, title: "Navy Blue Embroidered Bell Sleeve Suit", category: "casual", fabric: "Embroidered Tunic & Tulip Pants", price_pkr: 7200, image_url: "images/casual_navy_embroidered.jpg", rating: 4.9, stock_status: "NEW ARRIVAL" },
  { id: 17, title: "Off-White Tribal Print Co-ord Set", category: "casual", fabric: "Linen Co-ord & Matching Bag", price_pkr: 5900, image_url: "images/casual_ivory_coord.jpg", rating: 5.0, stock_status: "EVERYDAY LUXURY" },
  { id: 18, title: "Pastel Pink Floral Lawn Casual Suit", category: "casual", fabric: "Pure Lawn 2-Piece", price_pkr: 4800, image_url: "images/casual_pink.jpg", rating: 4.7, stock_status: "CASUAL" },
  { id: 43, title: "Olive Green Breathable Cotton Set", category: "casual", fabric: "Pure Cotton Tunic", price_pkr: 5200, image_url: "images/casual_olive.jpg", rating: 4.8, stock_status: "EVERYDAY" },
  { id: 44, title: "Teal Breeze Embroidered Casual Suit", category: "casual", fabric: "Lawn Cotton 2-Piece", price_pkr: 5600, image_url: "images/casual_teal.jpg", rating: 4.9, stock_status: "FRESH ARRIVAL" },
  { id: 58, title: "Summer Breathable Cotton Lawn Suit", category: "casual", fabric: "Soft Lawn Printed", price_pkr: 4900, image_url: "images/casual_cotton.jpg", rating: 4.7, stock_status: "SUMMER SPECIAL" },
  { id: 59, title: "Bright Mustard Linen Tunic", category: "casual", fabric: "Pure Linen 2-Piece", price_pkr: 5400, image_url: "images/casual_mustard.jpg", rating: 4.8, stock_status: "CASUAL" },
  { id: 60, title: "Midnight Navy Linen Tunic Set", category: "casual", fabric: "Linen Tunic & Trouser", price_pkr: 5800, image_url: "images/casual_navy.jpg", rating: 4.8, stock_status: "ELEGANT CASUAL" },

  // PRET WEAR
  { id: 19, title: "Beige Silk Neckline Embroidered Pret Suit", category: "pret", fabric: "Raw Silk & Culottes", price_pkr: 14500, image_url: "images/pret_beige_embroidered.jpg", rating: 4.9, stock_status: "MUST HAVE" },
  { id: 20, title: "Lavender Cutwork Lace Sharara Pret Suit", category: "pret", fabric: "Silk Chiffon & Flared Sharara", price_pkr: 18500, image_url: "images/pret_lavender_sharara.jpg", rating: 5.0, stock_status: "TRENDING" },
  { id: 21, title: "Ivory Silver Mirror Work Sharara Suit", category: "pret", fabric: "Embroidered Silk & Dupatta", price_pkr: 19200, image_url: "images/pret_ivory_silver.jpg", rating: 4.9, stock_status: "BESTSELLER" },
  { id: 22, title: "Magenta Festive Floral Print Pret Set", category: "pret", fabric: "3-Piece Silk Printed Suit", price_pkr: 16800, image_url: "images/pret_magenta_festive.jpg", rating: 5.0, stock_status: "NEW ARRIVAL" },
  { id: 23, title: "Beige & Maroon Embroidered Suit with Shawl", category: "pret", fabric: "Embroidered Lawn Silk & Shawl", price_pkr: 15900, image_url: "images/pret_beige_maroon.jpg", rating: 4.8, stock_status: "PRET LUXURY" },
  { id: 24, title: "Crimson Silk Kurti Pret Suit", category: "pret", fabric: "Pure Silk & Gold Borders", price_pkr: 13800, image_url: "images/maroon_pret.jpg", rating: 4.7, stock_status: "POPULAR" },
  { id: 45, title: "Lawn Blossom 3-Piece Printed Pret", category: "pret", fabric: "Lawn & Silk Dupatta", price_pkr: 12900, image_url: "images/lawn_pret.jpg", rating: 4.9, stock_status: "PRINTED PRET" },

  // FORMALS
  { id: 25, title: "Champagne Silk Floral Long Maxi Gown", category: "formal", fabric: "Pure Silk & Organza Dupatta", price_pkr: 28500, image_url: "images/formal_champagne_gown.jpg", rating: 4.9, stock_status: "MUST HAVE" },
  { id: 26, title: "Off-White Silver Zardozi Anarkali Maxi", category: "formal", fabric: "Net Embroidery & Pearls", price_pkr: 34000, image_url: "images/formal_offwhite_zardozi.jpg", rating: 5.0, stock_status: "TRENDING" },
  { id: 27, title: "Lilac Purple Chiffon Sequined Long Suit", category: "formal", fabric: "Chiffon Sequins & Palazzo", price_pkr: 26500, image_url: "images/formal_lilac_chiffon.jpg", rating: 4.9, stock_status: "BESTSELLER" },
  { id: 28, title: "Gold Tissue Embroidered Peshwas Maxi", category: "formal", fabric: "Tissue Silk & Bordered Dupatta", price_pkr: 39500, image_url: "images/formal_gold_peshwas.jpg", rating: 5.0, stock_status: "NEW ARRIVAL" },
  { id: 29, title: "Blush Pink Embellished Formal Bridal Maxi", category: "formal", fabric: "Pure Net & Handcrafted Crystals", price_pkr: 42000, image_url: "images/formal_blush_maxi.jpg", rating: 5.0, stock_status: "ROYAL FORMAL" },
  { id: 30, title: "Emerald Grace Velvet Formal Gown", category: "formal", fabric: "Embroidered Velvet Zardozi", price_pkr: 31000, image_url: "images/emerald_gown.jpg", rating: 4.8, stock_status: "POPULAR" },
  { id: 46, title: "Blush Rose Gold Handcrafted Formal Gown", category: "formal", fabric: "Organza Zardozi & Net Dupatta", price_pkr: 36000, image_url: "images/blush_formal.jpg", rating: 5.0, stock_status: "LUXURY FORMAL" },
  { id: 47, title: "Chiffon Grace Embellished Formal Maxi", category: "formal", fabric: "Pure Chiffon & Crystal Embellishments", price_pkr: 33500, image_url: "images/chiffon_formal.jpg", rating: 4.9, stock_status: "FORMAL COUTURE" },
  { id: 48, title: "Raw Silk Royal Embroidered Formal Set", category: "formal", fabric: "Raw Silk Zardozi & Velvet Dupatta", price_pkr: 37800, image_url: "images/rawsilk_formal.jpg", rating: 5.0, stock_status: "ROYAL FORMAL" },

  // BRIDAL COUTURE
  { id: 31, title: "Deep Maroon Velvet Zardozi Barat Lehenga", category: "bridal", fabric: "Heavy Velvet Zardozi & Double Dupatta", price_pkr: 195000, image_url: "images/bridal_maroon_velvet.jpg", rating: 5.0, stock_status: "ROYAL BRIDAL" },
  { id: 32, title: "Silver Diamond Embellished Walima Gown", category: "bridal", fabric: "Net Embroidery & Pearls Walima Dress", price_pkr: 165000, image_url: "images/bridal_silver_walima.jpg", rating: 5.0, stock_status: "EXCLUSIVE WALIMA" },
  { id: 33, title: "Royal Red Flared Barat Bridal Lehenga Set", category: "bridal", fabric: "Handcrafted Dabka & Silk Lehenga", price_pkr: 185000, image_url: "images/bridal_royalred_lehenga.jpg", rating: 5.0, stock_status: "BARAT COUTURE" },
  { id: 34, title: "Crimson Heritage Royal Barat Bridal Set", category: "bridal", fabric: "Traditional Zari & Organza Dupatta", price_pkr: 175000, image_url: "images/bridal_crimson_heritage.jpg", rating: 5.0, stock_status: "HERITAGE BRIDAL" },
  { id: 35, title: "Peach Rose Gold Train Bridal Maxi Gown", category: "bridal", fabric: "Handcrafted Crystals & Long Train", price_pkr: 170000, image_url: "images/bridal_peach_rosegold.jpg", rating: 5.0, stock_status: "LUXURY TRAIN GOWN" },
  { id: 36, title: "Royale Gold Handcrafted Bridal Lehenga", category: "bridal", fabric: "Raw Silk Gold Zardozi Barat Set", price_pkr: 150000, image_url: "images/gold_bridal.jpg", rating: 4.9, stock_status: "POPULAR BRIDAL" },
  { id: 49, title: "Organza Dream Zardozi Bridal Barat Set", category: "bridal", fabric: "Organza Silk & Dabka Embroidery", price_pkr: 180000, image_url: "images/organza_bridal.jpg", rating: 5.0, stock_status: "BARAT BRIDAL" }
];

// Helper: Merges Catalogue + LocalStorage Custom Admin Products
function getMergedProducts() {
  const customProducts = JSON.parse(localStorage.getItem('samrina_products') || '[]');
  const merged = [...FULL_PRODUCT_CATALOGUE];
  customProducts.forEach(cp => {
    if (!merged.some(p => p.id === cp.id)) {
      merged.unshift(cp);
    }
  });
  return merged;
}

// --- 2. INITIALIZATION & NAVIGATION ---
document.addEventListener('DOMContentLoaded', () => {
  allProducts = getMergedProducts();
  renderProductsGrid(allProducts);
  updateBadges();
  ensureDrawersInDOM();
});

function toggleMobileMenu() {
  const navBar = document.querySelector('.category-nav-bar');
  if (navBar) navBar.classList.toggle('active');
}

function scrollToCategory(cat) {
  const collectionsSec = document.getElementById('collections');
  if (collectionsSec) {
    collectionsSec.scrollIntoView({ behavior: 'smooth' });
  }
  const btn = document.querySelector(`.filter-btn[onclick*="${cat}"]`);
  filterCategory(cat, btn);
}

function filterCategory(category, btnElement) {
  if (btnElement) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    btnElement.classList.add('active');
  }
  loadProducts(category);
}

function filterProducts() {
  const searchVal = document.getElementById('searchInput').value;
  const activeBtn = document.querySelector('.filter-btn.active');
  const cat = activeBtn ? activeBtn.getAttribute('onclick').match(/'([^']+)'/)[1] : 'all';
  loadProducts(cat, searchVal);
}

async function loadProducts(category = 'all', search = '') {
  let filtered = getMergedProducts();
  if (category && category !== 'all') {
    filtered = filtered.filter(p => p.category === category);
  }
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(p => 
      p.title.toLowerCase().includes(q) || 
      p.fabric.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.stock_status && p.stock_status.toLowerCase().includes(q))
    );
  }
  allProducts = filtered;
  renderProductsGrid(allProducts);
}

// --- 3. RENDER PRODUCT CARDS ---
function renderProductsGrid(products) {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;
  grid.innerHTML = '';

  if (products.length === 0) {
    grid.innerHTML = '<div style="grid-column: 1/-1; text-align:center; padding: 40px; color: var(--text-muted); font-size: 1.1rem;">No dresses found matching your criteria.</div>';
    return;
  }

  products.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';

    const formattedPrice = currentCurrency === 'USD' 
      ? `$${Math.round(p.price_pkr * PKR_TO_USD_RATE).toLocaleString()}`
      : `PKR ${p.price_pkr.toLocaleString()}`;

    const isHearted = wishlistItems.some(item => item.id === p.id || item.title === p.title);
    card.innerHTML = `
      <div class="product-img-wrapper" onclick="openOrderModal('${p.title.replace(/'/g, "\\'")}', ${p.price_pkr})">
        <span class="product-tag">${p.stock_status || 'EXCLUSIVE'}</span>
        <span class="fabric-badge"><i class="fa-solid fa-shirt"></i> ${p.fabric}</span>
        <button class="wishlist-btn ${isHearted ? 'active' : ''}" onclick="handleWishlistClick(event, this, ${p.id})">
          <i class="${isHearted ? 'fa-solid' : 'fa-regular'} fa-heart" ${isHearted ? 'style="color:#e74c3c;"' : ''}></i>
        </button>
        <img src="${p.image_url}" alt="${p.title}" onerror="handleImageError(this, '${p.category}')">
      </div>
      <div class="product-info">
        <h3 class="product-title" onclick="openOrderModalById(event, ${p.id})" style="cursor:pointer;">${p.title}</h3>
        <div class="product-price-row">
          <span class="product-price">${formattedPrice}</span>
          <div style="display: flex; gap: 6px; width: 100%; margin-top: 8px;">
            <button type="button" class="order-now-btn" style="flex: 1; padding: 7px 10px; font-size: 0.75rem; justify-content: center; background: var(--gold-primary); color: var(--dark-charcoal);" onclick="addToCartById(event, ${p.id}, 'M')">
              <i class="fa-solid fa-bag-shopping"></i> Add to Bag
            </button>
            <button type="button" class="order-now-btn" style="flex: 1; padding: 7px 10px; font-size: 0.75rem; justify-content: center;" onclick="openOrderModalById(event, ${p.id})">
              Order / Details <i class="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function handleImageError(img, category) {
  if (!img) return;

  const localFallbacks = {
    'saree': 'images/saree_black_sequin.jpg',
    'shalwar': 'images/shalwar_skyblue_white.jpg',
    'casual': 'images/casual_mustard_linen.jpg',
    'pret': 'images/pret_beige_embroidered.jpg',
    'formal': 'images/formal_champagne_gown.jpg',
    'bridal': 'images/bridal_maroon_velvet.jpg'
  };

  if (!img.dataset.triedRoot) {
    img.dataset.triedRoot = 'true';
    const rawSrc = img.getAttribute('src') || '';
    if (rawSrc.startsWith('images/')) {
      img.src = rawSrc.replace('images/', '');
      return;
    }
  }

  img.onerror = null;
  img.src = localFallbacks[category] || 'images/hero_banner.jpg';
}

// --- 4. CURRENCY SWITCHER ---
function setCurrency(currency) {
  if (currentCurrency === currency) return;
  currentCurrency = currency;
  document.getElementById('btn-pkr').classList.toggle('active', currency === 'PKR');
  document.getElementById('btn-usd').classList.toggle('active', currency === 'USD');
  renderProductsGrid(allProducts);
  showToast(`Currency set to ${currency}`);
}

// --- 5. WISHLIST & SHOPPING CART DRAWERS ---
function updateBadges() {
  const wCount = document.getElementById('wishlistCount');
  const cCount = document.getElementById('cartCount');
  if (wCount) wCount.innerText = wishlistItems.length;
  if (cCount) cCount.innerText = cartItems.length;
}

function handleWishlistClick(event, btnEl, productId) {
  if (event && event.stopPropagation) event.stopPropagation();
  let prod = getMergedProducts().find(p => p.id === productId || String(p.id) === String(productId));
  if (!prod) prod = FULL_PRODUCT_CATALOGUE[0];

  const existingIndex = wishlistItems.findIndex(item => item.id === prod.id || item.title === prod.title);
  if (existingIndex > -1) {
    wishlistItems.splice(existingIndex, 1);
    showToast('Removed from Wishlist');
  } else {
    wishlistItems.push(prod);
    showToast('Saved to Wishlist ❤️');
  }

  localStorage.setItem('sb_wishlist_items', JSON.stringify(wishlistItems));
  updateBadges();
  renderProductsGrid(allProducts);
  renderWishlistDrawer();
}

function removeFromWishlist(productId) {
  wishlistItems = wishlistItems.filter(item => String(item.id) !== String(productId));
  localStorage.setItem('sb_wishlist_items', JSON.stringify(wishlistItems));
  updateBadges();
  renderProductsGrid(allProducts);
  renderWishlistDrawer();
  showToast('Removed from Wishlist');
}

function openWishlistDrawer() {
  renderWishlistDrawer();
  const drawer = document.getElementById('wishlistDrawer');
  const overlay = document.getElementById('drawerOverlay') || document.getElementById('cartOverlay');
  if (drawer) drawer.classList.add('active');
  if (overlay) overlay.classList.add('active');
}

function closeWishlistDrawer() {
  const drawer = document.getElementById('wishlistDrawer');
  const overlay = document.getElementById('drawerOverlay') || document.getElementById('cartOverlay');
  if (drawer) drawer.classList.remove('active');
  if (overlay) overlay.classList.remove('active');
}

function renderWishlistDrawer() {
  const list = document.getElementById('wishlistDrawerList');
  const countSpan = document.getElementById('wishlistDrawerCount');
  if (countSpan) countSpan.innerText = wishlistItems.length;
  if (!list) return;

  if (wishlistItems.length === 0) {
    list.innerHTML = '<div style="text-align:center; padding: 40px; color: var(--text-muted);"><i class="fa-solid fa-heart-crack" style="font-size: 2rem; margin-bottom: 10px; opacity: 0.4;"></i><br>Your wishlist is empty.</div>';
    return;
  }

  list.innerHTML = wishlistItems.map(item => `
    <div style="display: flex; gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--border-light); align-items: center;">
      <img src="${item.image_url}" alt="${item.title}" style="width: 60px; height: 75px; object-fit: cover; border-radius: 8px; flex-shrink: 0;" onerror="handleImageError(this, '${item.category || 'saree'}')">
      <div style="flex-grow: 1; min-width: 0;">
        <h4 style="font-size: 0.85rem; font-family: var(--font-serif); color: var(--dark-charcoal); margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.title}</h4>
        <span style="color: var(--primary-emerald); font-weight: 700; font-size: 0.85rem;">PKR ${item.price_pkr.toLocaleString()}</span>
      </div>
      <button onclick="removeFromWishlist('${item.id}')" style="background: rgba(231, 76, 60, 0.1); border: none; color: #e74c3c; cursor: pointer; padding: 6px 10px; border-radius: 6px; font-size: 0.9rem;" title="Remove"><i class="fa-solid fa-trash"></i></button>
    </div>
  `).join('');
}

function openCartDrawer() {
  renderCartDrawer();
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('drawerOverlay') || document.getElementById('cartOverlay');
  if (drawer) drawer.classList.add('active');
  if (overlay) overlay.classList.add('active');
}

function closeCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('drawerOverlay') || document.getElementById('cartOverlay');
  if (drawer) drawer.classList.remove('active');
  if (overlay) overlay.classList.remove('active');
}

function closeAllDrawers() {
  closeWishlistDrawer();
  closeCartDrawer();
}

function addToCartById(event, productId, size = 'M') {
  if (event) {
    if (event.stopPropagation) event.stopPropagation();
    if (event.preventDefault) event.preventDefault();
  }
  const prod = getMergedProducts().find(p => p.id === productId || String(p.id) === String(productId)) || FULL_PRODUCT_CATALOGUE[0];
  addToCart(prod.title, prod.price_pkr, size);
}

function addToCart(title, pricePkr, size = 'M') {
  const prod = getMergedProducts().find(p => p.title === title || String(p.id) === String(title)) || { title, price_pkr: pricePkr, image_url: 'images/hero_banner.jpg', category: 'saree' };
  cartItems.push({ ...prod, selectedSize: size, cartId: Date.now() + Math.random() });
  localStorage.setItem('sb_cart_items', JSON.stringify(cartItems));
  updateBadges();
  showToast(`"${prod.title}" added to Shopping Bag! 🛍️`);
  closeOrderModal();
  openCartDrawer();
}

function renderCartDrawer() {
  const list = document.getElementById('cartDrawerList');
  const countSpan = document.getElementById('cartDrawerCount');
  const subtotalText = document.getElementById('cartSubtotalText');
  if (countSpan) countSpan.innerText = cartItems.length;
  if (!list) return;

  if (cartItems.length === 0) {
    list.innerHTML = '<div style="text-align:center; padding: 40px; color: var(--text-muted);"><i class="fa-solid fa-bag-shopping" style="font-size: 2rem; margin-bottom: 10px; opacity: 0.4;"></i><br>Your shopping bag is empty.</div>';
    if (subtotalText) subtotalText.innerText = 'PKR 0';
    return;
  }

  let total = 0;
  list.innerHTML = cartItems.map((item, idx) => {
    total += item.price_pkr;
    return `
      <div style="display: flex; gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--border-light); align-items: center;">
        <img src="${item.image_url}" alt="${item.title}" style="width: 60px; height: 75px; object-fit: cover; border-radius: 8px; flex-shrink: 0;" onerror="handleImageError(this, '${item.category || 'saree'}')">
        <div style="flex-grow: 1; min-width: 0;">
          <h4 style="font-size: 0.85rem; font-family: var(--font-serif); color: var(--dark-charcoal); margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.title}</h4>
          <span style="font-size: 0.72rem; background: var(--ivory-bg); padding: 2px 8px; border-radius: 4px; font-weight: 600;">Size: ${item.selectedSize || 'M'}</span>
          <div style="color: var(--primary-emerald); font-weight: 700; font-size: 0.85rem; margin-top: 4px;">PKR ${item.price_pkr.toLocaleString()}</div>
        </div>
        <button onclick="removeFromCart(${idx})" style="background: rgba(231, 76, 60, 0.1); border: none; color: #e74c3c; cursor: pointer; padding: 6px 10px; border-radius: 6px; font-size: 0.9rem;" title="Remove"><i class="fa-solid fa-trash"></i></button>
      </div>
    `;
  }).join('');

  if (subtotalText) subtotalText.innerText = `PKR ${total.toLocaleString()}`;
}

function removeFromCart(index) {
  cartItems.splice(index, 1);
  localStorage.setItem('sb_cart_items', JSON.stringify(cartItems));
  updateBadges();
  renderCartDrawer();
}

function proceedCartCheckout() {
  if (cartItems.length === 0) {
    showToast('Your bag is empty! Add dresses to place an order.');
    return;
  }

  let totalBagPrice = 0;
  cartItems.forEach(item => totalBagPrice += item.price_pkr);

  closeCartDrawer();

  // Populate Order Modal with Bag Items Summary
  const modal = document.getElementById('orderModal');
  const titleEl = document.getElementById('modalDressTitle');
  const priceEl = document.getElementById('modalDressPrice');
  const imgEl = document.getElementById('modalDressImg');

  if (titleEl) titleEl.innerText = cartItems.length === 1 ? cartItems[0].title : `Shopping Bag Order (${cartItems.length} Items)`;
  if (priceEl) priceEl.innerText = `PKR ${totalBagPrice.toLocaleString()}`;
  if (imgEl && cartItems[0]) {
    imgEl.src = cartItems[0].image_url;
  }

  if (modal) modal.classList.add('active');
}

// --- 6. IN-PAGE SIZING & ORDER MODAL HANDLERS ---
function selectSize(btnElement, sizeStr) {
  document.querySelectorAll('.size-btn').forEach(btn => btn.classList.remove('active'));
  btnElement.classList.add('active');
  selectedSize = sizeStr;

  const customBox = document.getElementById('customFitInputs');
  if (customBox) {
    customBox.style.display = sizeStr === 'Bespoke Custom Fit' ? 'block' : 'none';
  }
}

function openOrderModalById(event, productId) {
  if (event) {
    if (event.stopPropagation) event.stopPropagation();
    if (event.preventDefault) event.preventDefault();
  }
  const prod = getMergedProducts().find(p => p.id === productId || String(p.id) === String(productId)) || FULL_PRODUCT_CATALOGUE[0];
  openOrderModal(prod.title, prod.price_pkr);
}

function openOrderModal(title, pricePkr) {
  const modal = document.getElementById('orderModal');
  const titleEl = document.getElementById('modalDressTitle');
  const priceEl = document.getElementById('modalDressPrice');
  const imgEl = document.getElementById('modalDressImg');

  currentOrderProd = getMergedProducts().find(p => p.title === title) || { title, price_pkr: pricePkr, image_url: 'images/hero_banner.jpg', category: 'saree' };

  if (titleEl) titleEl.innerText = title;
  if (priceEl) priceEl.innerText = `PKR ${pricePkr.toLocaleString()}`;
  if (imgEl) {
    imgEl.src = currentOrderProd.image_url;
    imgEl.onerror = () => handleImageError(imgEl, currentOrderProd.category);
  }

  if (modal) modal.classList.add('active');
}

function closeOrderModal() {
  const modal = document.getElementById('orderModal');
  if (modal) modal.classList.remove('active');
}

function submitOrder(method) {
  const name = document.getElementById('custName')?.value.trim();
  const phone = document.getElementById('custPhone')?.value.trim();
  const email = document.getElementById('custEmail')?.value.trim();
  const city = document.getElementById('custCity')?.value.trim();
  const postal = document.getElementById('custPostal')?.value.trim();
  const country = 'Pakistan';
  const address = document.getElementById('custAddress')?.value.trim();

  if (!name || !phone || !city || !address) {
    alert('Please fill in your Full Name, Phone Number, City Name, and Delivery Address to place your order.');
    return;
  }

  let orderItems = [];
  let totalOrderPrice = 0;
  let itemsFormattedText = '';

  if (cartItems.length > 0) {
    orderItems = [...cartItems];
    itemsFormattedText = cartItems.map((item, idx) => {
      totalOrderPrice += item.price_pkr;
      return `${idx + 1}. ${item.title} (${item.selectedSize || 'M'}) - PKR ${item.price_pkr.toLocaleString()}`;
    }).join('\n');
  } else {
    const dressTitle = document.getElementById('modalDressTitle')?.innerText || 'Haute Couture Dress';
    const dressPriceText = document.getElementById('modalDressPrice')?.innerText || '0';
    totalOrderPrice = parseInt(dressPriceText.replace(/[^0-9]/g, '')) || 0;
    
    let measurementsInfo = '';
    if (selectedSize === 'Bespoke Custom Fit') {
      const chest = document.getElementById('mChest')?.value || 'Std';
      const waist = document.getElementById('mWaist')?.value || 'Std';
      const hips = document.getElementById('mHips')?.value || 'Std';
      const length = document.getElementById('mLength')?.value || 'Std';
      measurementsInfo = ` [Custom Fit: Chest:${chest}", Waist:${waist}", Hips:${hips}", Length:${length}"]`;
    }
    
    itemsFormattedText = `1. ${dressTitle} (${selectedSize})${measurementsInfo} - PKR ${totalOrderPrice.toLocaleString()}`;
    orderItems = [{ title: dressTitle, price_pkr: totalOrderPrice, selectedSize }];
  }

  const orderNum = 'SB-' + Math.floor(100000 + Math.random() * 900000);

  const mainTitle = orderItems.length === 1 ? orderItems[0].title : `Multi-Item Order (${orderItems.length} Dresses)`;
  const newOrderObj = {
    order_number: orderNum,
    customer_name: name,
    customer_phone: phone,
    customer_email: email || 'N/A',
    city: city,
    postal_code: postal || 'N/A',
    country: country,
    customer_address: address,
    dress_title: mainTitle,
    product_title: mainTitle,
    size: orderItems[0]?.selectedSize || selectedSize || 'M',
    custom_measurements: itemsFormattedText,
    total_price_pkr: totalOrderPrice,
    status: 'Pending',
    order_status: 'Pending',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  };

  // Save to LocalStorage
  const localOrders = JSON.parse(localStorage.getItem('samrina_orders') || '[]');
  localOrders.unshift(newOrderObj);
  localStorage.setItem('samrina_orders', JSON.stringify(localOrders));

  // Try API POST
  try {
    fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrderObj)
    });
  } catch (err) {}

  // Format WhatsApp Message Text
  const waText = 
`❖ NEW ORDER - SAMRINA BOUTIQUE ❖
---------------------------------
Order Ref: ${orderNum}
Total Bill: PKR ${totalOrderPrice.toLocaleString()}

❖ ORDERED DRESS(ES):
${itemsFormattedText}

❖ CUSTOMER DETAILS:
• Name: ${name}
• Phone / WhatsApp: ${phone}
• Gmail Address: ${email || 'N/A'}
• City Name: ${city}
• Postal Code: ${postal || 'N/A'}
• Country: ${country} 🇵🇰
• Delivery Address: ${address}
---------------------------------
Thank you! Please confirm my order placement.`;

  // Clear Cart after successful order placement
  cartItems = [];
  localStorage.setItem('sb_cart_items', JSON.stringify([]));
  updateBadges();
  renderCartDrawer();

  const waUrl = `https://wa.me/923038873030?text=${encodeURIComponent(waText)}`;
  closeOrderModal();
  showToast('Order Placed Successfully! Opening WhatsApp... 🚀');
  
  // Instant redirect for WhatsApp App & Web
  const win = window.open(waUrl, '_blank');
  if (!win || win.closed || typeof win.closed === 'undefined') {
    window.location.href = waUrl;
  }
}

// --- 6b. CUSTOMER INQUIRY SUBMISSION HANDLER ---
function submitInquiry(event) {
  if (event) event.preventDefault();
  const name = document.getElementById('inquiryName')?.value.trim();
  const phone = document.getElementById('inquiryPhone')?.value.trim();
  const email = document.getElementById('inquiryEmail')?.value.trim();
  const message = document.getElementById('inquiryMessage')?.value.trim();

  if (!name || !phone || !message) {
    alert('Please fill in your Name, Phone/WhatsApp number, and Message.');
    return;
  }

  const inqObj = {
    id: 'INQ-' + Math.floor(100000 + Math.random() * 900000),
    name: name,
    phone: phone,
    email: email || 'N/A',
    message: message,
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  };

  const localInquiries = JSON.parse(localStorage.getItem('samrina_inquiries') || '[]');
  localInquiries.unshift(inqObj);
  localStorage.setItem('samrina_inquiries', JSON.stringify(localInquiries));

  try {
    fetch(`${API_URL}/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inqObj)
    });
  } catch (err) {}

  showToast('Inquiry sent successfully to Samrina Boutique! 📩');
  if (event && event.target) event.target.reset();
}

// --- 7. TRACK ORDER LOGIC & LIVE SYNC ---
window.addEventListener('storage', (e) => {
  if (e.key === 'samrina_orders') {
    const trackInput = document.getElementById('trackOrderInput');
    const trackBox = document.getElementById('trackResultBox');
    if (trackInput && trackInput.value.trim() && trackBox && trackBox.style.display !== 'none') {
      searchTrackOrder();
    }
  }
});

function openTrackModal() {
  const modal = document.getElementById('trackModal');
  if (modal) modal.classList.add('active');
}

async function searchTrackOrder() {
  const input = document.getElementById('trackOrderInput').value.trim();
  const box = document.getElementById('trackResultBox');
  if (!input) {
    alert('Please enter your Order Reference Number (e.g. SB-100201)');
    return;
  }

  let match = null;

  // 1. Try fetching live order status from Flask API server
  try {
    const res = await fetch(`${API_URL}/orders`);
    const data = await res.json();
    if (data.status === 'success') {
      match = data.data.find(o => 
        (o.order_number && o.order_number.toLowerCase() === input.toLowerCase()) ||
        String(o.id) === input
      );
    }
  } catch (err) {}

  // 2. Fallback to LocalStorage orders
  if (!match) {
    const localOrders = JSON.parse(localStorage.getItem('samrina_orders') || '[]');
    match = localOrders.find(o => 
      (o.order_number && o.order_number.toLowerCase() === input.toLowerCase()) ||
      String(o.id) === input
    );
  }

  if (match) {
    const ordNum = match.order_number || (`SB-${match.id}`);
    const custName = match.customer_name || 'Valued Customer';
    const phone = match.customer_phone || match.phone || 'N/A';
    const dress = match.product_title || match.dress_title || 'Haute Couture Dress';
    const size = match.size || 'M';
    const price = match.total_price_pkr || 0;
    const address = match.customer_address || match.delivery_address || 'Express Doorstep Delivery';
    const status = match.order_status || match.status || 'Pending';
    const measurements = match.custom_measurements || '';

    const email = match.customer_email || match.email || 'N/A';
    const city = match.city || 'N/A';
    const postal = match.postal_code || 'N/A';
    const country = match.country || 'Pakistan';

    const elOrd = document.getElementById('tOrdNum');
    const elCust = document.getElementById('tCustName');
    const elPhone = document.getElementById('tPhone');
    const elEmail = document.getElementById('tEmail');
    const elCity = document.getElementById('tCity');
    const elPostal = document.getElementById('tPostal');
    const elCountry = document.getElementById('tCountry');
    const elDress = document.getElementById('tDress');
    const elSize = document.getElementById('tSize');
    const elPrice = document.getElementById('tPrice');
    const elAddr = document.getElementById('tAddress');

    if (elOrd) elOrd.innerText = `Order #${ordNum}`;
    if (elCust) elCust.innerText = custName;
    if (elPhone) elPhone.innerText = phone;
    if (elEmail) elEmail.innerText = email;
    if (elCity) elCity.innerText = city;
    if (elPostal) elPostal.innerText = postal;
    if (elCountry) elCountry.innerText = `🇵🇰 ${country}`;
    if (elDress) elDress.innerText = dress;
    if (elSize) elSize.innerText = size;
    if (elPrice) elPrice.innerText = `PKR ${price.toLocaleString()}`;
    if (elAddr) elAddr.innerText = address;

    // Measurements row
    const mRow = document.getElementById('tMeasurementsRow');
    const mVal = document.getElementById('tMeasurements');
    if (measurements && mRow && mVal) {
      mVal.innerText = measurements;
      mRow.style.display = 'block';
    } else if (mRow) {
      mRow.style.display = 'none';
    }

    // Status Badge & Timeline Progress Highlighting
    const badge = document.getElementById('tStatusBadge');
    if (badge) {
      badge.innerText = status.toUpperCase();
      let badgeBg = '#0F382C';
      if (status.includes('Pending')) badgeBg = '#D4AF37';
      if (status.includes('Confirmed')) badgeBg = '#2980b9';
      if (status.includes('Tailoring')) badgeBg = '#8e44ad';
      if (status.includes('Dispatched')) badgeBg = '#e67e22';
      if (status.includes('Delivered')) badgeBg = '#27ae60';
      badge.style.background = badgeBg;
      badge.style.color = '#fff';
    }

    // Reset Timeline Steps
    const steps = ['verified', 'tailoring', 'dispatched', 'delivered'];
    steps.forEach(s => {
      const stepDiv = document.getElementById(`step-${s}`);
      const iconDiv = document.getElementById(`icon-${s}`);
      if (stepDiv) stepDiv.style.opacity = '0.35';
      if (iconDiv) {
        iconDiv.style.background = '#ccc';
        iconDiv.style.color = '#fff';
      }
    });

    // Highlight active and completed timeline steps based on status
    let activeLevel = 1;
    const stLower = status.toLowerCase();
    if (stLower.includes('pending') || stLower.includes('verified') || stLower.includes('confirmed')) activeLevel = 1;
    if (stLower.includes('tailoring')) activeLevel = 2;
    if (stLower.includes('dispatched')) activeLevel = 3;
    if (stLower.includes('delivered')) activeLevel = 4;

    for (let i = 0; i < activeLevel; i++) {
      const stepDiv = document.getElementById(`step-${steps[i]}`);
      const iconDiv = document.getElementById(`icon-${steps[i]}`);
      if (stepDiv) stepDiv.style.opacity = '1';
      if (iconDiv) {
        iconDiv.style.background = '#0F382C';
        iconDiv.style.color = '#D4AF37';
      }
    }

    if (box) box.style.display = 'block';
  } else {
    alert('Order reference number not found. Please check your order reference (e.g., SB-775555) or WhatsApp receipt.');
  }
}

// --- 8. UTILITIES & TOAST ---
function showToast(msg) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast-notification';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>${msg}</span>`;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

function ensureDrawersInDOM() {
  // Utility ensuring overlay exists in DOM
  if (!document.getElementById('drawerOverlay')) {
    const ov = document.createElement('div');
    ov.id = 'drawerOverlay';
    ov.className = 'drawer-overlay';
    ov.onclick = closeAllDrawers;
    document.body.appendChild(ov);
  }
}
