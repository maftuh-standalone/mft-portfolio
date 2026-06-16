const viewport = document.getElementById('viewport')
const slides = document.querySelectorAll('.slide-item')
const dotsContainer = document.getElementById('dotsContainer')
let currentIndex = 0
let autoSlideInterval

// 1. Inisialisasi Dot Pagination
slides.forEach((_, i) => {
  const dot = document.createElement('div')
  dot.className = i === 0 ? 'dot active' : 'dot'
  dotsContainer.appendChild(dot)
})
const dots = document.querySelectorAll('.dot')

// 2. Fungsi Utama Slider
function updateSlider() {
  slides.forEach((slide, i) => {
    slide.classList.remove('active', 'prev', 'next')
    if (i === currentIndex) {
      slide.classList.add('active')
    } else if (i === (currentIndex - 1 + slides.length) % slides.length) {
      slide.classList.add('prev')
    } else if (i === (currentIndex + 1) % slides.length) {
      slide.classList.add('next')
    }
  })
  dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex))
}

const next = () => {
  currentIndex = (currentIndex + 1) % slides.length
  updateSlider()
}
const prev = () => {
  currentIndex = (currentIndex - 1 + slides.length) % slides.length
  updateSlider()
}

// 3. Sistem Auto-Slide (Mesin Utama)
function startAutoSlide() {
  clearInterval(autoSlideInterval)
  autoSlideInterval = setInterval(next, 5000) // Jeda 5 detik
}

function stopAutoSlide() {
  clearInterval(autoSlideInterval)
}

// 4. Manual Interactivity (Drag & Touch)
let startX = 0
let isDragging = false
let isPointerDown = false

viewport.addEventListener('pointerdown', (e) => {
  isPointerDown = true
  startX = e.clientX
  isDragging = false
  stopAutoSlide()
})

viewport.addEventListener('pointermove', (e) => {
  if (!isPointerDown) return
  if (Math.abs(e.clientX - startX) > 20) {
    isDragging = true
  }
})

viewport.addEventListener('pointerup', (e) => {
  if (!isPointerDown) return
  isPointerDown = false
  const diff = startX - e.clientX
  if (Math.abs(diff) > 60) {
    diff > 0 ? next() : prev()
  }
  startAutoSlide()
})

// Mencegah browser melakukan drag link secara native yang mengganggu script slider
viewport.addEventListener('dragstart', (e) => e.preventDefault())

// Mencegah link terbuka saat sedang melakukan swipe
viewport.addEventListener(
  'click',
  (e) => {
    if (isDragging) e.preventDefault()
  },
  true
)

// Memastikan auto-slide jalan lagi jika kursor keluar/batal
viewport.addEventListener('pointerleave', startAutoSlide)
viewport.addEventListener('pointercancel', startAutoSlide)

// 5. Support Mouse Wheel & Lifecycle
viewport.addEventListener(
  'wheel',
  (e) => {
    stopAutoSlide()
    e.deltaX > 0 || e.deltaY > 0 ? next() : prev()
    startAutoSlide()
  },
  { passive: false }
)

document.addEventListener('visibilitychange', () => {
  document.hidden ? stopAutoSlide() : startAutoSlide()
})

// Jalankan Saat Start
updateSlider()
startAutoSlide()
