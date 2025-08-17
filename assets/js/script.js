// Sample product data
const products = [
  {
    id: 1,
    title: "Brahma Lata 350ml",
    price: 5,
    image: "../../assets/img/cervejaslata/brahmalata350ml.png",
    category: "bebidas",
    description:
      "Refrescante, dourada e com espuma cremosa, a Brahma na lata é a companhia perfeita para qualquer momento. Seu sabor leve e equilibrado traz a harmonia ideal entre malte e lúpulo, tornando cada gole suave e prazeroso. Gelada, realça ainda mais sua personalidade marcante, sendo presença garantida em churrascos, festas e encontros com amigos. Prática e fácil de transportar, a lata preserva todo o frescor e aroma da cerveja, garantindo que a experiência Brahma seja sempre do primeiro ao último gole",
    installments: "Pacote 📦 com 12 latas sai por 60 reais",
  },
  {
    id: 2,
    title: "Brahma Duplo Malte Lata 350ml",
    price: 5,
    image: "../../assets/img/cervejaslata/brahmaduplomalte350ml.png",
    category: "bebidas",
    description:
      "Brahma Duplo Malte combina o melhor de dois mundos: a suavidade do malte Pilsner com a intensidade do malte Munich. O resultado é uma cerveja dourada, encorpada na medida certa e com aroma marcante, mas que mantém a leveza perfeita para acompanhar qualquer ocasião. Na prática lata de 350ml, o frescor é preservado e o sabor é entregue como deve ser: equilibrado, cremoso e irresistível. Uma experiência pensada para quem aprecia mais sabor, sem abrir mão da suavidade.",
    installments: "Pacote 📦 com 12 latas sai por 60 reais",
  },
  {
    id: 3,
    title: "Budweiser Lata 350ml",
    price: 5,
    image: "../../assets/img/cervejaslata/budweiserlata350ml.png",
    category: "bebidas",
    description:
      "Com seu inconfundível aroma e sabor marcante, a Budweiser é produzida com malte de cevada selecionado e um toque especial de lúpulos aromáticos. Sua receita única, que inclui o exclusivo processo de maturação com lascas de madeira de faia (Beechwood Aging), garante uma cerveja suave, refrescante e com final limpo. Na lata, todo esse frescor é preservado, oferecendo a experiência Bud na medida certa para qualquer momento — do churrasco ao encontro casual com amigos.",
    installments: "Pacote 📦 com 12 latas sai por 60 reais",
  },
  {
    id: 4,
    title: "Antarctica Lata 350ml",
    price: 5,
    image: "../../assets/img/cervejaslata/antarcticalata350ml.png",
    category: "bebidas",
    description:
      "Clara, leve e extremamente refrescante, a Antarctica é a escolha perfeita para quem busca sabor suave e momentos descontraídos. Produzida com malte, lúpulo e água de qualidade, traz o equilíbrio ideal entre aroma e leveza, tornando cada gole uma pausa para aproveitar a vida. Na lata, mantém o frescor e a temperatura por mais tempo, pronta para acompanhar aquele churrasco, roda de amigos ou qualquer celebração. Antarctica: o sabor oficial da boa companhia.",
    installments: "Pacote 📦 com 12 latas sai por 60 reais",
  },
  {
    id: 5,
    title: "A Outra Lata 350ml",
    price: 5,
    image: "../../assets/img/cervejaslata/aoutralata350ml.png",
    category: "bebidas",
    description: "Clara, leve e extremamente refrescante.",
    installments: "Pacote 📦 com 12 latas sai por 60 reais",
  },
  {
    id: 6,
    title: "Heineken Lata 350ml",
    price: 5,
    image: "../../assets/img/cervejaslata/heinekenlata350ml.png",
    category: "bebidas",
    description: "Clara, leve e extremamente refrescante.",
    installments: "Pacote 📦 com 12 latas sai por 60 reais",
  },
  {
    id: 7,
    title: "Skol Lata 350ml",
    price: 5,
    image: "../../assets/img/cervejaslata/skollata350ml.png",
    category: "bebidas",
    description: "Clara, leve e extremamente refrescante.",
    installments: "Pacote 📦 com 12 latas sai por 60 reais",
  },
]

// Shopping cart
let cart = JSON.parse(localStorage.getItem("cart")) || []

// DOM elements
const searchInput = document.getElementById("searchInput")
const searchBtn = document.getElementById("searchBtn")
const productsGrid = document.getElementById("productsGrid")
const productsGrid2 = document.getElementById("productsGrid2")
const cartBtn = document.getElementById("cartBtn")
const cartCount = document.getElementById("cartCount")
const cartModal = document.getElementById("cartModal")
const productModal = document.getElementById("productModal")
const sortSelect = document.getElementById("sortSelect")
const categoryLinks = document.querySelectorAll("[data-category]")

// Current filters
let currentCategory = "all"
let currentSearch = ""
let currentSort = "relevance"

// Initialize the app
document.addEventListener("DOMContentLoaded", () => {
  displayProducts()
  updateCartCount()
  setupEventListeners()
})

// Event listeners
function setupEventListeners() {
  // Search functionality
  searchBtn.addEventListener("click", handleSearch)
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  })

  // Category filtering
  categoryLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()
      const category = this.getAttribute("data-category")
      filterByCategory(category)

      // Update active category
      categoryLinks.forEach((l) => l.classList.remove("active"))
      this.classList.add("active")
    })
  })

  // Sort functionality
  sortSelect.addEventListener("change", function () {
    currentSort = this.value
    displayProducts()
  })

  // Cart modal
  cartBtn.addEventListener("click", openCartModal)

  // Modal close buttons
  document.querySelectorAll(".close").forEach((closeBtn) => {
    closeBtn.addEventListener("click", function () {
      this.closest(".modal").style.display = "none"
    })
  })

  // Close modal when clicking outside
  window.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal")) {
      e.target.style.display = "none"
    }
  })

  // Cart actions
  document.getElementById("clearCart").addEventListener("click", clearCart)
  document.getElementById("checkout").addEventListener("click", checkout)
}

// Search functionality
function handleSearch() {
  currentSearch = searchInput.value.toLowerCase().trim()
  displayProducts()
}

// Category filtering
function filterByCategory(category) {
  currentCategory = category
  displayProducts()
}

// Display products
function displayProducts() {
  let filteredProducts = [...products]

  // Apply category filter
  if (currentCategory !== "all") {
    filteredProducts = filteredProducts.filter((product) => product.category === currentCategory)
  }

  // Apply search filter
  if (currentSearch) {
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.title.toLowerCase().includes(currentSearch) ||
        product.description.toLowerCase().includes(currentSearch),
    )
  }

  // Apply sorting
  switch (currentSort) {
    case "price-low":
      filteredProducts.sort((a, b) => a.price - b.price)
      break
    case "price-high":
      filteredProducts.sort((a, b) => b.price - a.price)
      break
    case "name":
      filteredProducts.sort((a, b) => a.title.localeCompare(b.title))
      break
    default:
      break
  }

  // Render products
  productsGrid.innerHTML = ""

  if (filteredProducts.length === 0) {
    productsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                <i class="fas fa-search" style="font-size: 48px; color: #ccc; margin-bottom: 20px;"></i>
                <h3>Nenhum produto encontrado</h3>
                <p>Tente buscar por outros termos ou navegue pelas categorias.</p>
            </div>
        `
    return
  }

  filteredProducts.forEach((product) => {
    const productCard = createProductCard(product)
    productsGrid.appendChild(productCard)
  })
}

// Create product card
function createProductCard(product) {
  const card = document.createElement("div")
  card.className = "product-card"
  card.innerHTML = `
        <img src="${product.image}" alt="${product.title}" class="product-image">
        <div class="product-info">
            <h3 class="product-title">${product.title}</h3>
            <div class="product-price">R$ ${product.price.toFixed(2).replace(".", ",")}</div>
            <div class="product-installments">${product.installments}</div>
            <div class="product-actions">
                <button class="btn-secondary" onclick="openProductModal(${product.id})">Ver Detalhes</button>
                <button class="btn-primary" onclick="addToCart(${product.id})">Comprar</button>
            </div>
        </div>
    `
  return card
}

// Add to cart
function addToCart(productId) {
  const product = products.find((p) => p.id === productId)
  if (!product) return

  const existingItem = cart.find((item) => item.id === productId)

  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cart.push({
      ...product,
      quantity: 1,
    })
  }

  updateCart()
  showNotification("Produto adicionado ao carrinho!")
}

// Update cart
function updateCart() {
  localStorage.setItem("cart", JSON.stringify(cart))
  updateCartCount()
}

// Update cart count
function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  cartCount.textContent = totalItems
  cartCount.style.display = totalItems > 0 ? "flex" : "none"
}

// Open cart modal
function openCartModal() {
  const cartItems = document.getElementById("cartItems")
  const cartTotal = document.getElementById("cartTotal")
  const taxadeentrega = 5

  if (cart.length === 0) {
    cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h3>Seu carrinho está vazio</h3>
                <p>Adicione produtos para começar suas compras!</p>
            </div>
        `
    cartTotal.textContent = "0,00"
  } else {
    cartItems.innerHTML = ""
    let subtotal = 0

    cart.forEach((item) => {
      const itemElement = createCartItem(item)
      cartItems.appendChild(itemElement)
      subtotal += item.price * item.quantity
    })

    const total = subtotal + taxadeentrega
    cartTotal.textContent = total.toFixed(2).replace(".", ",")
  }

  cartModal.style.display = "block"
}

// Create cart item
function createCartItem(item) {
  const itemDiv = document.createElement("div")
  itemDiv.className = "cart-item"
  itemDiv.innerHTML = `
        <img src="${item.image}" alt="${item.title}" class="cart-item-image">
        <div class="cart-item-info">
            <div class="cart-item-title">${item.title}</div>
            <div class="cart-item-price">R$ ${item.price.toFixed(2).replace(".", ",")}</div>
            <div class="cart-item-controls">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">Remover</button>
            </div>
        </div>
    `
  return itemDiv
}

// Update quantity
function updateQuantity(productId, change) {
  const item = cart.find((item) => item.id === productId)
  if (!item) return

  item.quantity += change

  if (item.quantity <= 0) {
    removeFromCart(productId)
  } else {
    updateCart()
    openCartModal()
  }
}

// Remove from cart
function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId)
  updateCart()
  openCartModal()
}

// Clear cart
function clearCart() {
  if (confirm("Tem certeza que deseja limpar o carrinho?")) {
    cart = []
    updateCart()
    openCartModal()
  }
}

// Checkout
function checkout() {
  if (cart.length === 0) {
    alert("Seu carrinho está vazio!")
    return
  }

  sendOrderViaWhatsApp()

  cart = []
  updateCart()
  cartModal.style.display = "none"
  showNotification("Pedido enviado! Em breve entraremos em contato.")
}

// Open product modal
function openProductModal(productId) {
  const product = products.find((p) => p.id === productId)
  if (!product) return

  const modalBody = document.getElementById("productModalBody")
  modalBody.innerHTML = `
        <div class="product-detail">
            <div class="product-detail-image">
                <img src="${product.image}" alt="${product.title}">
            </div>
            <div class="product-detail-info">
                <h2 class="product-detail-title">${product.title}</h2>
                <div class="product-detail-price">R$ ${product.price.toFixed(2).replace(".", ",")}</div>
                <div class="product-detail-installments">${product.installments}</div>
                <div class="product-detail-description">
                    <p>${product.description}</p>
                </div>
                <div class="product-detail-actions">
                    <button class="btn-secondary" onclick="productModal.style.display='none'">Fechar</button>
                    <button class="btn-primary" onclick="addToCart(${product.id}); productModal.style.display='none'">Adicionar ao Carrinho</button>
                </div>
            </div>
        </div>
    `

  productModal.style.display = "block"
}

// Show notification
function showNotification(message) {
  const notification = document.createElement("div")
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #00a650;
        color: white;
        padding: 15px 20px;
        border-radius: 4px;
        z-index: 3000;
        font-weight: bold;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        animation: slideInRight 0.3s ease;
    `
  notification.textContent = message

  if (!document.querySelector("#notification-styles")) {
    const style = document.createElement("style")
    style.id = "notification-styles"
    style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `
    document.head.appendChild(style)
  }

  document.body.appendChild(notification)

  setTimeout(() => {
    notification.remove()
  }, 3000)
}

// Send order via WhatsApp
function sendOrderViaWhatsApp() {
  const phoneNumber = "5548996868430"
  const taxadeentrega = 5
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const total = subtotal + taxadeentrega
  const now = new Date()
  const orderTime = now.toLocaleTimeString("pt-BR")

  let message = `*Novo Pedido* 🛍️\n\n`
  message += `*Horário do Pedido:* ${orderTime}\n\n`
  message += `*Itens do Pedido:*\n`

  cart.forEach((item) => {
    const itemTotal = (item.price * item.quantity).toFixed(2).replace(".", ",")
    message += `
- ${item.title} (x${item.quantity})
  Preço Unitário: R$ ${item.price.toFixed(2).replace(".", ",")}
  Subtotal: R$ ${itemTotal}\n`
  })

  message += `\n*Taxa de Entrega:* R$ ${taxadeentrega.toFixed(2).replace(".", ",")}`
  message += `\n*Total do Pedido:* R$ ${total.toFixed(2).replace(".", ",")}`

  const whatsappURL = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`
  window.open(whatsappURL, "_blank")
}