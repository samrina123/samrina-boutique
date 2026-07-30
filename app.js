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

// 1. Mobile Menu Drawer Toggle
function toggleMobileMenu() {
  const navMenu = document.getElementById('navMenu');
  navMenu.classList.toggle('active');
}

// 2. Fetch Live Products or Filter Client Dataset
async function loadProducts(category = 'all', search = '') {
  const grid = document.getElementById('productsGrid');

  try {
    let url = `${API_URL}/products?category=${category}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;

    const res = await fetch(url);
    const data = await res.json();

    if (data.status === 'success') {
      allProducts = data.data;
      renderProductsGrid(allProducts);
      renderSimilarProducts(allProducts, category, search);
      return;
    }
  } catch (err) {
    console.warn('Backend API offline or reloading, using robust full catalogue fallback.');
  }

  // Robust Client-side Filtering if API server is restarting
  let filtered = FULL_PRODUCT_CATALOGUE;
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
  renderSimilarProducts(allProducts, category, search);
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

    card.innerHTML = `
      <div class="product-img-wrapper">
        <span class="product-tag">${p.stock_status || 'EXCLUSIVE'}</span>
        <span class="fabric-badge"><i class="fa-solid fa-shirt"></i> ${p.fabric}</span>
        <button class="wishlist-btn" onclick="toggleWishlist(this)"><i class="fa-regular fa-heart"></i></button>
        <img src="${p.image_url}" alt="${p.title}" onerror="this.src='images/emerald_gown.jpg'">
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
          <div class="product-price" data-price-pkr="${p.price_pkr}">${formattedPrice}</div>
          <button class="whatsapp-order-btn" onclick="openOrderModal('${p.title.replace(/'/g, "\\'")}', ${p.price_pkr})">
            <i class="fa-solid fa-bag-shopping"></i> Order Now
          </button>
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

    card.innerHTML = `
      <div class="product-img-wrapper">
        <span class="product-tag" style="background:var(--gold-primary); color:var(--primary-emerald);">SIMILAR ITEM</span>
        <span class="fabric-badge"><i class="fa-solid fa-shirt"></i> ${p.fabric}</span>
        <button class="wishlist-btn" onclick="toggleWishlist(this)"><i class="fa-regular fa-heart"></i></button>
        <img src="${p.image_url}" alt="${p.title}" onerror="this.src='images/emerald_gown.jpg'">
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

// 7. Wishlist Heart Toggle
function toggleWishlist(btnEl) {
  const isHearted = btnEl.classList.contains('active');
  const icon = btnEl.querySelector('i');

  if (isHearted) {
    btnEl.classList.remove('active');
    icon.className = 'fa-regular fa-heart';
    wishlistCount = Math.max(0, wishlistCount - 1);
    showToast('Removed from wishlist');
  } else {
    btnEl.classList.add('active');
    icon.className = 'fa-solid fa-heart';
    wishlistCount++;
    showToast('Saved to wishlist ❤️');
  }

  document.getElementById('wishlistCount').textContent = wishlistCount;
}

// 8. Order Checkout Modal Logic & Custom Sizing
function openOrderModal(title, pricePkr) {
  currentOrderingProduct = { title: title, pricePkr: pricePkr, selectedSize: 'M', discountRate: 0 };
  
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

// 9. Promo Code System
async function applyPromoCode() {
  const code = document.getElementById('promoInput').value;
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
    }
  } catch (err) {
    showToast('Invalid promo code');
  }
}

function updateModalPriceDisplay(pricePkr) {
  document.getElementById('orderModalPrice').textContent = currentCurrency === 'USD' 
    ? `$${Math.round(pricePkr * PKR_TO_USD_RATE).toLocaleString()}` 
    : `PKR ${pricePkr.toLocaleString()}`;
}

// 10. Submit Customer Order to SQLite Backend Database
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
    customMeasurements = `Chest: ${c}, Waist: ${w}, Hips: ${h}, Length: ${l}`;
  }

  const finalPrice = currentOrderingProduct.pricePkr * (1 - currentOrderingProduct.discountRate);

  const orderPayload = {
    customer_name: name,
    customer_phone: phone,
    customer_address: address,
    product_title: currentOrderingProduct.title,
    size: currentOrderingProduct.selectedSize,
    custom_measurements: customMeasurements,
    total_price_pkr: finalPrice,
    discount_applied: currentOrderingProduct.discountRate
  };

  try {
    const res = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload)
    });
    
    const data = await res.json();

    if (data.status === 'success') {
      closeOrderModal();
      cartCount++;
      document.getElementById('cartCount').textContent = cartCount;
      showToast(`Order ${data.order_number} saved to Database! 🎉`);
      
      // Also open WhatsApp pre-filled confirmation
      const waMsg = encodeURIComponent(`Hello Samrina Boutique! I have placed Order ${data.order_number} for "${currentOrderingProduct.title}" (Size: ${currentOrderingProduct.selectedSize}${customMeasurements ? ', ' + customMeasurements : ''}). My Name: ${name}, Address: ${address}.`);
      let waUrl = `https://wa.me/${BOUTIQUE_WHATSAPP_NUMBER}?text=${waMsg}`;
      setTimeout(() => {
        window.open(waUrl, '_blank');
      }, 1000);
    }
  } catch (err) {
    alert('Could not connect to database backend.');
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
  const orderNum = document.getElementById('trackNumberInput').value;
  if (!orderNum) return;

  try {
    const res = await fetch(`${API_URL}/orders/track/${encodeURIComponent(orderNum)}`);
    const data = await res.json();

    if (data.status === 'success') {
      const ord = data.data;
      document.getElementById('tOrdNum').textContent = `Order #${ord.order_number}`;
      document.getElementById('tStatusBadge').textContent = ord.order_status;
      document.getElementById('tCustName').textContent = ord.customer_name;
      document.getElementById('tDress').textContent = `${ord.product_title} (${ord.size})`;
      document.getElementById('tPrice').textContent = `PKR ${ord.total_price_pkr.toLocaleString()}`;

      document.getElementById('trackResultBox').style.display = 'block';
    }
  } catch (err) {
    showToast('Order number not found. Check again!');
  }
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

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
});
