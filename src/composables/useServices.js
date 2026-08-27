import { ref, computed, watch } from 'vue'

const STORAGE_KEY = 'tiki_salon_services'

const initialServices = [
  {
    id: 1,
    title: 'Full Pet Grooming & Styling',
    category: 'Full Grooming',
    price: 65,
    duration: '45 mins',
    description: 'Breed-specific haircut styling, warm organic bath, ear cleaning, sanitary trim, and paw pad balm finish.',
    icon: '✂️',
    badge: 'POPULAR',
    highlights: ['Breed-Specific Cut', 'Organic Herbal Bath', 'Paw Pad Therapy'],
    image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=600',
    status: 'Active'
  },
  {
    id: 2,
    title: 'Spa Hydro-Bath & Deshedding',
    category: 'Baths & Spa',
    price: 45,
    duration: '40 mins',
    description: 'Deep cleansing warm hydro-massage bath, undercoat blow-out deshedding, and botanical coat conditioner.',
    icon: '🛁',
    badge: 'TRENDING',
    highlights: ['Hydro-Massage Bath', 'Undercoat Blowout', 'Silk Coat Shine'],
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=600',
    status: 'Active'
  },
  {
    id: 3,
    title: 'Nail Trimming & Paw Care',
    category: 'Paw & Nails',
    price: 25,
    duration: '20 mins',
    description: 'Gentle nail clip and electronic smooth grinding, hair between pads trimmed, and soothing organic paw wax.',
    icon: '🐾',
    badge: 'ESSENTIAL',
    highlights: ['Precision Clip & Grind', 'Pad Hair Trim', 'Organic Paw Wax'],
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=600',
    status: 'Active'
  },
  {
    id: 4,
    title: 'Pet Dental Care & Breath Freshener',
    category: 'Dental Care',
    price: 35,
    duration: '30 mins',
    description: 'Gentle ultrasonic enzymatic brushing, tartar plaque reduction, and fresh mint oral spray.',
    icon: '🦷',
    badge: 'SIGNATURE',
    highlights: ['Enzymatic Tooth Polish', 'Tartar Defense', 'Fresh Mint Spray'],
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80&w=600',
    status: 'Active'
  },
  {
    id: 5,
    title: 'VIP Royal Spa & Pampering Package',
    category: 'VIP Packages',
    price: 95,
    duration: '75 mins',
    description: 'Complete royal package: aromatherapy bath, full custom haircut, teeth brush, blueberry facial, and complimentary bandana.',
    icon: '👑',
    badge: 'LUXURY',
    highlights: ['Blueberry Facial', 'Custom Breed Sculpt', 'Aromatherapy Mist'],
    image: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=600',
    status: 'Active'
  },
  {
    id: 6,
    title: 'Medicinal Flea & Tick Treatment',
    category: 'Baths & Spa',
    price: 55,
    duration: '45 mins',
    description: 'Natural botanical antiparasitic soak, soothing aloe-vera itch relief, and protective leave-in shield.',
    icon: '🌿',
    badge: 'CARE',
    highlights: ['Botanical Soak', 'Anti-Itch Aloe Wash', 'Protective Shield'],
    image: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?auto=format&fit=crop&q=80&w=600',
    status: 'Active'
  },
  {
    id: 7,
    title: 'Cat Grooming & De-Matting',
    category: 'Full Grooming',
    price: 70,
    duration: '50 mins',
    description: 'Stress-free feline grooming: gentle waterless or sponge bath, soft knot detangling, nail cap trim, and ear hygiene.',
    icon: '🐱',
    badge: 'FELINE',
    highlights: ['Stress-Free Handling', 'Soft Knot Detangling', 'Ear Hygiene'],
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=600',
    status: 'Active'
  },
  {
    id: 8,
    title: 'Puppy First Grooming Experience',
    category: 'VIP Packages',
    price: 40,
    duration: '35 mins',
    description: 'Gentle positive-reinforcement intro for puppies up to 6 months: warm bubble wash, face scissoring, and gentle blow dry.',
    icon: '🐶',
    badge: 'PUPPY',
    highlights: ['Positive Reinforcement', 'Gentle Bubble Wash', 'Face & Paw Trim'],
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=600',
    status: 'Active'
  }
]

const allServices = ref([])

const loadServices = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      allServices.value = JSON.parse(saved)
    } else {
      allServices.value = [...initialServices]
      saveServices()
    }
  } catch (e) {
    console.error('Failed to load services:', e)
    allServices.value = [...initialServices]
  }
}

const saveServices = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allServices.value))
  } catch (e) {
    console.error('Failed to save services:', e)
  }
}

watch(allServices, () => {
  saveServices()
}, { deep: true })

loadServices()

export function useServices() {
  const serviceColumns = computed(() => {
    const s = allServices.value
    const col1 = s.slice(0, Math.ceil(s.length / 3))
    const col2 = s.slice(Math.ceil(s.length / 3), Math.ceil((s.length * 2) / 3))
    const col3 = s.slice(Math.ceil((s.length * 2) / 3))
    return [col1, col2, col3]
  })

  const categories = ['All', 'Full Grooming', 'Baths & Spa', 'Paw & Nails', 'Dental Care', 'VIP Packages']

  const addService = (serviceData) => {
    const newId = allServices.value.length > 0 ? Math.max(...allServices.value.map(s => Number(s.id) || 0)) + 1 : 1
    const newService = {
      id: newId,
      status: 'Active',
      icon: '✂️',
      highlights: [],
      badge: '',
      ...serviceData,
      price: Number(serviceData.price) || 0
    }
    allServices.value.push(newService)
    saveServices()
    return newService
  }

  const updateService = (id, updatedFields) => {
    const idx = allServices.value.findIndex(s => s.id === id)
    if (idx !== -1) {
      allServices.value[idx] = {
        ...allServices.value[idx],
        ...updatedFields,
        price: updatedFields.price !== undefined ? Number(updatedFields.price) : allServices.value[idx].price
      }
      saveServices()
    }
  }

  const deleteService = (id) => {
    const idx = allServices.value.findIndex(s => s.id === id)
    if (idx !== -1) {
      allServices.value.splice(idx, 1)
      saveServices()
    }
  }

  const resetServices = () => {
    allServices.value = [...initialServices]
    saveServices()
  }

  return { 
    allServices,
    serviceColumns,
    categories,
    addService,
    updateService,
    deleteService,
    resetServices
  }
}
