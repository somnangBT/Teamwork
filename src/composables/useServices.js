import { ref, computed, watch } from 'vue'

const STORAGE_KEY = 'tiki_beauty_services_v3'

const initialServices = [
  {
    id: 1,
    title: 'Signature Haircut & Silk Blowout',
    category: 'Hair Styling',
    price: 55,
    duration: '60 mins',
    description: 'Personalized face-framing layered haircut, organic botanical wash, nourishing argan mist, and bouncy salon blowout finish.',
    icon: '✂️',
    badge: 'POPULAR',
    highlights: ['Face-Framing Cut', 'Botanical Hair Wash', 'Volume Blowout'],
    image: '/images/svc_salon_blowout.jpg',
    specialistName: 'Elena Rostova',
    specialistAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    status: 'Active'
  },
  {
    id: 2,
    title: 'Herbal Botanical Head Spa & Steam',
    category: 'Head & Scalp Spa',
    price: 65,
    duration: '50 mins',
    description: 'Japanese-inspired warm herbal mist waterfall rinse, acupressure scalp & neck massage, and deep detox pore purification.',
    icon: '🌿',
    badge: 'TRENDING',
    highlights: ['Warm Herbal Steam', 'Scalp Acupressure', 'Silk Gloss Rinse'],
    image: '/images/svc_head_spa.jpg',
    specialistName: 'Sophia Laurent',
    specialistAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    status: 'Active'
  },
  {
    id: 3,
    title: 'Gel Manicure & Botanical Nail Care',
    category: 'Nails & Beauty',
    price: 32,
    duration: '45 mins',
    description: 'Precision cuticle refinement, nail shaping, sheer blush or custom gel polish, and soothing rosehip hand massage.',
    icon: '💅',
    badge: 'ESSENTIAL',
    highlights: ['Cuticle Care', 'Long-Wear Gel Polish', 'Rosehip Hand Massage'],
    image: '/images/svc_manicure.jpg',
    specialistName: 'Chloe Lin',
    specialistAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    status: 'Active'
  },
  {
    id: 4,
    title: 'Radiance Botanical Facial Glow',
    category: 'Facial & Skin',
    price: 75,
    duration: '60 mins',
    description: 'Gentle enzyme exfoliation, lymphatic jade-roller sculpting massage, hyaluronic serum infusion, and calming floral mask.',
    icon: '✨',
    badge: 'SIGNATURE',
    highlights: ['Lymphatic Sculpting', 'Hyaluronic Serum', 'Glass-Skin Mask'],
    image: '/images/svc_facial_spa.jpg',
    specialistName: 'Sophia Laurent',
    specialistAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    status: 'Active'
  },
  {
    id: 5,
    title: 'VIP Bridal & Royal Spa Package',
    category: 'VIP Packages',
    price: 125,
    duration: '90 mins',
    description: 'Complete luxury pampering suite: botanical facial glow, keratin silk hair spa, aromatherapy body wrap, and complimentary mist.',
    icon: '👑',
    badge: 'LUXURY',
    highlights: ['Full Facial & Hair Spa', 'Aroma Candle Suite', 'Silk Finish Styling'],
    image: '/images/svc_vip_spa.jpg',
    specialistName: 'Elena Rostova',
    specialistAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    status: 'Active'
  },
  {
    id: 6,
    title: 'Keratin Silk Hair Repair Ritual',
    category: 'Hair Styling',
    price: 85,
    duration: '65 mins',
    description: 'Intensive botanical keratin protein mask infused with warm steam to smooth frizz, seal cuticles, and restore mirror shine.',
    icon: '💧',
    badge: 'CARE',
    highlights: ['Frizz Control', 'Bond Repair Mask', 'Heat Protection'],
    image: '/images/haircare.jpg',
    specialistName: 'Marcus Vance',
    specialistAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    status: 'Active'
  },
  {
    id: 7,
    title: 'Dimensional Balayage & Gloss',
    category: 'Hair Styling',
    price: 110,
    duration: '110 mins',
    description: 'Hand-painted sunlit caramel or champagne ribbons with ammonia-free gloss toning and bond-building aftercare.',
    icon: '🎨',
    badge: 'COLOR',
    highlights: ['Custom Color Melt', 'Ammonia-Free Gloss', 'Bond Protector'],
    image: '/images/svc_hair_color.jpg',
    specialistName: 'Marcus Vance',
    specialistAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
    status: 'Active'
  },
  {
    id: 8,
    title: 'Editorial Updo & Soft Glam Styling',
    category: 'VIP Packages',
    price: 70,
    duration: '55 mins',
    description: 'Romantic sculpted waves, sleek chignon updo, and luminous event styling tailored for galas, shoots, and celebrations.',
    icon: '🌸',
    badge: 'GLAM',
    highlights: ['Romantic Waves / Updo', 'Humidity-Lock Mist', 'Pearl Pin Styling'],
    image: '/images/svc_bridal_styling.jpg',
    specialistName: 'Chloe Lin',
    specialistAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
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

  const categories = ['All', 'Hair Styling', 'Head & Scalp Spa', 'Facial & Skin', 'Nails & Beauty', 'VIP Packages']

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
