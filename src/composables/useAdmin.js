import { ref, computed, watch } from 'vue'
import { useBooking } from './useBooking'
import { useProducts } from './useProducts'
import { useServices } from './useServices'

const ORDERS_KEY = 'tiki_beauty_admin_orders_v2'
const CUSTOMERS_KEY = 'tiki_beauty_admin_customers_v2'
const STAFF_KEY = 'tiki_beauty_admin_staff_v2'

const initialOrders = [
  {
    id: 'ORD-89210',
    orderNumber: '#TK-89210',
    customerName: 'Alisa Gitten',
    customerEmail: 'alisa.gitten2910@gmail.com',
    customerPhone: '+4 079 355 05 86',
    petName: 'Wavy Hair • Glass-Skin Routine',
    items: [
      { name: 'Aura Botanical Nourishing Shampoo (500ml)', quantity: 1, price: 28.00 },
      { name: 'Aurélia Luxury Argan Hair Oil (100ml)', quantity: 1, price: 36.00 }
    ],
    subtotal: 64.00,
    discount: 10.00,
    shippingFee: 0.00,
    total: 54.00,
    status: 'Delivered',
    paymentStatus: 'Paid',
    paymentMethod: 'Apple Pay',
    address: '42 Orchid Blossom Ave, Suite 4B, Phnom Penh',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'ORD-89211',
    orderNumber: '#TK-89211',
    customerName: 'Clara Oswald',
    customerEmail: 'clara.oswald@gmail.com',
    customerPhone: '+4 078 911 34 22',
    petName: 'Botanical Radiance Set',
    items: [
      { name: 'Botanical Radiancy Serum & Glow Moisturizer Set', quantity: 1, price: 64.00 },
      { name: 'Silk Velvet Matte Lip & Gloss Duo', quantity: 1, price: 29.50 }
    ],
    subtotal: 93.50,
    discount: 0.00,
    shippingFee: 2.99,
    total: 96.49,
    status: 'Shipped',
    paymentStatus: 'Paid',
    paymentMethod: 'Credit Card (Visa)',
    address: '15 Riverside Blvd, Villa 9, Phnom Penh',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: 'ORD-89212',
    orderNumber: '#TK-89212',
    customerName: 'Mina Kim',
    customerEmail: 'mina.kim@yahoo.com',
    customerPhone: '+4 077 123 44 88',
    petName: 'Keratin Care Bundle',
    items: [
      { name: 'Act+Acre Restorative Keratin Hair Mask (133ml)', quantity: 1, price: 38.00 },
      { name: 'Rosewater Hydrating Cleanser & Cream Duo', quantity: 1, price: 42.00 }
    ],
    subtotal: 80.00,
    discount: 0.00,
    shippingFee: 2.99,
    total: 82.99,
    status: 'Processing',
    paymentStatus: 'Paid',
    paymentMethod: 'ABA PayWay',
    address: '88 Diamond Island Way, Phnom Penh',
    createdAt: new Date().toISOString()
  },
  {
    id: 'ORD-89213',
    orderNumber: '#TK-89213',
    customerName: 'Nadia Sokha',
    customerEmail: 'nadia.sokha@gmail.com',
    customerPhone: '+4 078 992 41 15',
    petName: 'Salon Styling Pro Kit',
    items: [
      { name: 'Pro Salon Ceramic Styler & Paddle Brush Kit', quantity: 1, price: 72.00 },
      { name: 'Nécessaire Botanical Body & Neck Emulsion (200ml)', quantity: 1, price: 34.00 }
    ],
    subtotal: 106.00,
    discount: 15.00,
    shippingFee: 0.00,
    total: 91.00,
    status: 'Pending',
    paymentStatus: 'Pending',
    paymentMethod: 'Cash on Delivery',
    address: '77 Jasmine Garden St, Phnom Penh',
    createdAt: new Date().toISOString()
  }
]

const initialCustomers = [
  {
    id: 'CUST-001',
    name: 'Alisa Gitten',
    email: 'alisa.gitten2910@gmail.com',
    phone: '+4 079 355 05 86',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    petName: 'Everyday Glow & Waves',
    petType: 'Hair & Skin',
    petBreed: 'Wavy Medium Hair',
    petAge: 'Combination Skin',
    loyaltyTier: 'VIP Gold',
    totalSpent: 485.50,
    totalVisits: 8,
    lastVisit: '2 days ago',
    specialNotes: 'Prefers sulfate-free rosemary wash and warm caramel blowout.'
  },
  {
    id: 'CUST-002',
    name: 'Nadia Sokha',
    email: 'nadia.sokha@gmail.com',
    phone: '+4 079 482 11 02',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    petName: 'Glass-Skin & Silk Hair',
    petType: 'Facial & Spa',
    petBreed: 'Fine Straight Hair',
    petAge: 'Dry / Sensitive',
    loyaltyTier: 'Silver Member',
    totalSpent: 210.00,
    totalVisits: 4,
    lastVisit: 'Yesterday',
    specialNotes: 'Loves rosehip facial mist and gentle eucalyptus head spa.'
  },
  {
    id: 'CUST-003',
    name: 'Clara Oswald',
    email: 'clara.oswald@gmail.com',
    phone: '+4 078 911 34 22',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    petName: 'Radiant Balayage Care',
    petType: 'Color & Glow',
    petBreed: 'Curly Thick Hair',
    petAge: 'Normal Skin',
    loyaltyTier: 'VIP Platinum',
    totalSpent: 720.00,
    totalVisits: 12,
    lastVisit: '3 days ago',
    specialNotes: 'Always requests keratin bond mask and blush gel manicure.'
  },
  {
    id: 'CUST-004',
    name: 'Mina Kim',
    email: 'mina.kim@yahoo.com',
    phone: '+4 077 123 44 88',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    petName: 'Sheer Blush Nail & Lash',
    petType: 'Nails & Beauty',
    petBreed: 'Long Layered Hair',
    petAge: 'Combination',
    loyaltyTier: 'New Member',
    totalSpent: 98.50,
    totalVisits: 2,
    lastVisit: 'Today',
    specialNotes: 'Prefers sheer pink gel polish and lightweight argan oil serum.'
  }
]

const initialStaff = [
  {
    id: 'STF-01',
    name: 'Elena Rostova',
    role: 'Creative Hair & Blowout Director',
    email: 'elena@tikisalon.com',
    phone: '+4 079 100 20 01',
    rating: 4.98,
    reviewsCount: 142,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    status: 'On Duty',
    specialties: ['Precision Cuts', 'Silk Blowouts', 'Bridal Updos'],
    activeAppointments: 3
  },
  {
    id: 'STF-02',
    name: 'Marcus Vance',
    role: 'Balayage & Color Specialist',
    email: 'marcus@tikisalon.com',
    phone: '+4 079 100 20 02',
    rating: 4.95,
    reviewsCount: 98,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    status: 'On Duty',
    specialties: ['Balayage', 'Gloss Toning', 'Keratin Repair'],
    activeAppointments: 2
  },
  {
    id: 'STF-03',
    name: 'Sophia Laurent',
    role: 'Botanical Head Spa & Facialist',
    email: 'sophia@tikisalon.com',
    phone: '+4 079 100 20 03',
    rating: 4.92,
    reviewsCount: 76,
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    status: 'Break',
    specialties: ['Herbal Head Spa', 'Radiance Facials', 'Aromatherapy'],
    activeAppointments: 1
  },
  {
    id: 'STF-04',
    name: 'Chloe Lin',
    role: 'Nail Artistry & Lash Stylist',
    email: 'chloe@tikisalon.com',
    phone: '+4 079 100 20 04',
    rating: 4.90,
    reviewsCount: 64,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    status: 'On Duty',
    specialties: ['Gel Manicure', 'Nail Art', 'Cuticle Therapy'],
    activeAppointments: 2
  }
]

const orders = ref([])
const customers = ref([])
const staffList = ref([])

const loadAdminData = () => {
  try {
    const o = localStorage.getItem(ORDERS_KEY)
    orders.value = o ? JSON.parse(o) : [...initialOrders]

    const c = localStorage.getItem(CUSTOMERS_KEY)
    customers.value = c ? JSON.parse(c) : [...initialCustomers]

    const s = localStorage.getItem(STAFF_KEY)
    staffList.value = s ? JSON.parse(s) : [...initialStaff]
  } catch (e) {
    console.error('Failed to load admin data:', e)
    orders.value = [...initialOrders]
    customers.value = [...initialCustomers]
    staffList.value = [...initialStaff]
  }
}

const saveAdminData = () => {
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders.value))
    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers.value))
    localStorage.setItem(STAFF_KEY, JSON.stringify(staffList.value))
  } catch (e) {
    console.error('Failed to save admin data:', e)
  }
}

watch([orders, customers, staffList], () => {
  saveAdminData()
}, { deep: true })

loadAdminData()

export function useAdmin() {
  const { bookings } = useBooking()
  const { products } = useProducts()
  const { allServices } = useServices()

  // KPI Calculations
  const totalRevenue = computed(() => {
    const ordersRev = orders.value.filter(o => o.paymentStatus === 'Paid').reduce((sum, o) => sum + (Number(o.total) || 0), 0)
    const bookingsRev = bookings.value.filter(b => (b.status || '').toLowerCase() === 'done' || (b.status || '').toLowerCase() === 'confirmed').reduce((sum, b) => sum + (Number(b.servicePrice) || 0), 0)
    return ordersRev + bookingsRev
  })

  const lowStockCount = computed(() => {
    return products.value.filter(p => (Number(p.stock) || 0) < 10).length
  })

  const pendingOrdersCount = computed(() => {
    return orders.value.filter(o => o.status === 'Processing' || o.status === 'Pending').length
  })

  const todayBookingsCount = computed(() => {
    return bookings.value.length
  })

  // Order Actions
  const updateOrderStatus = (orderId, newStatus) => {
    const idx = orders.value.findIndex(o => o.id === orderId)
    if (idx !== -1) {
      orders.value[idx].status = newStatus
      if (newStatus === 'Delivered') {
        orders.value[idx].paymentStatus = 'Paid'
      }
      saveAdminData()
    }
  }

  const addOrder = (orderData) => {
    const newId = 'ORD-' + Math.floor(10000 + Math.random() * 90000)
    const newOrd = {
      id: newId,
      orderNumber: '#' + newId,
      status: 'Processing',
      paymentStatus: 'Paid',
      createdAt: new Date().toISOString(),
      ...orderData
    }
    orders.value.unshift(newOrd)
    saveAdminData()
    return newOrd
  }

  const deleteOrder = (orderId) => {
    const idx = orders.value.findIndex(o => o.id === orderId)
    if (idx !== -1) {
      orders.value.splice(idx, 1)
      saveAdminData()
    }
  }

  // Customer Actions
  const addCustomer = (customerData) => {
    const newId = 'CUST-' + (customers.value.length + 1).toString().padStart(3, '0')
    const newCust = {
      id: newId,
      totalSpent: 0,
      totalVisits: 1,
      lastVisit: 'Just joined',
      loyaltyTier: 'New Member',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      ...customerData
    }
    customers.value.unshift(newCust)
    saveAdminData()
    return newCust
  }

  const updateCustomer = (id, fields) => {
    const idx = customers.value.findIndex(c => c.id === id)
    if (idx !== -1) {
      customers.value[idx] = {
        ...customers.value[idx],
        ...fields
      }
      saveAdminData()
    }
  }

  const deleteCustomer = (id) => {
    const idx = customers.value.findIndex(c => c.id === id)
    if (idx !== -1) {
      customers.value.splice(idx, 1)
      saveAdminData()
    }
  }

  // Staff Actions
  const updateStaffStatus = (id, newStatus) => {
    const idx = staffList.value.findIndex(s => s.id === id)
    if (idx !== -1) {
      staffList.value[idx].status = newStatus
      saveAdminData()
    }
  }

  const addStaffMember = (staffData) => {
    const newId = 'STF-' + (staffList.value.length + 1).toString().padStart(2, '0')
    const newStaff = {
      id: newId,
      rating: 5.0,
      reviewsCount: 0,
      status: 'On Duty',
      activeAppointments: 0,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      ...staffData
    }
    staffList.value.push(newStaff)
    saveAdminData()
    return newStaff
  }

  const updateStaffMember = (id, fields) => {
    const idx = staffList.value.findIndex(s => s.id === id)
    if (idx !== -1) {
      staffList.value[idx] = {
        ...staffList.value[idx],
        ...fields
      }
      saveAdminData()
    }
  }

  const deleteStaffMember = (id) => {
    const idx = staffList.value.findIndex(s => s.id === id)
    if (idx !== -1) {
      staffList.value.splice(idx, 1)
      saveAdminData()
    }
  }

  return {
    orders,
    customers,
    staffList,
    totalRevenue,
    lowStockCount,
    pendingOrdersCount,
    todayBookingsCount,
    updateOrderStatus,
    addOrder,
    deleteOrder,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    updateStaffStatus,
    addStaffMember,
    updateStaffMember,
    deleteStaffMember
  }
}
