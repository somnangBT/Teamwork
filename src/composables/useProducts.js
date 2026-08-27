import { ref, watch } from 'vue'

const STORAGE_KEY = 'tiki_salon_products'

const initialProducts = [
  {
    id: 1,
    name: 'Royal Canin Medium Adult Dry Food (12kg)',
    description: 'Complete nutritional formula specifically tailored for medium-sized adult dogs with natural prebiotic fiber.',
    price: '$54.99',
    rawPrice: 54.99,
    image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&q=80&w=600',
    tag: 'Best Seller',
    category: 'Food & Nutrition',
    stock: 45,
    status: 'In Stock'
  },
  {
    id: 2,
    name: 'Purina Pro Plan Adult Wet Food (12 x 400g)',
    description: 'High-protein grain-free wet dog food with real tender lamb and savory gravy for optimal vitality.',
    price: '$18.49',
    rawPrice: 18.49,
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=600',
    category: 'Food & Nutrition',
    stock: 82,
    status: 'In Stock'
  },
  {
    id: 3,
    name: 'Trixie Rubber Dumbbell Chew Toy (Medium)',
    description: 'Durable non-toxic natural rubber toy for active chewing, dental massage, and fetching fun.',
    price: '$7.99',
    rawPrice: 7.99,
    image: 'https://images.unsplash.com/photo-1535294435445-d7249524ef2e?auto=format&fit=crop&q=80&w=600',
    category: 'Toys & Fun',
    stock: 14,
    status: 'Low Stock'
  },
  {
    id: 4,
    name: 'N&D Comfort Ergonomic Dog Harness (Size M)',
    description: 'Padded breathable no-pull harness with reflective night stitching and quick-release safety buckles.',
    price: '$24.90',
    rawPrice: 24.90,
    image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&q=80&w=600',
    category: 'Accessories',
    stock: 28,
    status: 'In Stock'
  },
  {
    id: 5,
    name: 'Tiki Organic Oatmeal & Aloe Pet Shampoo (500ml)',
    description: 'Hypoallergenic soothing formula to relieve dry itchy skin and leave coat silky soft.',
    price: '$16.50',
    rawPrice: 16.50,
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=600',
    tag: 'Top Rated',
    category: 'Grooming & Care',
    stock: 5,
    status: 'Low Stock'
  },
  {
    id: 6,
    name: 'Natural Shea Butter Paw & Nose Balm (60g)',
    description: '100% organic lick-safe restorative wax for cracked paws, rough noses, and seasonal protection.',
    price: '$12.00',
    rawPrice: 12.00,
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&q=80&w=600',
    category: 'Grooming & Care',
    stock: 64,
    status: 'In Stock'
  }
]

const products = ref([])

const loadProducts = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      products.value = JSON.parse(saved)
    } else {
      products.value = [...initialProducts]
      saveProducts()
    }
  } catch (e) {
    console.error('Failed to load products:', e)
    products.value = [...initialProducts]
  }
}

const saveProducts = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products.value))
  } catch (e) {
    console.error('Failed to save products:', e)
  }
}

watch(products, () => {
  saveProducts()
}, { deep: true })

loadProducts()

export function useProducts() {
  const categories = ['All', 'Food & Nutrition', 'Grooming & Care', 'Accessories', 'Toys & Fun']

  const addProduct = (productData) => {
    const newId = products.value.length > 0 ? Math.max(...products.value.map(p => Number(p.id) || 0)) + 1 : 1
    const rawVal = parseFloat(productData.rawPrice || productData.price.toString().replace(/[^0-9.]/g, '')) || 0
    const stockVal = parseInt(productData.stock, 10) || 0

    const newProd = {
      id: newId,
      name: productData.name,
      description: productData.description || '',
      price: `$${rawVal.toFixed(2)}`,
      rawPrice: rawVal,
      image: productData.image || 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=600',
      tag: productData.tag || '',
      category: productData.category || 'Grooming & Care',
      stock: stockVal,
      status: stockVal <= 0 ? 'Out of Stock' : (stockVal < 10 ? 'Low Stock' : 'In Stock')
    }

    products.value.unshift(newProd)
    saveProducts()
    return newProd
  }

  const updateProduct = (id, updatedFields) => {
    const idx = products.value.findIndex(p => p.id === id)
    if (idx !== -1) {
      let rawVal = updatedFields.rawPrice
      if (rawVal === undefined && updatedFields.price) {
        rawVal = parseFloat(updatedFields.price.toString().replace(/[^0-9.]/g, ''))
      } else if (rawVal === undefined) {
        rawVal = products.value[idx].rawPrice
      }

      const stockVal = updatedFields.stock !== undefined ? parseInt(updatedFields.stock, 10) : products.value[idx].stock

      products.value[idx] = {
        ...products.value[idx],
        ...updatedFields,
        rawPrice: rawVal,
        price: `$${rawVal.toFixed(2)}`,
        stock: stockVal,
        status: stockVal <= 0 ? 'Out of Stock' : (stockVal < 10 ? 'Low Stock' : 'In Stock')
      }
      saveProducts()
    }
  }

  const deleteProduct = (id) => {
    const idx = products.value.findIndex(p => p.id === id)
    if (idx !== -1) {
      products.value.splice(idx, 1)
      saveProducts()
    }
  }

  const resetProducts = () => {
    products.value = [...initialProducts]
    saveProducts()
  }

  return { 
    products,
    categories,
    addProduct,
    updateProduct,
    deleteProduct,
    resetProducts
  }
}
