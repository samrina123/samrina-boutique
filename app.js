/* ==========================================================================
   Samrina Boutique - Interactive JavaScript Engine (Full Production Version)
   ========================================================================== */

const API_URL = 'http://localhost:5000/api';
const BOUTIQUE_WHATSAPP_NUMBER = '923038873030'; 
let currentCurrency = 'PKR';
const PKR_TO_USD_RATE = 0.0036;
let wishlistCount = 0;
let cartCount = 0;

let currentOrderingProduct = { title: '', pricePkr: 0, selectedSize: 'M', discountRate: 0 };
let allProducts = [];

// Full 36 Dataset (Used for instant client-side rendering & fallback)
const FULL_PRODUCT_CATALOGUE = [
  // --- 1. SAREES COLLECTION (6 REAL USER-UPLOADED PAKISTANI SAREE PHOTOS) ---
  { id: 1, title: "Midnight Black Striped Sequin Saree", category: "saree", fabric: "Georgette & Sequin Blouse", price_pkr: 32500, image_url: "images/saree_black_sequin.jpg", rating: 5.0, stock_status: "MUST HAVE" },
  { id: 2, title: "Royal Velvet Heavy Embroidered Saree", category: "saree", fabric: "Pure Velvet & Puff Sleeves", price_pkr: 42000, image_url: "images/saree_velvet_black.jpg", rating: 5.0, stock_status: "HOT SELLER" },
  { id: 3, title: "Teal Emerald Cutwork Net Saree", category: "saree", fabric: "Net Lace & Silk Inner", price_pkr: 29500, image_url: "images/saree_teal_net.jpg", rating: 4.9, stock_status: "NEW ARRIVAL" },
  { id: 4, title: "Champagne Gold Tissue Bridal Saree", category: "saree", fabric: "Heavy Zardozi Tissue Silk", price_pkr: 48000, image_url: "images/saree_gold_tissue.jpg", rating: 5.0, stock_status: "BRIDAL SAREE" },
  { id: 5, title: "Crimson Red Silk Classic Saree", category: "saree", fabric: "Pure Silk & Full Sleeves", price_pkr: 26000, image_url: "images/saree_crimson_silk.jpg", rating: 4.8, stock_status: "POPULAR" },
  { id: 6, title: "Emerald Green Satin Silk Saree", category: "saree", fabric: "Satin Silk & Sequin Blouse", price_pkr: 31000, image_url: "images/saree_emerald.jpg", rating: 5.0, stock_status: "EXCLUSIVE" },

  // --- 2. TRADITIONAL SHALWAR KAMEEZ (REAL USER-UPLOADED PAKISTANI SHALWAR KAMEEZ PHOTOS) ---
  { id: 7, title: "Sky Blue Printed Kurti & White Patiala Shalwar", category: "shalwar", fabric: "Pure Lawn & Cotton Shalwar", price_pkr: 8500, image_url: "images/shalwar_skyblue_white.jpg", rating: 4.9, stock_status: "MUST HAVE" },
  { id: 8, title: "Crimson Red Silk Scalloped Shalwar Suit", category: "shalwar", fabric: "Raw Silk & Organza Dupatta", price_pkr: 11200, image_url: "images/shalwar_crimson_red.jpg", rating: 5.0, stock_status: "TRENDING" },
  { id: 9, title: "Midnight Black Embroidered Kurti Shalwar", category: "shalwar", fabric: "Cotton Satin & Threadwork", price_pkr: 9800, image_url: "images/shalwar_black_embroidered.jpg", rating: 4.9, stock_status: "BESTSELLER" },
  { id: 10, title: "Pink & Orange Printed Silk Dupatta Shalwar Suit", category: "shalwar", fabric: "Jacquard Silk 3-Piece", price_pkr: 12500, image_url: "images/shalwar_pink_orange.jpg", rating: 5.0, stock_status: "NEW ARRIVAL" },
  { id: 11, title: "Midnight Black Floral Coat Shalwar Suit", category: "shalwar", fabric: "Linen Blend Long Jacket Suit", price_pkr: 10800, image_url: "images/shalwar_black_jacket.jpg", rating: 4.8, stock_status: "TRADITIONAL LUXURY" },
  { id: 12, title: "Emerald Green Tulip Shalwar Suit", category: "shalwar", fabric: "Jacquard Cotton & Lace", price_pkr: 9500, image_url: "images/shalwar_tulip.jpg", rating: 4.7, stock_status: "POPULAR" },

  // --- 3. CASUAL WEAR (REAL USER-UPLOADED PAKISTANI CASUAL WEAR PHOTOS) ---
  { id: 13, title: "Mustard Orange 2-Piece Linen Set", category: "casual", fabric: "Linen Tunic & Culottes", price_pkr: 5500, image_url: "images/casual_mustard_linen.jpg", rating: 4.9, stock_status: "MUST HAVE" },
  { id: 14, title: "Plum Purple Georgette Tunic Suit", category: "casual", fabric: "Georgette Kurti & Trousers", price_pkr: 6200, image_url: "images/casual_plum_tunic.jpg", rating: 4.8, stock_status: "TRENDING" },
  { id: 15, title: "Midnight Black Cutwork Sleeve Suit", category: "casual", fabric: "Silk Kurti & Palazzo", price_pkr: 6800, image_url: "images/casual_black_cutwork.jpg", rating: 5.0, stock_status: "BESTSELLER" },
  { id: 16, title: "Navy Blue Embroidered Bell Sleeve Suit", category: "casual", fabric: "Embroidered Tunic & Tulip Pants", price_pkr: 7200, image_url: "images/casual_navy_embroidered.jpg", rating: 4.9, stock_status: "NEW ARRIVAL" },
  { id: 17, title: "Off-White Tribal Print Co-ord Set", category: "casual", fabric: "Linen Co-ord & Matching Bag", price_pkr: 5900, image_url: "images/casual_ivory_coord.jpg", rating: 5.0, stock_status: "EVERYDAY LUXURY" },
  { id: 18, title: "Pastel Pink Floral Lawn Casual Suit", category: "casual", fabric: "Pure Lawn 2-Piece", price_pkr: 4800, image_url: "images/casual_pink.jpg", rating: 4.7, stock_status: "CASUAL" },

  // --- 4. PRET (READY TO WEAR) (REAL USER-UPLOADED PAKISTANI PRET PHOTOS) ---
  { id: 19, title: "Beige Silk Neckline Embroidered Pret Suit", category: "pret", fabric: "Raw Silk & Culottes", price_pkr: 14500, image_url: "images/pret_beige_embroidered.jpg", rating: 4.9, stock_status: "MUST HAVE" },
  { id: 20, title: "Lavender Cutwork Lace Sharara Pret Suit", category: "pret", fabric: "Silk Chiffon & Flared Sharara", price_pkr: 18500, image_url: "images/pret_lavender_sharara.jpg", rating: 5.0, stock_status: "TRENDING" },
  { id: 21, title: "Ivory Silver Mirror Work Sharara Suit", category: "pret", fabric: "Embroidered Silk & Dupatta", price_pkr: 19200, image_url: "images/pret_ivory_silver.jpg", rating: 4.9, stock_status: "BESTSELLER" },
  { id: 22, title: "Magenta Festive Floral Print Pret Set", category: "pret", fabric: "3-Piece Silk Printed Suit", price_pkr: 16800, image_url: "images/pret_magenta_festive.jpg", rating: 5.0, stock_status: "NEW ARRIVAL" },
  { id: 23, title: "Beige & Maroon Embroidered Suit with Shawl", category: "pret", fabric: "Embroidered Lawn Silk & Shawl", price_pkr: 15900, image_url: "images/pret_beige_maroon.jpg", rating: 4.8, stock_status: "PRET LUXURY" },
  { id: 24, title: "Crimson Silk Kurti Pret Suit", category: "pret", fabric: "Pure Silk & Gold Borders", price_pkr: 13800, image_url: "images/maroon_pret.jpg", rating: 4.7, stock_status: "POPULAR" },

  // --- 5. LUXURY FORMALS (REAL USER-UPLOADED PAKISTANI LUXURY FORMALS PHOTOS) ---
  { id: 25, title: "Champagne Silk Floral Long Maxi Gown", category: "formal", fabric: "Pure Silk & Organza Dupatta", price_pkr: 28500, image_url: "images/formal_champagne_gown.jpg", rating: 4.9, stock_status: "MUST HAVE" },
  { id: 26, title: "Off-White Silver Zardozi Anarkali Maxi", category: "formal", fabric: "Net Embroidery & Pearls", price_pkr: 34000, image_url: "images/formal_offwhite_zardozi.jpg", rating: 5.0, stock_status: "TRENDING" },
  { id: 27, title: "Lilac Purple Chiffon Sequined Long Suit", category: "formal", fabric: "Chiffon Sequins & Palazzo", price_pkr: 26500, image_url: "images/formal_lilac_chiffon.jpg", rating: 4.9, stock_status: "BESTSELLER" },
  { id: 28, title: "Gold Tissue Embroidered Peshwas Maxi", category: "formal", fabric: "Tissue Silk & Bordered Dupatta", price_pkr: 39500, image_url: "images/formal_gold_peshwas.jpg", rating: 5.0, stock_status: "NEW ARRIVAL" },
  { id: 29, title: "Blush Pink Embellished Formal Bridal Maxi", category: "formal", fabric: "Pure Net & Handcrafted Crystals", price_pkr: 42000, image_url: "images/formal_blush_maxi.jpg", rating: 5.0, stock_status: "ROYAL FORMAL" },
  { id: 30, title: "Emerald Grace Velvet Formal Gown", category: "formal", fabric: "Embroidered Velvet Zardozi", price_pkr: 31000, image_url: "images/emerald_gown.jpg", rating: 4.8, stock_status: "POPULAR" },

  // --- 6. BRIDAL COUTURE (REAL USER-UPLOADED PAKISTANI BRIDAL COUTURE PHOTOS) ---
  { id: 31, title: "Deep Maroon Velvet Zardozi Barat Lehenga", category: "bridal", fabric: "Heavy Velvet Zardozi & Double Dupatta", price_pkr: 195000, image_url: "images/bridal_maroon_velvet.jpg", rating: 5.0, stock_status: "ROYAL BRIDAL" },
  { id: 32, title: "Silver Diamond Embellished Walima Gown", category: "bridal", fabric: "Net Embroidery & Pearls Walima Dress", price_pkr: 165000, image_url: "images/bridal_silver_walima.jpg", rating: 5.0, stock_status: "EXCLUSIVE WALIMA" },
  { id: 33, title: "Royal Red Flared Barat Bridal Lehenga Set", category: "bridal", fabric: "Handcrafted Dabka & Silk Lehenga", price_pkr: 185000, image_url: "images/bridal_royalred_lehenga.jpg", rating: 5.0, stock_status: "BARAT COUTURE" },
  { id: 34, title: "Crimson Heritage Royal Barat Bridal Set", category: "bridal", fabric: "Traditional Zari & Organza Dupatta", price_pkr: 175000, image_url: "images/bridal_crimson_heritage.jpg", rating: 5.0, stock_status: "HERITAGE BRIDAL" },
  { id: 35, title: "Peach Rose Gold Train Bridal Maxi Gown", category: "bridal", fabric: "Handcrafted Crystals & Long Train", price_pkr: 170000, image_url: "images/bridal_peach_rosegold.jpg", rating: 5.0, stock_status: "LUXURY TRAIN GOWN" },
  { id: 36, title: "Royale Gold Handcrafted Bridal Lehenga", category: "bridal", fabric: "Raw Silk Gold Zardozi Barat Set", price_pkr: 150000, image_url: "images/gold_bridal.jpg", rating: 4.9, stock_status: "POPULAR BRIDAL" }
];

// Master Dataset Merger (Full Catalogue + LocalStorage Custom Admin Products)
function getMergedProducts() {
  const localProds = JSON.parse(localStorage.getItem('samrina_products') || '[]');
  return [...localProds, ...FULL_PRODUCT_CATALOGUE];
}

function getProductById(id) {
  const all = getMergedProducts();
  const searchId = String(id).trim();
  const found = all.find(p => String(p.id).trim() === searchId);
  return found || all[0];
}

// 1. Mobile Menu Drawer Toggle
function toggleMobileMenu() {
  const navMenu = document.getElementById('navMenu');
  if (navMenu) navMenu.classList.toggle('active');
}

// 2. Fetch Live Products or Filter Client Dataset
async function loadProducts(category = 'all', search = '') {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  try {
    let url = `${API_URL}/products?category=${category}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;

    const res = await fetch(url);
    const data = await res.json();

    if (data.status === 'success' && data.data.length > 0) {
      allProducts = data.data;
      renderProductsGrid(allProducts);
      return;
    }
  } catch (err) {
    console.warn('Backend API offline or reloading, using merged catalogue fallback.');
  }

  // Robust Client-side Filtering if API server is restarting
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

// 3. Render Product Cards into DOM
function renderProductsGrid(products) {
  const grid = document.getElementById('productsGrid');
  grid.innerHTML = '';

  if (products.length === 0) {
    grid.innerHTML = '<div style="grid-column: 1/-1; text-align:center; padding: 40px; color: var(--text-muted); font-size: 1.1rem;">No dresses found in this category.</div>';
    return;
  }

  products.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-category', p.category);
    card.setAttribute('data-name', p.title);
    card.setAttribute('data-price', p.price_pkr);

    const formattedPrice = currentCurrency === 'USD' 
      ? `$${Math.round(p.price_pkr * PKR_TO_USD_RATE).toLocaleString()}`
      : `PKR ${p.price_pkr.toLocaleString()}`;

    const isHearted = wishlistItems.some(item => item.id === p.id || item.title === p.title);
    card.innerHTML = `
      <div class="product-img-wrapper" onclick="window.location.href='product-detail.html?id=${p.id}'" style="cursor:pointer;">
        <span class="product-tag">${p.stock_status || 'EXCLUSIVE'}</span>
        <span class="fabric-badge"><i class="fa-solid fa-shirt"></i> ${p.fabric}</span>
        <button class="wishlist-btn ${isHearted ? 'active' : ''}" onclick="handleWishlistClick(event, this, ${p.id})"><i class="${isHearted ? 'fa-solid' : 'fa-regular'} fa-heart" ${isHearted ? 'style="color:#e74c3c;"' : ''}></i></button>
        <img src="${p.image_url}" alt="${p.title}" onerror="handleImageError(this, '${p.category}')">
      </div>
      <div class="product-info">
        <div class="product-rating">
          <i class="fa-solid fa-star"></i>
          <i class="fa-solid fa-star"></i>
          <i class="fa-solid fa-star"></i>
          <i class="fa-solid fa-star"></i>
          <i class="fa-solid fa-star"></i>
          <span>(${p.rating || 5.0})</span>
        </div>
        <h3 class="product-title"><a href="product-detail.html?id=${p.id}">${p.title}</a></h3>
        <div class="product-price-row">
          <div class="product-price" data-price-pkr="${p.price_pkr}">${formattedPrice}</div>
          <a href="product-detail.html?id=${p.id}" class="whatsapp-order-btn" style="text-decoration:none; display:inline-flex; align-items:center; justify-content:center;">
            <i class="fa-solid fa-bag-shopping"></i> View Details
          </a>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });
}

// 3b. Render Similar & Recommended Products Section
function renderSimilarProducts(displayedProducts, category, search) {
  const simSec = document.getElementById('similarProductsSection');
  const simGrid = document.getElementById('similarGrid');
  if (!simSec || !simGrid) return;

  const displayedIds = new Set((displayedProducts || []).map(p => p.id));
  
  // Find candidates from full catalogue not already displayed
  let candidates = FULL_PRODUCT_CATALOGUE.filter(p => !displayedIds.has(p.id));
  let matched = [];

  if (search) {
    const q = search.toLowerCase();
    matched = candidates.filter(p => 
      p.fabric.toLowerCase().includes(q) || 
      p.category.toLowerCase().includes(q) ||
      p.title.toLowerCase().includes(q)
    );
  } else if (category && category !== 'all') {
    // High-rated matching fabric items from other categories
    matched = candidates.filter(p => p.rating >= 4.8);
  }

  // Fill up to 4 recommendations
  if (matched.length < 4) {
    const remaining = candidates.filter(p => !matched.some(m => m.id === p.id));
    matched = matched.concat(remaining.slice(0, 4 - matched.length));
  }

  matched = matched.slice(0, 4);

  if (matched.length === 0) {
    simSec.style.display = 'none';
    return;
  }

  simGrid.innerHTML = '';
  matched.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';
    const formattedPrice = currentCurrency === 'USD' 
      ? `$${Math.round(p.price_pkr * PKR_TO_USD_RATE).toLocaleString()}`
      : `PKR ${p.price_pkr.toLocaleString()}`;

    const isHearted = wishlistItems.some(item => item.id === p.id || item.title === p.title);
    card.innerHTML = `
      <div class="product-img-wrapper">
        <span class="product-tag" style="background:var(--gold-primary); color:var(--primary-emerald);">SIMILAR ITEM</span>
        <span class="fabric-badge"><i class="fa-solid fa-shirt"></i> ${p.fabric}</span>
        <button class="wishlist-btn ${isHearted ? 'active' : ''}" onclick="handleWishlistClick(event, this, ${p.id})"><i class="${isHearted ? 'fa-solid' : 'fa-regular'} fa-heart" ${isHearted ? 'style="color:#e74c3c;"' : ''}></i></button>
        <img src="${p.image_url}" alt="${p.title}" onerror="handleImageError(this, '${p.category}')">
      </div>
      <div class="product-info">
        <div class="product-rating">
          <i class="fa-solid fa-star"></i>
          <i class="fa-solid fa-star"></i>
          <i class="fa-solid fa-star"></i>
          <i class="fa-solid fa-star"></i>
          <i class="fa-solid fa-star"></i>
          <span>(${p.rating || 5.0})</span>
        </div>
        <h3 class="product-title">${p.title}</h3>
        <div class="product-price-row">
          <div class="product-price">${formattedPrice}</div>
          <button class="whatsapp-order-btn" onclick="openOrderModal('${p.title.replace(/'/g, "\\'")}', ${p.price_pkr})">
            <i class="fa-solid fa-bag-shopping"></i> Order Now
          </button>
        </div>
      </div>
    `;
    simGrid.appendChild(card);
  });

  simSec.style.display = 'block';
}

// 3c. Smart Image Fallback Handler for GitHub Pages
function handleImageError(img, category) {
  const cdnFallbacks = {
    'saree': 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
    'shalwar': 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=600&q=80',
    'casual': 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
    'pret': 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80',
    'formal': 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80',
    'bridal': 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80'
  };

  // 1. Try stripping 'images/' prefix if uploaded directly to root on GitHub
  if (!img.dataset.triedRoot) {
    img.dataset.triedRoot = 'true';
    const rawSrc = img.getAttribute('src') || '';
    if (rawSrc.startsWith('images/')) {
      img.src = rawSrc.replace('images/', '');
      return;
    }
  }

  // 2. Try relative ./ path
  if (!img.dataset.triedRelative) {
    img.dataset.triedRelative = 'true';
    const currentSrc = img.getAttribute('src') || '';
    if (!currentSrc.startsWith('./')) {
      img.src = './' + currentSrc;
      return;
    }
  }

  // 3. Instant Category High-Res CDN Fallback so pictures NEVER break on GitHub Pages
  img.src = cdnFallbacks[category] || cdnFallbacks['formal'];
}

// 4. Currency Switcher Logic (PKR <-> USD)
function setCurrency(currency) {
  if (currentCurrency === currency) return;
  currentCurrency = currency;

  document.getElementById('btn-pkr').classList.toggle('active', currency === 'PKR');
  document.getElementById('btn-usd').classList.toggle('active', currency === 'USD');

  renderProductsGrid(allProducts);
  showToast(`Currency changed to ${currency}`);
}

// 5. Category Filter
function filterCategory(category, buttonEl) {
  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach(btn => btn.classList.remove('active'));

  if (buttonEl && buttonEl.classList) {
    buttonEl.classList.add('active');
  } else {
    const targetBtn = Array.from(buttons).find(b => b.getAttribute('onclick') && b.getAttribute('onclick').includes(`'${category}'`));
    if (targetBtn) targetBtn.classList.add('active');
  }

  const section = document.getElementById('collections');
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }

  loadProducts(category);
}

// 6. Live Search Filter
function filterProducts() {
  const query = document.getElementById('searchInput').value;
  loadProducts('all', query);
}

// Wishlist & Cart State arrays (Synced with LocalStorage)
let wishlistItems = JSON.parse(localStorage.getItem('sb_wishlist_items') || '[]');
let cartItems = JSON.parse(localStorage.getItem('sb_cart_items') || '[]');

function updateBadges() {
  const wEl = document.getElementById('wishlistCount');
  const cEl = document.getElementById('cartCount');
  if (wEl) wEl.textContent = wishlistItems.length;
  if (cEl) cEl.textContent = cartItems.length;
}

// 7. Wishlist Heart Toggle & Drawer Sync
function handleWishlistClick(event, btnEl, productId) {
  if (event) {
    if (typeof event.stopPropagation === 'function') event.stopPropagation();
    if (typeof event.preventDefault === 'function') event.preventDefault();
  }

  let id = parseInt(productId);
  if (isNaN(id) && typeof btnEl === 'number') {
    id = btnEl;
    btnEl = null;
  }

  let prod = FULL_PRODUCT_CATALOGUE.find(p => p.id === id);

  if (!prod && btnEl) {
    const btn = btnEl.closest ? (btnEl.closest('.wishlist-btn') || btnEl) : btnEl;
    const card = btn.closest ? btn.closest('.product-card') : null;
    if (card) {
      const title = card.getAttribute('data-name') || card.querySelector('.product-title')?.textContent;
      prod = FULL_PRODUCT_CATALOGUE.find(p => p.title === title);
    }
  }

  if (!prod) {
    prod = FULL_PRODUCT_CATALOGUE[0];
  }

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
  
  // Instant re-render so all heart buttons update to exact red solid state
  if (typeof allProducts !== 'undefined' && allProducts.length > 0) {
    renderProductsGrid(allProducts);
  }
  renderWishlistDrawer();
}

function toggleWishlist(btnEl, productTitle) {
  const prod = FULL_PRODUCT_CATALOGUE.find(p => p.title === productTitle);
  handleWishlistClick(null, btnEl, prod ? prod.id : 1);
}

// Wishlist Side Drawer Handlers
function openWishlistDrawer() {
  renderWishlistDrawer();
  document.getElementById('wishlistDrawer').classList.add('active');
  document.getElementById('drawerOverlay').classList.add('active');
}

function closeWishlistDrawer() {
  document.getElementById('wishlistDrawer').classList.remove('active');
  document.getElementById('drawerOverlay').classList.remove('active');
}

function renderWishlistDrawer() {
  const container = document.getElementById('wishlistDrawerList');
  const countSpan = document.getElementById('wishlistDrawerCount');
  if (!container) return;

  if (countSpan) countSpan.textContent = wishlistItems.length;
  container.innerHTML = '';

  if (wishlistItems.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding: 50px 20px; color: var(--text-muted);">
        <i class="fa-regular fa-heart" style="font-size: 3rem; color: var(--gold-primary); margin-bottom: 15px;"></i>
        <h4 style="font-family:'Playfair Display',serif; color:var(--primary-emerald); margin-bottom: 6px; font-size: 1.1rem;">Your Wishlist is Empty</h4>
        <p style="font-size: 0.85rem;">Click the heart icon on any dress to save your favorites here!</p>
      </div>
    `;
    return;
  }

  wishlistItems.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'drawer-item-card';

    const formattedPrice = currentCurrency === 'USD' 
      ? `$${Math.round((item.price_pkr || 25000) * PKR_TO_USD_RATE).toLocaleString()}`
      : `PKR ${(item.price_pkr || 25000).toLocaleString()}`;

    card.innerHTML = `
      <img src="${item.image_url || 'images/emerald_gown.jpg'}" class="drawer-item-img" onerror="handleImageError(this, '${item.category || 'formal'}')">
      <div class="drawer-item-info">
        <h4 class="drawer-item-title">${item.title}</h4>
        <div class="drawer-item-price">${formattedPrice}</div>
        <button class="whatsapp-order-btn" style="padding: 4px 10px; font-size: 0.75rem; margin-top: 6px;" onclick="closeWishlistDrawer(); openOrderModal('${item.title.replace(/'/g, "\\'")}', ${item.price_pkr || 25000})">
          <i class="fa-solid fa-bag-shopping"></i> Order Now
        </button>
      </div>
      <button class="drawer-remove-btn" title="Remove" onclick="removeFromWishlist(${index})">
        <i class="fa-solid fa-trash-can"></i>
      </button>
    `;
    container.appendChild(card);
  });
}

function removeFromWishlist(index) {
  wishlistItems.splice(index, 1);
  localStorage.setItem('sb_wishlist_items', JSON.stringify(wishlistItems));
  updateBadges();
  renderWishlistDrawer();
  showToast('Item removed from wishlist');
}

// Shopping Cart Side Drawer Handlers
function openCartDrawer() {
  renderCartDrawer();
  document.getElementById('cartDrawer').classList.add('active');
  document.getElementById('drawerOverlay').classList.add('active');
}

function closeCartDrawer() {
  document.getElementById('cartDrawer').classList.remove('active');
  document.getElementById('drawerOverlay').classList.remove('active');
}

function closeAllDrawers() {
  closeWishlistDrawer();
  closeCartDrawer();
}

function renderCartDrawer() {
  const container = document.getElementById('cartDrawerList');
  const countSpan = document.getElementById('cartDrawerCount');
  const footer = document.getElementById('cartDrawerFooter');
  const subtotalSpan = document.getElementById('cartSubtotalText');
  if (!container) return;

  if (countSpan) countSpan.textContent = cartItems.length;
  container.innerHTML = '';

  if (cartItems.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding: 50px 20px; color: var(--text-muted);">
        <i class="fa-solid fa-bag-shopping" style="font-size: 3rem; color: var(--gold-primary); margin-bottom: 15px;"></i>
        <h4 style="font-family:'Playfair Display',serif; color:var(--primary-emerald); margin-bottom: 6px; font-size: 1.1rem;">Your Shopping Cart is Empty</h4>
        <p style="font-size: 0.85rem;">Explore our boutique catalog and click "Order Now" to add items here!</p>
      </div>
    `;
    if (footer) footer.style.display = 'none';
    return;
  }

  if (footer) footer.style.display = 'block';

  let totalPkr = 0;
  cartItems.forEach((item, index) => {
    totalPkr += item.pricePkr || item.price_pkr || 25000;
    const card = document.createElement('div');
    card.className = 'drawer-item-card';

    const itemPrice = item.pricePkr || item.price_pkr || 25000;
    const formattedPrice = currentCurrency === 'USD' 
      ? `$${Math.round(itemPrice * PKR_TO_USD_RATE).toLocaleString()}`
      : `PKR ${itemPrice.toLocaleString()}`;

    card.innerHTML = `
      <img src="${item.image_url || 'images/emerald_gown.jpg'}" class="drawer-item-img" onerror="handleImageError(this, '${item.category || 'formal'}')">
      <div class="drawer-item-info">
        <h4 class="drawer-item-title">${item.title}</h4>
        <div style="font-size: 0.75rem; color: var(--text-muted);">Size: ${item.selectedSize || 'M'}</div>
        <div class="drawer-item-price" style="margin-top: 4px;">${formattedPrice}</div>
      </div>
      <button class="drawer-remove-btn" title="Remove" onclick="removeFromCart(${index})">
        <i class="fa-solid fa-trash-can"></i>
      </button>
    `;
    container.appendChild(card);
  });

  const formattedTotal = currentCurrency === 'USD'
    ? `$${Math.round(totalPkr * PKR_TO_USD_RATE).toLocaleString()}`
    : `PKR ${totalPkr.toLocaleString()}`;

  if (subtotalSpan) subtotalSpan.textContent = formattedTotal;
}

function removeFromCart(index) {
  cartItems.splice(index, 1);
  localStorage.setItem('sb_cart_items', JSON.stringify(cartItems));
  updateBadges();
  renderCartDrawer();
  showToast('Item removed from cart');
}

function proceedCartCheckout() {
  if (cartItems.length === 0) return;
  closeCartDrawer();
  const firstItem = cartItems[0];
  openOrderModal(firstItem.title, firstItem.pricePkr || firstItem.price_pkr || 25000);
}

// 8. Order Checkout Modal Logic & Custom Sizing
function openOrderModal(title, pricePkr) {
  let prod = FULL_PRODUCT_CATALOGUE.find(p => p.title === title) || { image_url: 'images/emerald_gown.jpg', category: 'formal' };
  currentOrderingProduct = { title: title, pricePkr: pricePkr, selectedSize: 'M', discountRate: 0, image_url: prod.image_url, category: prod.category };
  
  // Add item to Cart drawer list automatically
  const existsInCart = cartItems.some(c => c.title === title);
  if (!existsInCart) {
    cartItems.push(currentOrderingProduct);
    localStorage.setItem('sb_cart_items', JSON.stringify(cartItems));
    updateBadges();
  }

  document.getElementById('orderModalTitle').textContent = `Order: ${title}`;
  updateModalPriceDisplay(pricePkr);
  document.getElementById('discountTag').style.display = 'none';

  document.getElementById('orderModal').classList.add('active');
}

function closeOrderModal() {
  document.getElementById('orderModal').classList.remove('active');
}

function selectSize(size, btnEl) {
  currentOrderingProduct.selectedSize = size;
  document.getElementById('customSizingBox').style.display = 'none';
  const btns = btnEl.parentElement.querySelectorAll('.size-btn');
  btns.forEach(b => b.classList.remove('active'));
  btnEl.classList.add('active');
}

function toggleCustomSizing(btnEl) {
  currentOrderingProduct.selectedSize = 'Custom';
  document.getElementById('customSizingBox').style.display = 'block';
  const btns = btnEl.parentElement.querySelectorAll('.size-btn');
  btns.forEach(b => b.classList.remove('active'));
  btnEl.classList.add('active');
}

// 9. Promo Code System (Works both with Backend API & Serverless GitHub Pages)
async function applyPromoCode() {
  const code = (document.getElementById('promoInput').value || '').trim().toUpperCase();
  if (!code) return;

  try {
    const res = await fetch(`${API_URL}/promo/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: code })
    });
    const data = await res.json();

    if (data.status === 'success') {
      currentOrderingProduct.discountRate = data.discount_rate;
      const discountedPrice = currentOrderingProduct.pricePkr * (1 - data.discount_rate);
      updateModalPriceDisplay(discountedPrice);
      document.getElementById('discountTag').style.display = 'inline-block';
      showToast(data.message);
      return;
    }
  } catch (err) {
    console.warn('API promo check offline, using client-side promo validator.');
  }

  // Client-side Promo Fallback for GitHub Pages
  const PROMO_CODES = {
    'SAMRINA10': { rate: 0.10, msg: '10% Discount Applied! 🎉' },
    'EID20': { rate: 0.20, msg: '20% Eid Discount Applied! 🌙' },
    'WELCOME5': { rate: 0.05, msg: '5% Welcome Discount Applied! ✨' }
  };

  if (PROMO_CODES[code]) {
    const promoInfo = PROMO_CODES[code];
    currentOrderingProduct.discountRate = promoInfo.rate;
    const discountedPrice = currentOrderingProduct.pricePkr * (1 - promoInfo.rate);
    updateModalPriceDisplay(discountedPrice);
    document.getElementById('discountTag').style.display = 'inline-block';
    showToast(promoInfo.msg);
  } else {
    showToast('Invalid promo code. Try SAMRINA10 or EID20');
  }
}

function updateModalPriceDisplay(pricePkr) {
  document.getElementById('orderModalPrice').textContent = currentCurrency === 'USD' 
    ? `$${Math.round(pricePkr * PKR_TO_USD_RATE).toLocaleString()}` 
    : `PKR ${pricePkr.toLocaleString()}`;
}

// 10. Submit Customer Order (Works 100% on GitHub Pages via Direct WhatsApp & Local Storage)
async function submitOrder(e) {
  e.preventDefault();

  const name = document.getElementById('custName').value;
  const phone = document.getElementById('custPhone').value;
  const address = document.getElementById('custAddress').value;

  let customMeasurements = '';
  if (currentOrderingProduct.selectedSize === 'Custom') {
    const c = document.getElementById('mChest').value;
    const w = document.getElementById('mWaist').value;
    const h = document.getElementById('mHips').value;
    const l = document.getElementById('mLength').value;
    customMeasurements = `Chest: ${c || 'Std'}, Waist: ${w || 'Std'}, Hips: ${h || 'Std'}, Length: ${l || 'Std'}`;
  }

  const finalPrice = currentOrderingProduct.pricePkr * (1 - currentOrderingProduct.discountRate);
  const generatedOrderNum = `SB-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

  const orderPayload = {
    order_number: generatedOrderNum,
    customer_name: name,
    customer_phone: phone,
    customer_address: address,
    product_title: currentOrderingProduct.title,
    size: currentOrderingProduct.selectedSize,
    custom_measurements: customMeasurements,
    total_price_pkr: finalPrice,
    discount_applied: currentOrderingProduct.discountRate,
    order_status: 'Pending'
  };

  let savedOrderNumber = generatedOrderNum;

  // 1. Try saving to Flask Backend API if online
  try {
    const res = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload)
    });
    
    const data = await res.json();
    if (data.status === 'success') {
      savedOrderNumber = data.order_number;
    }
  } catch (err) {
    console.warn('Backend API offline (GitHub Pages mode). Saving order to Local Storage & WhatsApp.');
  }

  // 2. Save order to LocalStorage for GitHub Pages Admin/Tracking
  let localOrders = JSON.parse(localStorage.getItem('samrina_orders') || '[]');
  localOrders.unshift(orderPayload);
  localStorage.setItem('samrina_orders', JSON.stringify(localOrders));

  // 3. Close Modal & Update Cart UI
  closeOrderModal();
  cartCount++;
  document.getElementById('cartCount').textContent = cartCount;

  // 4. Format & Trigger Direct WhatsApp / Gmail Order Message
  const formattedPriceText = currentCurrency === 'USD'
    ? `$${Math.round(finalPrice * PKR_TO_USD_RATE).toLocaleString()}`
    : `PKR ${finalPrice.toLocaleString()}`;

  const orderText = 
`🛍️ NEW ORDER - SAMRINA BOUTIQUE 🛍️

Order No: ${savedOrderNumber}
Dress: ${currentOrderingProduct.title}
Size: ${currentOrderingProduct.selectedSize} ${customMeasurements ? ' (' + customMeasurements + ')' : ''}
Total Bill: ${formattedPriceText} ${currentOrderingProduct.discountRate > 0 ? '(Promo Discount Applied!)' : ''}

----------------------------------------
👤 CUSTOMER DETAILS:
Name: ${name}
Phone: ${phone}
Address: ${address}

Please confirm my order and stitching schedule. Thank you!`;

  if (window.orderChannel === 'gmail') {
    showToast(`Order #${savedOrderNumber} Confirmed! Opening Gmail... 📧`);
    const targetEmail = 'samrinamughal456@gmail.com';
    const mailtoUrl = `mailto:${targetEmail}?subject=${encodeURIComponent(`NEW ORDER #${savedOrderNumber} - ${currentOrderingProduct.title}`)}&body=${encodeURIComponent(orderText)}`;
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${targetEmail}&su=${encodeURIComponent(`NEW ORDER #${savedOrderNumber} - ${currentOrderingProduct.title}`)}&body=${encodeURIComponent(orderText)}`;
    
    setTimeout(() => {
      const opened = window.open(gmailUrl, '_blank');
      if (!opened) window.location.href = mailtoUrl;
    }, 600);
  } else {
    showToast(`Order #${savedOrderNumber} Confirmed! Opening WhatsApp... 🛍️`);
    const waUrl = `https://wa.me/${BOUTIQUE_WHATSAPP_NUMBER}?text=${encodeURIComponent(orderText)}`;
    setTimeout(() => {
      window.open(waUrl, '_blank');
    }, 600);
  }
}

// 11. Live Order Tracking Modal Handlers
function openTrackModal() {
  document.getElementById('trackModal').classList.add('active');
}

function closeTrackModal() {
  document.getElementById('trackModal').classList.remove('active');
}

async function searchTrackOrder() {
  const orderNum = (document.getElementById('trackNumberInput').value || '').trim();
  if (!orderNum) return;

  // 1. Try REST API tracking
  try {
    const res = await fetch(`${API_URL}/orders/track/${encodeURIComponent(orderNum)}`);
    const data = await res.json();

    if (data.status === 'success') {
      const ord = data.data;
      displayTrackResult(ord);
      return;
    }
  } catch (err) {
    console.warn('API tracking unavailable, searching local storage.');
  }

  // 2. LocalStorage tracking fallback for GitHub Pages
  const localOrders = JSON.parse(localStorage.getItem('samrina_orders') || '[]');
  const matched = localOrders.find(o => o.order_number.toLowerCase() === orderNum.toLowerCase());

  if (matched) {
    displayTrackResult(matched);
  } else {
    showToast('Order number not found. Check again!');
  }
}

function displayTrackResult(ord) {
  document.getElementById('tOrdNum').textContent = `Order #${ord.order_number}`;
  document.getElementById('tStatusBadge').textContent = ord.order_status || 'Confirmed';
  document.getElementById('tCustName').textContent = ord.customer_name;
  document.getElementById('tDress').textContent = `${ord.product_title} (${ord.size})`;
  document.getElementById('tPrice').textContent = `PKR ${ord.total_price_pkr.toLocaleString()}`;

  document.getElementById('trackResultBox').style.display = 'block';
}

// 12. Toast Notification Handler
function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMessage');

  toastMsg.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// 13. Quick Search Tag Click Handler
function quickSearch(term) {
  const searchInput = document.getElementById('searchInput');
  searchInput.value = term;
  filterProducts();
  const section = document.getElementById('collections');
  if (section) section.scrollIntoView({ behavior: 'smooth' });
  showToast(`Filtered by "${term}"`);
}

// 14. Customer Care Modals Handlers (Size Guide, Shipping Policy, Contact Us)
function openSizeGuideModal() {
  const modal = document.getElementById('sizeGuideModal');
  if (modal) modal.classList.add('active');
}
function closeSizeGuideModal() {
  const modal = document.getElementById('sizeGuideModal');
  if (modal) modal.classList.remove('active');
}

function openShippingModal() {
  const modal = document.getElementById('shippingModal');
  if (modal) modal.classList.add('active');
}
function closeShippingModal() {
  const modal = document.getElementById('shippingModal');
  if (modal) modal.classList.remove('active');
}

function openContactModal() {
  const modal = document.getElementById('contactModal');
  if (modal) modal.classList.add('active');
}
function closeContactModal() {
  const modal = document.getElementById('contactModal');
  if (modal) modal.classList.remove('active');
}

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
  updateBadges();
  loadProducts();
});
