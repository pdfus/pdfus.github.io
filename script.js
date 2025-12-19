// Load external HTML files
async function loadHTML(elementId, filePath) {
  try {
    const response = await fetch(filePath)
    const html = await response.text()
    document.getElementById(elementId).innerHTML = html

    // Initialize components after loading
    if (elementId === "header-container") {
      initializeHeader()
    }
    if (elementId === "sidebar-container") {
      initializeSidebar()
    }
  } catch (error) {
    console.error(`Error loading ${filePath}:`, error)
  }
}

// Initialize all components
async function initializeApp() {
  await Promise.all([
    loadHTML("header-container", "header.html"),
    loadHTML("sidebar-container", "sidebar.html"),
    loadHTML("tools-container", "allpdftools.html"),
    loadHTML("footer-container", "footer.html"),
  ])

  // Add scroll animations
  observeElements()
}

// Header functionality
function initializeHeader() {
  const menuToggle = document.getElementById("menuToggle")
  const nav = document.querySelector(".nav")
  const sidebar = document.getElementById("sidebar")

  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      if (window.innerWidth <= 768) {
        nav.classList.toggle("active")
      } else {
        sidebar.classList.toggle("active")
      }
    })
  }

  // Close mobile menu when clicking a link
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 768) {
        nav.classList.remove("active")
      }
    })
  })
}

// Sidebar functionality
function initializeSidebar() {
  const sidebarClose = document.getElementById("sidebarClose")
  const sidebar = document.getElementById("sidebar")

  if (sidebarClose) {
    sidebarClose.addEventListener("click", () => {
      sidebar.classList.remove("active")
    })
  }

  // Close sidebar when clicking a link on mobile
  document.querySelectorAll(".sidebar-link").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 1024) {
        sidebar.classList.remove("active")
      }
    })
  })
}

// Intersection Observer for scroll animations
function observeElements() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0)"
      }
    })
  }, observerOptions)

  // Observe all tool cards
  setTimeout(() => {
    document.querySelectorAll(".tool-card, .feature-card").forEach((card) => {
      observer.observe(card)
    })
  }, 500)
}

// Smooth scroll with offset for fixed header
document.addEventListener("click", (e) => {
  if (e.target.matches('a[href^="#"]')) {
    e.preventDefault()
    const targetId = e.target.getAttribute("href")
    const targetElement = document.querySelector(targetId)

    if (targetElement) {
      const headerHeight = document.querySelector(".header").offsetHeight
      const targetPosition = targetElement.offsetTop - headerHeight - 20

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      })
    }
  }
})

// Add parallax effect to hero section
window.addEventListener("scroll", () => {
  const hero = document.querySelector(".hero")
  if (hero) {
    const scrolled = window.pageYOffset
    hero.style.transform = `translateY(${scrolled * 0.3}px)`
    hero.style.opacity = 1 - scrolled * 0.002
  }
})

// Add hover effect to tool cards
document.addEventListener("mouseover", (e) => {
  if (e.target.closest(".tool-card")) {
    const card = e.target.closest(".tool-card")
    const icon = card.querySelector(".tool-icon")
    if (icon) {
      icon.style.transform = "scale(1.2) rotate(10deg)"
    }
  }
})

document.addEventListener("mouseout", (e) => {
  if (e.target.closest(".tool-card")) {
    const card = e.target.closest(".tool-card")
    const icon = card.querySelector(".tool-icon")
    if (icon) {
      icon.style.transform = "scale(1) rotate(0deg)"
    }
  }
})

// Dynamic color splash effect
function createColorSplash(x, y) {
  const colors = [
    "var(--color-blue)",
    "var(--color-green)",
    "var(--color-red)",
    "var(--color-purple)",
    "var(--color-pink)",
    "var(--color-yellow)",
  ]
  const splash = document.createElement("div")
  splash.style.position = "fixed"
  splash.style.left = x + "px"
  splash.style.top = y + "px"
  splash.style.width = "10px"
  splash.style.height = "10px"
  splash.style.borderRadius = "50%"
  splash.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
  splash.style.pointerEvents = "none"
  splash.style.animation = "splashFade 1s ease-out forwards"
  splash.style.zIndex = "9999"

  document.body.appendChild(splash)

  setTimeout(() => {
    splash.remove()
  }, 1000)
}

// Add splash animation CSS
const style = document.createElement("style")
style.textContent = `
    @keyframes splashFade {
        0% {
            transform: scale(0) translate(0, 0);
            opacity: 1;
        }
        100% {
            transform: scale(10) translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px);
            opacity: 0;
        }
    }
`
document.head.appendChild(style)

// Add click splash effect
document.addEventListener("click", (e) => {
  if (e.target.closest(".tool-button, .btn-primary, .btn-secondary")) {
    createColorSplash(e.clientX, e.clientY)
  }
})

// Console welcome message
console.log("%c🎨 Welcome to PDFUS! 🎨", "font-size: 24px; font-weight: bold; color: #FF6B6B;")
console.log("%cBuilt with ❤️ using Brutalist Design", "font-size: 14px; color: #4A90E2;")

// Initialize the app
document.addEventListener("DOMContentLoaded", initializeApp)

// Performance optimization: Lazy load images
if ("loading" in HTMLImageElement.prototype) {
  const images = document.querySelectorAll('img[loading="lazy"]')
  images.forEach((img) => {
    img.src = img.dataset.src
  })
} else {
  // Fallback for browsers that don't support lazy loading
  const script = document.createElement("script")
  script.src = "https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js"
  document.body.appendChild(script)
}
