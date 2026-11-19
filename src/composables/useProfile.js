import { ref, computed, watch } from 'vue'

const KEYS = {
  account: 'tiki_profile_account',
  pets: 'tiki_beauty_profiles_v2',
  addresses: 'tiki_profile_addresses',
  billing: 'tiki_profile_billing',
  vouchers: 'tiki_beauty_vouchers_v2',
  tickets: 'tiki_profile_tickets',
  favorites: 'tiki_favorite_products'
}

const defaultAccount = {
  name: 'Alisa Gitten',
  email: 'alisa.gitten2910@gmail.com',
  phone: '+4 079 355 05 86',
  tier: 'VIP',
  avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
}

const defaultPets = [
  {
    id: 1,
    name: 'Everyday Glow & Waves',
    breed: 'Wavy • Medium Hair',
    type: 'Hair & Skin',
    age: 'Combination Skin',
    gender: 'Warm Neutral',
    weight: 'Long Length',
    size: 'Hydration Focus',
    diet: 'Sulfate-Free Botanical',
    specialNeeds: 'Heat protection & soft shine',
    photo: '/images/hero_model.jpg'
  }
]

const defaultAddresses = [
  {
    id: 'ADDR-1',
    label: 'Home',
    recipient: 'Alisa Gitten',
    phone: '+4 079 355 05 86',
    street: '42 Orchid Blossom Ave, Suite 4B',
    city: 'Phnom Penh',
    postalCode: '120101',
    notes: 'Gate code 4021, call on arrival',
    isDefault: true
  },
  {
    id: 'ADDR-2',
    label: 'Studio Office',
    recipient: 'Alisa Gitten',
    phone: '+4 079 355 05 86',
    street: '88 Norodom Blvd, Floor 5',
    city: 'Phnom Penh',
    postalCode: '120207',
    notes: 'Leave with reception desk',
    isDefault: false
  }
]

const defaultBilling = [
  {
    id: 'PAY-1',
    brand: 'Visa',
    last4: '4242',
    holder: 'ALISA GITTEN',
    expiry: '09/28',
    isDefault: true
  },
  {
    id: 'PAY-2',
    brand: 'ABA PayWay',
    last4: '8819',
    holder: 'Alisa Gitten',
    expiry: 'Linked',
    isDefault: false
  }
]

const defaultVouchers = [
  {
    id: 'VCH-1',
    code: 'TIKI10',
    title: '$10 Off Beauty Store',
    description: 'Valid on all botanical haircare, serums, moisturizers, and salon styling tools.',
    discountAmount: 10,
    minSpend: 30,
    expiresAt: '2026-12-31',
    status: 'Active'
  },
  {
    id: 'VCH-2',
    code: 'GLOW15',
    title: '$15 Spa & Store Treat',
    description: 'Enjoy $15 off orders over $60 or VIP Bridal & Royal Spa packages.',
    discountAmount: 15,
    minSpend: 60,
    expiresAt: '2026-12-31',
    status: 'Active'
  }
]

function loadJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(fallback))
  } catch {
    return JSON.parse(JSON.stringify(fallback))
  }
}

function saveJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Ignore storage errors
  }
}

const account = ref(loadJson(KEYS.account, defaultAccount))
const pets = ref(loadJson(KEYS.pets, defaultPets))
const addresses = ref(loadJson(KEYS.addresses, defaultAddresses))
const billingMethods = ref(loadJson(KEYS.billing, defaultBilling))
const vouchers = ref(loadJson(KEYS.vouchers, defaultVouchers))
const supportTickets = ref(loadJson(KEYS.tickets, []))
const favoriteProductIds = ref(loadJson(KEYS.favorites, []))

watch(account, (val) => saveJson(KEYS.account, val), { deep: true })
watch(pets, (val) => saveJson(KEYS.pets, val), { deep: true })
watch(addresses, (val) => saveJson(KEYS.addresses, val), { deep: true })
watch(billingMethods, (val) => saveJson(KEYS.billing, val), { deep: true })
watch(vouchers, (val) => saveJson(KEYS.vouchers, val), { deep: true })
watch(supportTickets, (val) => saveJson(KEYS.tickets, val), { deep: true })
watch(favoriteProductIds, (val) => saveJson(KEYS.favorites, val), { deep: true })

export function useProfile() {
  const defaultAddress = computed(() => addresses.value.find(a => a.isDefault) || addresses.value[0] || null)
  const defaultBilling = computed(() => billingMethods.value.find(b => b.isDefault) || billingMethods.value[0] || null)

  const updateAccount = (fields) => {
    account.value = { ...account.value, ...fields }
  }

  const addPet = (petData) => {
    const newPet = { ...petData, id: Date.now() }
    pets.value.push(newPet)
    return newPet
  }

  const updatePet = (id, petData) => {
    const idx = pets.value.findIndex(p => p.id === id)
    if (idx !== -1) {
      pets.value[idx] = { ...pets.value[idx], ...petData, id }
    }
  }

  const deletePet = (id) => {
    const idx = pets.value.findIndex(p => p.id === id)
    if (idx !== -1) {
      pets.value.splice(idx, 1)
    }
  }

  const addAddress = (addrData) => {
    const newAddr = {
      id: 'ADDR-' + Date.now(),
      isDefault: addresses.value.length === 0,
      ...addrData
    }
    if (newAddr.isDefault) {
      addresses.value.forEach(a => (a.isDefault = false))
    }
    addresses.value.unshift(newAddr)
    return newAddr
  }

  const updateAddress = (id, addrData) => {
    const idx = addresses.value.findIndex(a => a.id === id)
    if (idx !== -1) {
      if (addrData.isDefault) {
        addresses.value.forEach(a => (a.isDefault = false))
      }
      addresses.value[idx] = { ...addresses.value[idx], ...addrData, id }
    }
  }

  const deleteAddress = (id) => {
    const idx = addresses.value.findIndex(a => a.id === id)
    if (idx !== -1) {
      const wasDefault = addresses.value[idx].isDefault
      addresses.value.splice(idx, 1)
      if (wasDefault && addresses.value.length > 0) {
        addresses.value[0].isDefault = true
      }
    }
  }

  const setDefaultAddress = (id) => {
    addresses.value.forEach(a => {
      a.isDefault = a.id === id
    })
  }

  const addBillingMethod = (methodData) => {
    const newMethod = {
      id: 'PAY-' + Date.now(),
      isDefault: billingMethods.value.length === 0,
      ...methodData
    }
    if (newMethod.isDefault) {
      billingMethods.value.forEach(b => (b.isDefault = false))
    }
    billingMethods.value.unshift(newMethod)
    return newMethod
  }

  const deleteBillingMethod = (id) => {
    const idx = billingMethods.value.findIndex(b => b.id === id)
    if (idx !== -1) {
      const wasDefault = billingMethods.value[idx].isDefault
      billingMethods.value.splice(idx, 1)
      if (wasDefault && billingMethods.value.length > 0) {
        billingMethods.value[0].isDefault = true
      }
    }
  }

  const setDefaultBillingMethod = (id) => {
    billingMethods.value.forEach(b => {
      b.isDefault = b.id === id
    })
  }

  const claimVoucher = (rawCode) => {
    const code = String(rawCode || '').trim().toUpperCase()
    if (!code) return { success: false, message: 'Please enter a voucher code.' }
    if (vouchers.value.some(v => v.code === code)) {
      return { success: false, message: `Voucher "${code}" is already in your wallet.` }
    }

    const catalog = {
      TIKIWELCOME: { title: '$15 Welcome Beauty Voucher', description: 'Complimentary $15 welcome credit for your first salon visit or beauty order.', discountAmount: 15, minSpend: 40 },
      TIKI10: { title: '$10 Off Beauty Store', description: 'Valid on all botanical haircare, serums, moisturizers, and salon styling tools.', discountAmount: 10, minSpend: 30 },
      GLOW15: { title: '$15 Spa & Store Treat', description: 'Enjoy $15 off orders over $60 or VIP Bridal & Royal Spa packages.', discountAmount: 15, minSpend: 60 },
      GLOW20: { title: '$20 VIP Glow Credit', description: 'Special seasonal beauty reward for VIP salon members.', discountAmount: 20, minSpend: 80 }
    }

    const template = catalog[code]
    if (!template) {
      return { success: false, message: 'Invalid voucher code. Try TIKIWELCOME or GLOW20.' }
    }

    const newVoucher = {
      id: 'VCH-' + Date.now(),
      code,
      ...template,
      expiresAt: '2026-12-31',
      status: 'Active'
    }
    vouchers.value.unshift(newVoucher)
    return { success: true, message: `Voucher "${code}" added!`, voucher: newVoucher }
  }

  const addSupportTicket = (ticketData) => {
    const newTicket = {
      id: 'TKT-' + Math.floor(1000 + Math.random() * 9000),
      status: 'Open',
      createdAt: new Date().toISOString(),
      ...ticketData
    }
    supportTickets.value.unshift(newTicket)
    return newTicket
  }

  const isProductFavorite = (productId) => {
    return favoriteProductIds.value.includes(productId)
  }

  const toggleFavoriteProduct = (productId) => {
    const idx = favoriteProductIds.value.indexOf(productId)
    if (idx !== -1) {
      favoriteProductIds.value.splice(idx, 1)
      return false
    } else {
      favoriteProductIds.value.push(productId)
      return true
    }
  }

  return {
    account,
    pets,
    addresses,
    billingMethods,
    vouchers,
    supportTickets,
    favoriteProductIds,
    defaultAddress,
    defaultBilling,
    updateAccount,
    addPet,
    updatePet,
    deletePet,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    addBillingMethod,
    deleteBillingMethod,
    setDefaultBillingMethod,
    claimVoucher,
    addSupportTicket,
    isProductFavorite,
    toggleFavoriteProduct
  }
}
