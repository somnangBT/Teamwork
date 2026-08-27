import { ref } from 'vue'

export function useWorks() {
  const works = ref([
    {
      id: 1,
      title: "Selby's",
      category: "Salon Interiors",
      location: "Redwood City, California, United States",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200",
      year: "2026",
      featured: true
    },
    {
      id: 2,
      title: "La Connessa",
      category: "Hair Architecture",
      location: "San Francisco, California, United States",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200",
      year: "2026",
      featured: true
    },
    {
      id: 3,
      title: "Augustine",
      category: "Editorial & Styling",
      location: "Los Angeles, California, United States",
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=800",
      year: "2025",
      featured: false
    },
    {
      id: 4,
      title: "The Grand Atelier",
      category: "Salon Interiors",
      location: "SoHo, New York, United States",
      image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800",
      year: "2025",
      featured: false
    },
    {
      id: 5,
      title: "Kinfolk Beauty Lounge",
      category: "Color Artistry",
      location: "Tokyo, Shibuya, Japan",
      image: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&q=80&w=800",
      year: "2025",
      featured: false
    },
    {
      id: 6,
      title: "L'Étoile Sanctuary",
      category: "Spa Sanctuaries",
      location: "Paris, Le Marais, France",
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800",
      year: "2024",
      featured: false
    }
  ])

  const categories = ref([
    'All',
    'Salon Interiors',
    'Hair Architecture',
    'Editorial & Styling',
    'Color Artistry',
    'Spa Sanctuaries'
  ])

  return { works, categories }
}
