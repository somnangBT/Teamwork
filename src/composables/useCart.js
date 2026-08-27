import { ref, computed, watch } from 'vue'

const STORAGE_KEY = 'tiki_shopping_cart'

const initialItems = [
  {
    id: 1,
    title: 'Royal Canin Medium Adult Dry Food, 12 kg',
    variant: '12 kg',
    price: 54.99,
    originalPrice: 64.99,
    quantity: 1,
    isFavorite: false,
    image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 2,
    title: 'Purina Pro Plan Adult Wet Food, 12 x 400g',
    variant: '12 x 400g',
    price: 18.49,
    originalPrice: 21.99,
    quantity: 1,
    isFavorite: false,
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 3,
    title: 'Trixie Rubber Dumbbell Dog Toy, Medium',
    variant: 'Medium',
    price: 7.99,
    originalPrice: 9.99,
    quantity: 1,
    isFavorite: false,
    image: 'https://images.unsplash.com/photo-1535294435445-d7249524ef2e?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 4,
    title: 'N&D Comfort Dog Harness, Size M',
    variant: 'Size M',
    price: 24.90,
    originalPrice: 29.90,
    quantity: 1,
    isFavorite: false,
    image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&q=80&w=400'
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
    return cartItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  })

  const freeDeliveryThreshold = 120.0
  const deliveryCost = computed(() => {
    if (productsCost.value >= freeDeliveryThreshold || cartItems.value.length === 0) return 0.00
    return 2.99
  })

  const awayFromFreeDelivery = computed(() => {
    const diff = freeDeliveryThreshold - productsCost.value
    return diff > 0 ? Math.round(diff) : 0
  })

  const freeDeliveryProgress = computed(() => {
    if (productsCost.value >= freeDeliveryThreshold) return 100
    return Math.min(100, Math.round((productsCost.value / freeDeliveryThreshold) * 100))
  })

  const totalCost = computed(() => {
    const discounted = Math.max(0, productsCost.value - promoDiscount.value)
    return discounted + deliveryCost.value
  })

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

  const toggleFavorite = (id) => {
    const item = cartItems.value.find(i => i.id === id)
    if (item) item.isFavorite = !item.isFavorite
  }

  const applyPromo = (code) => {
    if (code.trim().toUpperCase() === 'TIKI10') {
      promoDiscount.value = 10.0
      isPromoApplied.value = true
      promoCode.value = 'TIKI10'
      return { success: true, message: '10,00 € promo applied!' }
    } else if (code.trim().toUpperCase() === 'GLOW15') {
      promoDiscount.value = 15.0
      isPromoApplied.value = true
      promoCode.value = 'GLOW15'
      return { success: true, message: '15,00 € discount applied!' }
    }
    return { success: false, message: 'Invalid promo code' }
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
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    toggleFavorite,
    applyPromo,
    removePromo
  }
}
