import { ref, computed, watch } from 'vue'

const STORAGE_KEY = 'tiki_beauty_cart_v2'

const initialItems = [
  {
    id: 1,
    title: 'Aura Botanical Nourishing Shampoo (500ml)',
    variant: '500ml • Hair Care',
    price: 28.00,
    originalPrice: 34.00,
    quantity: 1,
    isFavorite: false,
    image: '/images/shampoo.jpg'
  },
  {
    id: 2,
    title: 'Aurélia Luxury Argan Hair Oil (100ml)',
    variant: '100ml • Serums & Oils',
    price: 36.00,
    originalPrice: 42.00,
    quantity: 1,
    isFavorite: false,
    image: '/images/argan_oil.jpg'
  }
]

const cartItems = ref([])
const promoCode = ref('')
const promoDiscount = ref(0)
const isPromoApplied = ref(false)

const loadCart = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      cartItems.value = JSON.parse(saved)
    } else {
      cartItems.value = [...initialItems]
      saveCart()
    }
  } catch (e) {
    console.error(e)
    cartItems.value = [...initialItems]
  }
}

const saveCart = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems.value))
  } catch (e) {
    console.error(e)
  }
}

watch(cartItems, () => {
  saveCart()
}, { deep: true })

loadCart()

export function useCart() {
  const totalQuantity = computed(() => {
    return cartItems.value.reduce((sum, item) => sum + item.quantity, 0)
  })

  const productsCost = computed(() => {
    return cartItems.value.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0)
  })

  const freeDeliveryThreshold = 100.0
  const deliveryCost = computed(() => {
    if (productsCost.value >= freeDeliveryThreshold || cartItems.value.length === 0) return 0.0
    return 3.99
  })

  const awayFromFreeDelivery = computed(() => {
    const diff = freeDeliveryThreshold - productsCost.value
    return diff > 0 ? Number(diff.toFixed(2)) : 0
  })

  const freeDeliveryProgress = computed(() => {
    if (productsCost.value >= freeDeliveryThreshold) return 100
    return Math.min(100, Math.round((productsCost.value / freeDeliveryThreshold) * 100))
  })

  const totalCost = computed(() => {
    const discounted = Math.max(0, productsCost.value - promoDiscount.value)
    return discounted + deliveryCost.value
  })

  const addToCart = (product, qty = 1) => {
    if (!product) return
    const unitPrice =
      typeof product.rawPrice === 'number'
        ? product.rawPrice
        : parseFloat(String(product.price || 0).replace(/[^0-9.]/g, '')) || 0

    const existing = cartItems.value.find(i => i.id === product.id)
    if (existing) {
      existing.quantity += qty
    } else {
      cartItems.value.unshift({
        id: product.id,
        title: product.name || product.title,
        variant: product.category || product.variant || 'Salon Care',
        price: unitPrice,
        originalPrice: Number((unitPrice * 1.15).toFixed(2)),
        quantity: qty,
        isFavorite: false,
        image: product.image
      })
    }
    saveCart()
  }

  const increaseQuantity = (id) => {
    const item = cartItems.value.find(i => i.id === id)
    if (item) item.quantity++
  }

  const decreaseQuantity = (id) => {
    const item = cartItems.value.find(i => i.id === id)
    if (item) {
      if (item.quantity > 1) {
        item.quantity--
      } else {
        removeItem(id)
      }
    }
  }

  const removeItem = (id) => {
    const idx = cartItems.value.findIndex(i => i.id === id)
    if (idx !== -1) {
      cartItems.value.splice(idx, 1)
    }
  }

  const clearCart = () => {
    cartItems.value = []
    removePromo()
    saveCart()
  }

  const toggleFavorite = (id) => {
    const item = cartItems.value.find(i => i.id === id)
    if (item) item.isFavorite = !item.isFavorite
  }

  const applyPromo = (code) => {
    const clean = String(code || '').trim().toUpperCase()
    const promos = {
      TIKI10: { discount: 10.0, message: '$10.00 promo discount applied!' },
      GLOW15: { discount: 15.0, message: '$15.00 spa treat discount applied!' },
      TIKIWELCOME: { discount: 15.0, message: '$15.00 welcome beauty credit applied!' },
      GLOW20: { discount: 20.0, message: '$20.00 VIP beauty reward applied!' }
    }
    if (promos[clean]) {
      promoDiscount.value = promos[clean].discount
      isPromoApplied.value = true
      promoCode.value = clean
      return { success: true, message: promos[clean].message }
    }
    return { success: false, message: 'Invalid promo code. Try TIKI10 or GLOW15.' }
  }

  const removePromo = () => {
    promoDiscount.value = 0
    isPromoApplied.value = false
    promoCode.value = ''
  }

  return {
    cartItems,
    totalQuantity,
    productsCost,
    deliveryCost,
    awayFromFreeDelivery,
    freeDeliveryProgress,
    totalCost,
    promoCode,
    promoDiscount,
    isPromoApplied,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    clearCart,
    toggleFavorite,
    applyPromo,
    removePromo
  }
}
