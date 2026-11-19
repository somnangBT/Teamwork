import { ref, watch } from 'vue'

const STORAGE_KEY = 'tiki_beauty_products_v2'

const initialProducts = [
  {
    id: 1,
    name: 'Aura Botanical Nourishing Shampoo (500ml)',
    description: 'Sulfate-free rosemary, cedarwood, and horsetail botanical complex shampoo that gently cleanses and restores natural hair volume and shine.',
    price: '$28.00',
    rawPrice: 28.00,
    image: '/images/shampoo.jpg',
    tag: 'Best Seller',
    category: 'Hair Care',
    stock: 45,
    status: 'In Stock'
  },
  {
    id: 2,
    name: 'Aurélia Luxury Argan Hair Oil (100ml)',
    description: '100% cold-pressed Moroccan argan elixir with silky fast absorption to nourish split ends, tame frizz, and leave hair mirror-glossy.',
    price: '$36.00',
    rawPrice: 36.00,
    image: '/images/argan_oil.jpg',
    tag: 'Top Rated',
    category: 'Serums & Oils',
    stock: 38,
    status: 'In Stock'
  },
  {
    id: 3,
    name: 'Avène Botanicals Shampoo & Radiance Serum Duo',
    description: 'Complete salon haircare ritual pairing our revitalizing botanical wash with jojoba, rosehip & bergamot radiance hair serum.',
    price: '$58.00',
    rawPrice: 58.00,
    image: '/images/haircare.jpg',
    tag: 'Value Set',
    category: 'Hair Care',
    stock: 24,
    status: 'In Stock'
  },
  {
    id: 4,
    name: 'Botanical Radiancy Serum & Glow Moisturizer Set',
    description: 'Illuminating 30ml floral oil serum paired with our whipped luminosity cream moisturizer for dewy, glass-skin hydration.',
    price: '$64.00',
    rawPrice: 64.00,
    image: '/images/skincare.jpg',
    tag: 'Glow Pick',
    category: 'Skin & Glow',
    stock: 19,
    status: 'In Stock'
  },
  {
    id: 5,
    name: 'Act+Acre Restorative Keratin Hair Mask (133ml)',
    description: 'Deep-conditioning plant-keratin intensive hair treatment formulated to repair color-treated, heat-styled, and dry strands.',
    price: '$38.00',
    rawPrice: 38.00,
    image: '/images/prod_hair_mask.jpg',
    category: 'Hair Care',
    stock: 12,
    status: 'Low Stock'
  },
  {
    id: 6,
    name: 'Silk Velvet Matte Lip & Gloss Duo',
    description: 'Weightless conditioning velvet lipstick and high-shine botanical lip lacquer in signature rose-crimson for day-to-evening elegance.',
    price: '$29.50',
    rawPrice: 29.50,
    image: '/images/prod_lip_duo.jpg',
    tag: 'New',
    category: 'Makeup & Tools',
    stock: 32,
    status: 'In Stock'
  },
  {
    id: 7,
    name: 'Rosewater Hydrating Cleanser & Cream Duo',
    description: 'Gentle pH-balanced foaming cleanser and oil-free soothing daily gel moisturizer infused with pure rosewater and hyaluronic acid.',
    price: '$42.00',
    rawPrice: 42.00,
    image: '/images/prod_cleanser_duo.jpg',
    category: 'Skin & Glow',
    stock: 27,
    status: 'In Stock'
  },
  {
    id: 8,
    name: 'Pro Salon Ceramic Styler & Paddle Brush Kit',
    description: 'Professional tourmaline-ceramic flat iron, high-velocity salon blow dryer, detangling paddle brush, and precision styling clips.',
    price: '$72.00',
    rawPrice: 72.00,
    image: '/images/prod_styling_tools.jpg',
    category: 'Makeup & Tools',
    stock: 8,
    status: 'Low Stock'
  },
  {
    id: 9,
    name: 'Nécessaire Botanical Body & Neck Emulsion (200ml)',
    description: 'Fragrance-free multi-peptide, niacinamide, and vitamin E fast-absorbing silk lotion for soft, luminous skin.',
    price: '$34.00',
    rawPrice: 34.00,
    image: '/images/prod_body_lotion.jpg',
    category: 'Skin & Glow',
    stock: 50,
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
  const categories = ['All', 'Hair Care', 'Skin & Glow', 'Serums & Oils', 'Makeup & Tools']

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
      image: productData.image || '/images/shampoo.jpg',
      tag: productData.tag || '',
      category: productData.category || 'Hair Care',
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
