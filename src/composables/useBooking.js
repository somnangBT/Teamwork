import { ref, computed, watch } from 'vue'

const STORAGE_KEY = 'salon_customer_bookings'

// Global shared state across components
const isBookingModalOpen = ref(false)
const isMyAppointmentsOpen = ref(false)
const selectedService = ref(null)
const activeStep = ref(1)
const activeBookingReceipt = ref(null)

// Persisted Bookings List
const bookings = ref([])

// Load initial bookings from localStorage
const loadBookings = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      bookings.value = JSON.parse(saved)
    } else {
      // Default initial booking for realistic preview
      bookings.value = [
        {
          id: 'BK-122795',
          serviceId: 1,
          serviceTitle: 'Full Pet Grooming & Styling',
          servicePrice: 65,
          serviceDuration: '45 mins',
          specialistName: 'Elena Rostova',
          specialistRole: 'Master Dog Groomer & Breed Stylist',
          specialistAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
          date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
          time: '09:00 AM',
          customerName: 'Alisa Gitten',
          petName: 'Bella',
          petBreed: 'Golden Retriever',
          customerEmail: 'alisa.gitten2910@gmail.com',
          customerPhone: '+4 079 355 05 86',
          notes: 'Bella has a sensitive stomach, gentle organic shampoo please.',
          status: 'Confirmed',
          createdAt: new Date().toISOString()
        },
        {
          id: 'BK-747770',
          serviceId: 2,
          serviceTitle: 'Spa Hydro-Bath & Deshedding',
          servicePrice: 45,
          serviceDuration: '40 mins',
          specialistName: 'Marcus Vance',
          specialistRole: 'Cat Grooming & Sensitive Care Specialist',
          specialistAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
          date: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
          time: '02:00 PM',
          customerName: 'Marcus Sterling',
          petName: 'Milo',
          petBreed: 'British Shorthair',
          customerEmail: 'm.sterling@outlook.com',
          customerPhone: '+4 079 482 11 02',
          notes: 'Full deshedding coat blowout.',
          status: 'In Progress',
          createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
        },
        {
          id: 'BK-893112',
          serviceId: 5,
          serviceTitle: 'VIP Royal Spa & Pampering Package',
          servicePrice: 95,
          serviceDuration: '75 mins',
          specialistName: 'Sophia Laurent',
          specialistRole: 'Pet Hydro-Spa & Aromatherapist',
          specialistAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
          date: new Date(Date.now() - 86400000 * 1).toISOString().split('T')[0],
          time: '11:00 AM',
          customerName: 'Clara Oswald',
          petName: 'Daisy',
          petBreed: 'Poodle',
          customerEmail: 'clara.oswald@gmail.com',
          customerPhone: '+4 078 911 34 22',
          notes: 'Blueberry facial and extra bandana.',
          status: 'Done',
          createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
        },
        {
          id: 'BK-452109',
          serviceId: 3,
          serviceTitle: 'Nail Trimming & Paw Care',
          servicePrice: 25,
          serviceDuration: '20 mins',
          specialistName: 'Chloe Lin',
          specialistRole: 'Puppy Care & Gentle Groomer',
          specialistAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
          date: new Date(Date.now() + 86400000 * 1).toISOString().split('T')[0],
          time: '03:00 PM',
          customerName: 'David Chen',
          petName: 'Koko',
          petBreed: 'Pomeranian Puppy',
          customerEmail: 'david.chen@yahoo.com',
          customerPhone: '+4 077 123 44 88',
          notes: 'First time puppy grooming visit.',
          status: 'Confirmed',
          createdAt: new Date().toISOString()
        }
      ]
      saveBookings()
    }
  } catch (e) {
    console.error('Failed to load bookings:', e)
    bookings.value = []
  }
}

const saveBookings = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings.value))
  } catch (e) {
    console.error('Failed to save bookings:', e)
  }
}

// Watch for changes and persist
watch(bookings, () => {
  saveBookings()
}, { deep: true })

// Initialize once
loadBookings()

export function useBooking() {
  // Available Pet Grooming Specialists
  const specialists = ref([
    {
      id: 'any',
      name: 'First Available Specialist',
      role: 'Fastest Booking Availability',
      rating: 5.0,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      badge: 'FASTEST',
      experience: '5+ years'
    },
    {
      id: 'elena',
      name: 'Elena Rostova',
      role: 'Master Dog Groomer & Breed Stylist',
      rating: 4.98,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      badge: 'DIRECTOR',
      experience: '8 years',
      specialties: ['Breed Styling', 'Show Cuts', 'Full Deshedding']
    },
    {
      id: 'marcus',
      name: 'Marcus Vance',
      role: 'Cat Grooming & Feline Specialist',
      rating: 4.95,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      badge: 'FELINE PRO',
      experience: '6 years',
      specialties: ['Cat Styling', 'De-Matting', 'Gentle Handling']
    },
    {
      id: 'sophia',
      name: 'Sophia Laurent',
      role: 'Pet Hydro-Spa & Aromatherapist',
      rating: 4.92,
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      badge: 'SPA',
      experience: '4 years',
      specialties: ['Hydrotherapy', 'Aroma Spa', 'Skin Recovery']
    },
    {
      id: 'chloe',
      name: 'Chloe Lin',
      role: 'Puppy Care & Gentle Groomer',
      rating: 4.90,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      badge: 'PUPPY CARE',
      experience: '3 years',
      specialties: ['Puppy First Visits', 'Nail Smooth Grind', 'Gentle Wash']
    }
  ])

  // Available Time Slots
  const timeSlots = {
    morning: ['09:00 AM', '10:00 AM', '11:00 AM', '11:30 AM'],
    afternoon: ['01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'],
    evening: ['05:00 PM', '06:00 PM', '07:00 PM']
  }

  const openBooking = (service = null) => {
    selectedService.value = service
    activeStep.value = service ? 2 : 1
    activeBookingReceipt.value = null
    isBookingModalOpen.value = true
  }

  const closeBooking = () => {
    isBookingModalOpen.value = false
    selectedService.value = null
    activeStep.value = 1
  }

  const openAppointments = () => {
    isMyAppointmentsOpen.value = true
  }

  const closeAppointments = () => {
    isMyAppointmentsOpen.value = false
  }

  const createBooking = (bookingData) => {
    const bookingId = 'BK-' + Math.floor(100000 + Math.random() * 900000)
    const newBooking = {
      id: bookingId,
      ...bookingData,
      status: bookingData.status || 'Confirmed',
      createdAt: new Date().toISOString()
    }

    bookings.value.unshift(newBooking)
    activeBookingReceipt.value = newBooking
    activeStep.value = 5
    saveBookings()
    return newBooking
  }

  const updateBookingStatus = (id, newStatus) => {
    const idx = bookings.value.findIndex(b => b.id === id)
    if (idx !== -1) {
      bookings.value[idx].status = newStatus
      saveBookings()
    }
  }

  const updateBookingDetails = (id, updatedFields) => {
    const idx = bookings.value.findIndex(b => b.id === id)
    if (idx !== -1) {
      bookings.value[idx] = {
        ...bookings.value[idx],
        ...updatedFields
      }
      saveBookings()
    }
  }

  const cancelBooking = (id) => {
    const idx = bookings.value.findIndex(b => b.id === id)
    if (idx !== -1) {
      bookings.value[idx].status = 'Cancelled'
      saveBookings()
    }
  }

  const deleteBookingPermanent = (id) => {
    const idx = bookings.value.findIndex(b => b.id === id)
    if (idx !== -1) {
      bookings.value.splice(idx, 1)
      saveBookings()
    }
  }

  const activeBookingsCount = computed(() => {
    return bookings.value.filter(b => {
      const s = (b.status || '').toLowerCase()
      return s === 'confirmed' || s === 'in progress'
    }).length
  })

  return {
    isBookingModalOpen,
    isMyAppointmentsOpen,
    selectedService,
    activeStep,
    activeBookingReceipt,
    bookings,
    specialists,
    timeSlots,
    openBooking,
    closeBooking,
    openAppointments,
    closeAppointments,
    createBooking,
    updateBookingStatus,
    updateBookingDetails,
    cancelBooking,
    deleteBookingPermanent,
    activeBookingsCount
  }
}
