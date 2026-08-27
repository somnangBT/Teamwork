import { ref, computed, watch } from 'vue'
import { useBooking } from './useBooking'
import { useProducts } from './useProducts'
import { useServices } from './useServices'

const ORDERS_KEY = 'tiki_salon_admin_orders'
const CUSTOMERS_KEY = 'tiki_salon_admin_customers'
const STAFF_KEY = 'tiki_salon_admin_staff'

const initialOrders = [
  {
    id: 'ORD-89210',
    orderNumber: '#TK-89210',
    customerName: 'Alisa Gitten',
    customerEmail: 'alisa.gitten2910@gmail.com',
    customerPhone: '+4 079 355 05 86',
    petName: 'Bella (Golden Retriever)',
    items: [
      { name: 'Royal Canin Medium Adult Dry Food (12kg)', quantity: 1, price: 54.99 },
      { name: 'Natural Shea Butter Paw & Nose Balm (60g)', quantity: 2, price: 12.00 }
    ],
    subtotal: 78.99,
    discount: 10.00,
    shippingFee: 0.00,
    total: 68.99,
    status: 'Delivered',
    paymentStatus: 'Paid',
    paymentMethod: 'Apple Pay',
    address: '42 Orchid Blossom Ave, Suite 4B, Phnom Penh',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'ORD-89211',
    orderNumber: '#TK-89211',
    customerName: 'Marcus Sterling',
    customerEmail: 'm.sterling@outlook.com',
    customerPhone: '+4 079 482 11 02',
    petName: 'Milo (British Shorthair)',
    items: [
      { name: 'Purina Pro Plan Adult Wet Food (12 x 400g)', quantity: 2, price: 18.49 },
      { name: 'Trixie Rubber Dumbbell Chew Toy (Medium)', quantity: 1, price: 7.99 }
    ],
    subtotal: 44.97,
    discount: 0.00,
    shippingFee: 2.99,
    total: 47.96,
    status: 'Shipped',
    paymentStatus: 'Paid',
    paymentMethod: 'Credit Card (Visa)',
    address: '15 Riverside Blvd, Villa 9, Phnom Penh',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: 'ORD-89212',
    orderNumber: '#TK-89212',
    customerName: 'David Chen',
    customerEmail: 'david.chen@yahoo.com',
    customerPhone: '+4 077 123 44 88',
    petName: 'Koko (Pomeranian)',
    items: [
      { name: 'N&D Comfort Ergonomic Dog Harness (Size M)', quantity: 1, price: 24.90 },
      { name: 'Tiki Organic Oatmeal & Aloe Pet Shampoo (500ml)', quantity: 1, price: 16.50 }
    ],
    subtotal: 41.40,
    discount: 0.00,
    shippingFee: 2.99,
    total: 44.39,
    status: 'Processing',
    paymentStatus: 'Paid',
    paymentMethod: 'ABA PayWay',
    address: '88 Diamond Island Way, Phnom Penh',
    createdAt: new Date().toISOString()
  },
  {
    id: 'ORD-89213',
    orderNumber: '#TK-89213',
    customerName: 'Elena Rostova',
    customerEmail: 'elena.rostova@sample.com',
    customerPhone: '+4 078 992 41 15',
    petName: 'Rex (German Shepherd)',
    items: [
      { name: 'Royal Canin Medium Adult Dry Food (12kg)', quantity: 2, price: 54.99 }
    ],
    subtotal: 109.98,
    discount: 15.00,
    shippingFee: 0.00,
    total: 94.98,
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
    petName: 'Bella',
    petType: 'Dog',
    petBreed: 'Golden Retriever',
    petAge: '3 years',
    loyaltyTier: 'VIP Gold',
    totalSpent: 485.50,
    totalVisits: 8,
    lastVisit: '2 days ago',
    specialNotes: 'Sensitive skin, loves organic lavender mist after grooming.'
  },
  {
    id: 'CUST-002',
    name: 'Marcus Sterling',
    email: 'm.sterling@outlook.com',
    phone: '+4 079 482 11 02',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    petName: 'Milo',
    petType: 'Cat',
    petBreed: 'British Shorthair',
    petAge: '2 years',
    loyaltyTier: 'Silver Member',
    totalSpent: 210.00,
    totalVisits: 4,
    lastVisit: 'Yesterday',
    specialNotes: 'Gentle deshedding, prefers low-noise blow dryer.'
  },
  {
    id: 'CUST-003',
    name: 'Clara Oswald',
    email: 'clara.oswald@gmail.com',
    phone: '+4 078 911 34 22',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    petName: 'Daisy',
    petType: 'Dog',
    petBreed: 'Poodle',
    petAge: '4 years',
    loyaltyTier: 'VIP Platinum',
    totalSpent: 720.00,
    totalVisits: 12,
    lastVisit: '3 days ago',
    specialNotes: 'Always requests Blueberry facial and scissor styling finish.'
  },
  {
    id: 'CUST-004',
    name: 'David Chen',
    email: 'david.chen@yahoo.com',
    phone: '+4 077 123 44 88',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    petName: 'Koko',
    petType: 'Dog',
    petBreed: 'Pomeranian Puppy',
    petAge: '5 months',
    loyaltyTier: 'New Member',
    totalSpent: 69.29,
    totalVisits: 1,
    lastVisit: 'Today',
    specialNotes: 'Puppy intro session. Needs gentle positive reinforcement treats.'
  }
]

const initialStaff = [
  {
    id: 'STF-01',
    name: 'Elena Rostova',
    role: 'Master Dog Groomer & Breed Stylist',
    email: 'elena@tikisalon.com',
    phone: '+4 079 100 20 01',
    rating: 4.98,
    reviewsCount: 142,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    status: 'On Duty',
    specialties: ['Breed Styling', 'Show Cuts', 'Full Deshedding'],
    activeAppointments: 3
  },
  {
    id: 'STF-02',
    name: 'Marcus Vance',
    role: 'Cat Grooming & Sensitive Care Specialist',
    email: 'marcus@tikisalon.com',
    phone: '+4 079 100 20 02',
    rating: 4.95,
    reviewsCount: 98,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    status: 'On Duty',
    specialties: ['Cat Styling', 'De-Matting', 'Gentle Handling'],
    activeAppointments: 2
  },
  {
    id: 'STF-03',
    name: 'Sophia Laurent',
    role: 'Pet Hydro-Spa & Aromatherapist',
    email: 'sophia@tikisalon.com',
    phone: '+4 079 100 20 03',
    rating: 4.92,
    reviewsCount: 76,
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    status: 'Break',
    specialties: ['Hydrotherapy', 'Aroma Spa', 'Skin Recovery'],
    activeAppointments: 1
  },
  {
    id: 'STF-04',
    name: 'Chloe Lin',
    role: 'Puppy Care & Gentle Groomer',
    email: 'chloe@tikisalon.com',
    phone: '+4 079 100 20 04',
    rating: 4.90,
    reviewsCount: 64,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    status: 'On Duty',
    specialties: ['Puppy First Visits', 'Nail Smooth Grind', 'Gentle Wash'],
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
    addStaffMember
  }
}
