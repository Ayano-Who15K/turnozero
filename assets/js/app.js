// --- START OF JAVASCRIPT ---

// --- CATALOGO DE PRODUTOS (EDITAR AQUI) ---
const products = [
  {
    id: 1,
    name: 'Cerveja Heineken 330ml',
    price: 8.99,
    compareAtPrice: 10.0,
    category: 'Bebidas',
    image: '',
    tags: ['cerveja', 'gelada', 'alcoólica', 'promoção'],
    stock: 50,
    deliveryEtaMinutes: 25,
    description:
      'A clássica cerveja Heineken em sua versão de 330ml. Refrescante e ideal para qualquer momento.',
  },
];
// --- FIM DO CATÁLOGO DE PRODUTOS ---

// Variáveis e Constantes
const mainContent = document.getElementById('main-content');
const productList = document.getElementById('product-list');
const cartBadge = document.getElementById('cart-badge');
const cartBadgeMobile = document.getElementById('cart-badge-mobile');
const cartItemsContainer = document.getElementById('cart-items');
const cartSubtotalEl = document.getElementById('cart-subtotal');
const cartShippingEl = document.getElementById('cart-shipping');
const cartTotalEl = document.getElementById('cart-total');
const searchInput = document.getElementById('search-input');
const autocompleteResults = document.getElementById('autocomplete-results');
const body = document.body;
const modeToggleBtn = document.getElementById('mode-toggle');
const cartModal = document.getElementById('cart-modal');
const cartIcon = document.getElementById('cart-icon');
const closeCartBtn = document.getElementById('close-cart-btn');
const mobileMenuToggle = document.getElementById('menu-toggle');
const mobileCategoriesMenu = document.getElementById('categories-menu');
const mobileNavCartBtn = document.querySelector('.cart-btn-mobile');
const homeLink = document.getElementById('home-link');

// --- Configurações da Loja (editar aqui) ---
const config = {
  whatsappNumber: '5548999999999', // Exemplo: 55DDDNUMERO
  shippingFee: 10.0,
  coupons: {
    NOITETZR5: { type: 'fixed', value: 5.0 },
    FRETEGRATIS100: { type: 'freeShipping', minValue: 100.0 },
  },
};

let currentCart = JSON.parse(localStorage.getItem('cart')) || [];
let appliedCoupon = JSON.parse(localStorage.getItem('appliedCoupon')) || null;
let isProductDetailPage = false;

// --- Funções de Catálogo e Renderização ---

function renderHomePage() {
  isProductDetailPage = false;
  mainContent.innerHTML = `
                <section class="catalog" id="product-catalog">
                    <div id="product-list" class="product-grid"></div>
                </section>
            `;
  const productList = document.getElementById('product-list');
  renderProducts(products);
  renderCategories();
}

function renderProducts(filteredProducts = products) {
  const productList = document.getElementById('product-list');
  if (!productList) return;

  productList.innerHTML = '';
  if (filteredProducts.length === 0) {
    productList.innerHTML =
      '<p class="no-results">Nenhum produto encontrado.</p>';
    return;
  }
  filteredProducts.forEach((product) => {
    const card = document.createElement('div');
    card.classList.add('product-card');

    const discountHTML = product.compareAtPrice
      ? `<span class="product-card__discount">${calculateDiscount(
          product.price,
          product.compareAtPrice
        )}% OFF</span>`
      : '';

    card.innerHTML = `
                    <a href="#" class="product-link" data-id="${product.id}">
                        <img src="${product.image}" alt="${
      product.name
    }" class="product-card__image">
                    </a>
                    <div class="product-card__content">
                        <a href="#" class="product-link" data-id="${
                          product.id
                        }"><h3 class="product-card__name">${
      product.name
    }</h3></a>
                        <div class="product-card__prices">
                            <span class="product-card__price">R$ ${product.price.toFixed(
                              2
                            )}</span>
                            ${
                              product.compareAtPrice
                                ? `<span class="product-card__compare-price">R$ ${product.compareAtPrice.toFixed(
                                    2
                                  )}</span>`
                                : ''
                            }
                        </div>
                        ${discountHTML}
                        <small class="product-card__delivery">Entrega em aprox. ${
                          product.deliveryEtaMinutes
                        } min</small>
                    </div>
                    <button class="add-to-cart-btn" data-product-id="${
                      product.id
                    }">Adicionar</button>
                `;

    productList.appendChild(card);
  });
}

function calculateDiscount(currentPrice, comparePrice) {
  return Math.round(((comparePrice - currentPrice) / comparePrice) * 100);
}

function renderCategories() {
  const categories = [...new Set(products.map((p) => p.category))];
  const categoriesMenu = document.getElementById('categories-menu');
  if (!categoriesMenu) return;
  categoriesMenu.innerHTML = categories
    .map(
      (cat) =>
        `<a href="#" class="category-link" data-category="${cat}">${cat}</a>`
    )
    .join('');

  document.querySelectorAll('.category-link').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const category = e.target.dataset.category;
      const filtered = products.filter((p) => p.category === category);
      renderProducts(filtered);
    });
  });
}

function renderProductDetailPage(productId) {
  isProductDetailPage = true;
  const product = products.find((p) => p.id === productId);
  if (!product) {
    mainContent.innerHTML = '<p class="container">Produto não encontrado.</p>';
    return;
  }

  mainContent.innerHTML = ''; // Limpa a página

  document.title = product.name;
  const discountHTML = product.compareAtPrice
    ? `<span class="product-card__discount">${calculateDiscount(
        product.price,
        product.compareAtPrice
      )}% OFF</span>`
    : '';

  const detailContainer = document.createElement('div');
  detailContainer.classList.add('container', 'product-detail-page');
  detailContainer.id = 'product-detail';
  detailContainer.innerHTML = `
                <div class="product-detail">
                    <div class="product-detail__image">
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                    <div class="product-detail__info">
                        <h1>${product.name}</h1>
                        <div class="product-detail__prices">
                            <span class="product-detail__price">R$ ${product.price.toFixed(
                              2
                            )}</span>
                            ${
                              product.compareAtPrice
                                ? `<span class="product-detail__compare-price">R$ ${product.compareAtPrice.toFixed(
                                    2
                                  )}</span>`
                                : ''
                            }
                        </div>
                        ${discountHTML}
                        <p class="product-detail__description">${
                          product.description
                        }</p>
                        <div class="product-detail__meta">
                            <p><strong>Categoria:</strong> ${
                              product.category
                            }</p>
                            <p><strong>Tempo de Entrega:</strong> Aprox. ${
                              product.deliveryEtaMinutes
                            } minutos</p>
                            <p><strong>Tags:</strong> ${product.tags.join(
                              ', '
                            )}</p>
                        </div>
                        <button class="add-to-cart-btn" data-product-id="${
                          product.id
                        }">Adicionar ao Carrinho</button>
                    </div>
                </div>
            `;
  mainContent.appendChild(detailContainer);
}

// --- Funções de Busca e Filtro ---

function handleSearchAutocomplete(query) {
  if (!autocompleteResults) return;
  autocompleteResults.innerHTML = '';
  if (query.length < 2) {
    autocompleteResults.style.display = 'none';
    return;
  }
  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()))
  );

  if (filtered.length > 0) {
    filtered.slice(0, 5).forEach((product) => {
      const item = document.createElement('div');
      item.classList.add('autocomplete-item');
      item.textContent = product.name;
      item.addEventListener('click', () => {
        searchInput.value = product.name;
        filterProducts(product.name);
        autocompleteResults.style.display = 'none';
      });
      autocompleteResults.appendChild(item);
    });
    autocompleteResults.style.display = 'block';
  } else {
    autocompleteResults.style.display = 'none';
  }
}

function filterProducts(query) {
  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()))
  );
  renderProducts(filtered);
}

// --- Funções de Carrinho ---

function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  const existingItem = currentCart.find((item) => item.id === productId);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    currentCart.push({ ...product, quantity: 1 });
  }
  updateCart();
  showToast(`${product.name} adicionado ao carrinho!`, 'success');
}

function removeFromCart(productId) {
  currentCart = currentCart.filter((item) => item.id !== productId);
  updateCart();
  showToast('Produto removido do carrinho.', 'info');
}

function updateQuantity(productId, newQuantity) {
  const item = currentCart.find((item) => item.id === productId);
  if (item) {
    item.quantity = newQuantity > 0 ? newQuantity : 1;
  }
  updateCart();
}

function renderCart() {
  if (!cartItemsContainer || !cartSubtotalEl || !cartShippingEl || !cartTotalEl)
    return;

  cartItemsContainer.innerHTML = '';
  let subtotal = 0;
  if (currentCart.length === 0) {
    cartItemsContainer.innerHTML =
      '<p class="cart-empty">Seu carrinho está vazio.</p>';
    cartSubtotalEl.textContent = '0.00';
    cartShippingEl.textContent = '10.00';
    cartTotalEl.textContent = '10.00';
    return;
  }

  currentCart.forEach((item) => {
    const itemEl = document.createElement('div');
    itemEl.classList.add('cart-item');
    subtotal += item.price * item.quantity;
    itemEl.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p>R$ ${item.price.toFixed(2)}</p>
                        <div class="quantity-controls">
                            <button class="quantity-btn decrease-quantity" data-id="${
                              item.id
                            }">-</button>
                            <span>${item.quantity}</span>
                            <button class="quantity-btn increase-quantity" data-id="${
                              item.id
                            }">+</button>
                        </div>
                    </div>
                    <button class="remove-from-cart-btn" data-id="${
                      item.id
                    }">&times;</button>
                `;
    cartItemsContainer.appendChild(itemEl);
  });

  const shipping =
    appliedCoupon?.type === 'freeShipping' ? 0 : config.shippingFee;
  let total = subtotal + shipping;
  if (appliedCoupon?.type === 'fixed') {
    total = Math.max(0, total - appliedCoupon.value); // Evita total negativo
  }

  cartSubtotalEl.textContent = subtotal.toFixed(2);
  cartShippingEl.textContent = shipping.toFixed(2);
  cartTotalEl.textContent = total.toFixed(2);
}

function updateCart() {
  localStorage.setItem('cart', JSON.stringify(currentCart));
  localStorage.setItem('appliedCoupon', JSON.stringify(appliedCoupon));
  const totalItems = currentCart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartBadge) cartBadge.textContent = totalItems;
  if (cartBadgeMobile) cartBadgeMobile.textContent = totalItems;
  renderCart();
}

function applyCoupon(code) {
  const coupon = config.coupons[code.toUpperCase()];
  if (!coupon) {
    showToast('Cupom inválido.', 'error');
    return;
  }
  const subtotal = currentCart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (coupon.type === 'freeShipping' && subtotal < coupon.minValue) {
    showToast(
      `Cupom inválido. Valor mínimo de R$ ${coupon.minValue.toFixed(2)}.`,
      'error'
    );
    return;
  }

  appliedCoupon = {
    code: code.toUpperCase(),
    type: coupon.type,
    value: coupon.value,
  };
  updateCart();
  showToast(`Cupom ${code.toUpperCase()} aplicado com sucesso!`, 'success');
}

// --- Funções de Checkout (WhatsApp) ---

function generateWhatsAppMessage(clientInfo) {
  let message = `Olá! Gostaria de fazer o seguinte pedido:\n\n`;
  message += `*Dados do Cliente:*\n`;
  message += `Nome: ${clientInfo.name}\n`;
  message += `Endereço: ${clientInfo.address}\n`;
  if (clientInfo.notes) {
    message += `Observações: ${clientInfo.notes}\n`;
  }
  message += `\n*Itens do Pedido:*\n`;

  let subtotal = 0;
  currentCart.forEach((item) => {
    subtotal += item.price * item.quantity;
    message += `- ${item.name} (x${item.quantity}): R$ ${(
      item.price * item.quantity
    ).toFixed(2)}\n`;
  });

  const shipping =
    appliedCoupon?.type === 'freeShipping' ? 0 : config.shippingFee;
  let total = subtotal + shipping;
  if (appliedCoupon?.type === 'fixed') {
    total = Math.max(0, total - appliedCoupon.value);
  }

  message += `\n*Resumo dos Valores:*\n`;
  message += `Subtotal: R$ ${subtotal.toFixed(2)}\n`;
  message += `Frete: R$ ${shipping.toFixed(2)}\n`;
  if (appliedCoupon) {
    message += `Cupom aplicado: ${appliedCoupon.code}\n`;
  }
  message += `*TOTAL: R$ ${total.toFixed(2)}*\n\n`;
  message += `Obrigado!`;

  return message;
}

function openWhatsAppCheckout(clientInfo) {
  const message = generateWhatsAppMessage(clientInfo);
  const url = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(
    message
  )}`;
  window.open(url, '_blank');
}

// --- Funções de UI (User Interface) ---

function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    body.classList.toggle('dark-mode', savedTheme === 'dark');
  }
}

function toggleTheme() {
  body.classList.toggle('dark-mode');
  const newTheme = body.classList.contains('dark-mode') ? 'dark' : 'light';
  localStorage.setItem('theme', newTheme);
}

function showModal(modalElement) {
  modalElement.classList.add('is-visible');
}

function closeModal(modalElement) {
  modalElement.classList.remove('is-visible');
}

function showToast(message, type = 'info') {
  const toastContainer = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.classList.add('toast', `toast--${type}`);
  toast.textContent = message;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('hide');
    toast.addEventListener('transitionend', () => {
      toast.remove();
    });
  }, 3000);
}

// --- Event Listeners Globais ---
document.addEventListener('DOMContentLoaded', () => {
  initTheme();

  // Lógica para navegação entre home e detalhes do produto
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  if (productId) {
    renderProductDetailPage(parseInt(productId));
  } else {
    renderHomePage();
  }

  updateCart();

  // Evento de clique para voltar à home
  homeLink.addEventListener('click', (e) => {
    e.preventDefault();
    window.history.pushState({}, '', '/');
    renderHomePage();
  });

  // Gerencia o clique nos botões de adicionar ao carrinho
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-to-cart-btn')) {
      const productId = parseInt(e.target.dataset.productId);
      addToCart(productId);
    }
    if (e.target.classList.contains('product-link')) {
      e.preventDefault();
      const productId = parseInt(e.target.dataset.id);
      window.history.pushState({}, '', `?id=${productId}`);
      renderProductDetailPage(productId);
    }
  });

  // Gerencia a busca
  if (searchInput) {
    searchInput.addEventListener('input', (e) =>
      handleSearchAutocomplete(e.target.value)
    );
    document
      .getElementById('search-button')
      .addEventListener('click', () => filterProducts(searchInput.value));
  }

  // Gerencia a UI (dark mode, modais, etc)
  if (modeToggleBtn) {
    modeToggleBtn.addEventListener('click', toggleTheme);
  }

  if (cartIcon) {
    cartIcon.addEventListener('click', (e) => {
      e.preventDefault();
      renderCart();
      showModal(cartModal);
    });
  }

  if (mobileNavCartBtn) {
    mobileNavCartBtn.addEventListener('click', (e) => {
      e.preventDefault();
      renderCart();
      showModal(cartModal);
    });
  }

  if (closeCartBtn) {
    closeCartBtn.addEventListener('click', () => closeModal(cartModal));
  }

  const closeCheckoutBtn = document.getElementById('close-checkout-btn');
  if (closeCheckoutBtn) {
    closeCheckoutBtn.addEventListener('click', () =>
      closeModal(document.getElementById('checkout-modal'))
    );
  }

  window.addEventListener('click', (e) => {
    if (e.target === cartModal) {
      closeModal(cartModal);
    }
    if (e.target === document.getElementById('checkout-modal')) {
      closeModal(document.getElementById('checkout-modal'));
    }
  });

  if (mobileMenuToggle && mobileCategoriesMenu) {
    mobileMenuToggle.addEventListener('click', () => {
      mobileCategoriesMenu.classList.toggle('is-visible');
    });
  }

  if (cartItemsContainer) {
    cartItemsContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('increase-quantity')) {
        const id = parseInt(e.target.dataset.id);
        const item = currentCart.find((p) => p.id === id);
        if (item) {
          updateQuantity(id, item.quantity + 1);
        }
      }
      if (e.target.classList.contains('decrease-quantity')) {
        const id = parseInt(e.target.dataset.id);
        const item = currentCart.find((p) => p.id === id);
        if (item) {
          updateQuantity(id, item.quantity - 1);
        }
      }
      if (e.target.classList.contains('remove-from-cart-btn')) {
        const id = parseInt(e.target.dataset.id);
        removeFromCart(id);
      }
    });
  }

  // Gerencia o cupom
  const applyCouponBtn = document.getElementById('apply-coupon-btn');
  if (applyCouponBtn) {
    applyCouponBtn.addEventListener('click', () => {
      const couponInput = document.getElementById('coupon-input');
      applyCoupon(couponInput.value);
    });
  }

  // Gerencia o checkout
  const checkoutBtn = document.getElementById('checkout-btn');
  const checkoutModal = document.getElementById('checkout-modal');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      showModal(checkoutModal);
      const lastClientInfo = JSON.parse(localStorage.getItem('lastClientInfo'));
      if (lastClientInfo) {
        document.getElementById('client-name').value = lastClientInfo.name;
        document.getElementById('client-address').value =
          lastClientInfo.address;
      }
    });
  }

  const checkoutForm = document.getElementById('checkout-form');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const clientInfo = {
        name: document.getElementById('client-name').value,
        address: document.getElementById('client-address').value,
        notes: document.getElementById('client-notes').value,
      };
      localStorage.setItem('lastClientInfo', JSON.stringify(clientInfo));
      openWhatsAppCheckout(clientInfo);
      closeModal(checkoutModal);

      currentCart = [];
      appliedCoupon = null;
      updateCart();
      showToast('Pedido enviado com sucesso!', 'success');
    });
  }
});
// --- END OF JAVASCRIPT ---
