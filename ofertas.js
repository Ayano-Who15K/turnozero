// Variáveis globais
let currentSlideIndex = 0
const slides = document.querySelectorAll(".carousel-slide")
const dots = document.querySelectorAll(".dot")
const cart = JSON.parse(localStorage.getItem("cart")) || []

// Funcionalidade do Carousel
function showSlide(index) {
  // Esconder todos os slides
  slides.forEach((slide) => slide.classList.remove("active"))
  dots.forEach((dot) => dot.classList.remove("active"))

  // Mostrar slide atual
  if (slides[index]) {
    slides[index].classList.add("active")
    dots[index].classList.add("active")
  }
}

function changeSlide(direction) {
  currentSlideIndex += direction

  if (currentSlideIndex >= slides.length) {
    currentSlideIndex = 0
  } else if (currentSlideIndex < 0) {
    currentSlideIndex = slides.length - 1
  }

  showSlide(currentSlideIndex)
}

function currentSlide(index) {
  currentSlideIndex = index - 1
  showSlide(currentSlideIndex)
}

// Auto-avançar carousel
function startCarouselAutoplay() {
  setInterval(() => {
    changeSlide(1)
  }, 5000)
}

// Contador regressivo
function updateCountdown() {
  const now = new Date().getTime()
  const endTime = now + 12 * 60 * 60 * 1000 + 34 * 60 * 1000 + 56 * 1000

  const countdownInterval = setInterval(() => {
    const currentTime = new Date().getTime()
    const timeLeft = endTime - currentTime

    if (timeLeft < 0) {
      document.getElementById("hours").textContent = "00"
      document.getElementById("minutes").textContent = "00"
      document.getElementById("seconds").textContent = "00"
      clearInterval(countdownInterval)
      return
    }

    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)

    document.getElementById("hours").textContent = hours.toString().padStart(2, "0")
    document.getElementById("minutes").textContent = minutes.toString().padStart(2, "0")
    document.getElementById("seconds").textContent = seconds.toString().padStart(2, "0")
  }, 1000)
}

// Funcionalidade do carrinho
function updateCartCount() {
  const cartCount = document.querySelector(".cart-count")
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  cartCount.textContent = totalItems
}

function addToCart(button) {
  const card = button.closest(".deal-card, .product-card")
  const title = card.querySelector("h3").textContent
  const priceElement = card.querySelector(".new-price, .current-price")
  const price = Number.parseFloat(priceElement.textContent.replace("R$ ", "").replace(".", "").replace(",", "."))
  const image = card.querySelector("img").src

  const existingItem = cart.find((item) => item.title === title)

  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cart.push({
      title: title,
      price: price,
      image: image,
      quantity: 1,
    })
  }

  localStorage.setItem("cart", JSON.stringify(cart))
  updateCartCount()

  // Feedback visual
  const originalBg = button.style.background
  const originalText = button.innerHTML

  button.style.background = "#00a650"
  button.innerHTML = '<i class="fas fa-check"></i> Adicionado!'

  setTimeout(() => {
    button.style.background = originalBg
    button.innerHTML = originalText
  }, 2000)

  // Animação de sucesso
  button.style.transform = "scale(0.95)"
  setTimeout(() => {
    button.style.transform = "scale(1)"
  }, 150)
}

// Sistema de favoritos
function toggleFavorite(button) {
  const icon = button.querySelector("i")
  const card = button.closest(".product-card")
  const title = card.querySelector("h3").textContent
  let favorites = JSON.parse(localStorage.getItem("favorites")) || []

  if (icon.classList.contains("far")) {
    // Adicionar aos favoritos
    icon.classList.remove("far")
    icon.classList.add("fas")
    button.classList.add("active")

    if (!favorites.includes(title)) {
      favorites.push(title)
      localStorage.setItem("favorites", JSON.stringify(favorites))
    }

    // Animação de coração
    button.style.transform = "scale(1.3)"
    setTimeout(() => {
      button.style.transform = "scale(1)"
    }, 200)
  } else {
    // Remover dos favoritos
    icon.classList.remove("fas")
    icon.classList.add("far")
    button.classList.remove("active")

    favorites = favorites.filter((fav) => fav !== title)
    localStorage.setItem("favorites", JSON.stringify(favorites))
  }
}

// Funcionalidade de busca
function setupSearch() {
  const searchInput = document.querySelector(".search-bar input")
  const searchButton = document.querySelector(".search-bar button")

  function performSearch() {
    const query = searchInput.value.toLowerCase().trim()
    if (query) {
      // Simular busca
      showNotification(`Buscando por: "${query}"`)
      // Em uma aplicação real, redirecionaria para página de resultados
    }
  }

  searchButton.addEventListener("click", performSearch)
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      performSearch()
    }
  })

  // Sugestões de busca (simulado)
  searchInput.addEventListener("input", (e) => {
    const value = e.target.value.toLowerCase()
    if (value.length > 2) {
      // Aqui poderia mostrar sugestões
    }
  })
}

// Navegação por categorias
function navigateToCategory(category) {
  showNotification(`Navegando para categoria: ${category}`)
  // Em uma aplicação real, redirecionaria para página da categoria
}

// Sistema de notificações
function showNotification(message) {
  const notification = document.createElement("div")
  notification.className = "notification"
  notification.textContent = message
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #3483fa;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
    `

  document.body.appendChild(notification)

  setTimeout(() => {
    notification.style.animation = "slideOutRight 0.3s ease-out"
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 300)
  }, 3000)
}

// Animações de scroll
function setupScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.animation = "fadeInUp 0.6s ease-out forwards"
      }
    })
  }, observerOptions)

  // Observar todos os cards
  document.querySelectorAll(".deal-card, .product-card, .category-card").forEach((card) => {
    card.style.opacity = "0"
    card.style.transform = "translateY(30px)"
    observer.observe(card)
  })
}

// Carregar favoritos salvos
function loadFavorites() {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || []
  const favoriteButtons = document.querySelectorAll(".favorite-btn")

  favoriteButtons.forEach((button) => {
    const card = button.closest(".product-card")
    const title = card.querySelector("h3").textContent

    if (favorites.includes(title)) {
      const icon = button.querySelector("i")
      icon.classList.remove("far")
      icon.classList.add("fas")
      button.classList.add("active")
    }
  })
}

// Efeito ripple para botões
function addRippleEffect() {
  const buttons = document.querySelectorAll(".add-to-cart, .cta-btn")

  buttons.forEach((button) => {
    button.addEventListener("click", function (e) {
      const ripple = document.createElement("span")
      const rect = this.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height)
      const x = e.clientX - rect.left - size / 2
      const y = e.clientY - rect.top - size / 2

      ripple.style.width = ripple.style.height = size + "px"
      ripple.style.left = x + "px"
      ripple.style.top = y + "px"
      ripple.classList.add("ripple")

      this.appendChild(ripple)

      setTimeout(() => {
        ripple.remove()
      }, 600)
    })
  })
}

// Efeitos hover para cards de ofertas
function setupDealCardEffects() {
  const dealCards = document.querySelectorAll(".deal-card")

  dealCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      const progressFill = card.querySelector(".progress-fill")
      if (progressFill) {
        const currentWidth = Number.parseInt(progressFill.style.width)
        const newWidth = Math.min(currentWidth + 3, 100)
        progressFill.style.width = newWidth + "%"
      }
    })

    card.addEventListener("mouseleave", () => {
      const progressFill = card.querySelector(".progress-fill")
      if (progressFill) {
        // Restaurar largura original após um delay
        setTimeout(() => {
          const originalWidth = progressFill.style.width
          progressFill.style.width = originalWidth
        }, 300)
      }
    })
  })
}

// Adicionar CSS para animações de notificação
function addNotificationStyles() {
  const style = document.createElement("style")
  style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `
  document.head.appendChild(style)
}

// Inicializar tudo quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", () => {
  // Inicializar funcionalidades principais
  updateCountdown()
  updateCartCount()
  setupSearch()
  setupScrollAnimations()
  loadFavorites()
  addRippleEffect()
  setupDealCardEffects()
  addNotificationStyles()

  // Iniciar carousel automático
  startCarouselAutoplay()

  // Mostrar notificação de boas-vindas
  setTimeout(() => {
    showNotification("Bem-vindo às melhores ofertas!")
  }, 1000)
})

// Funcionalidades adicionais para melhor UX
window.addEventListener("scroll", () => {
  const header = document.querySelector(".header")
  if (window.scrollY > 100) {
    header.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.15)"
  } else {
    header.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.1)"
  }
})

// Prevenção de comportamento padrão em links de demonstração
document.addEventListener("click", (e) => {
  if (e.target.tagName === "A" && e.target.getAttribute("href") === "#") {
    e.preventDefault()
  }
})
