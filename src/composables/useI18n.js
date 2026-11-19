import { ref, computed } from 'vue'

const LANG_KEY = 'salon_lang'
const initialLang = (() => {
  try {
    const saved = localStorage.getItem(LANG_KEY)
    return saved === 'kh' ? 'kh' : 'en'
  } catch {
    return 'en'
  }
})()

const currentLang = ref(initialLang)

function syncHtmlLang(lang) {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lang === 'kh' ? 'km' : 'en'
  }
}

syncHtmlLang(currentLang.value)

const messages = {
  en: {
    nav: {
      home: 'Home',
      products: 'Products',
      services: 'Services',
      bookings: 'My Bookings',
      bookNow: 'Book Now',
      bookShort: 'Book',
      cart: 'Shopping Cart',
      profile: 'View Profile & Settings',
      language: 'Language',
      theme: 'Theme',
      light: 'Light',
      dark: 'Dark',
      lightMode: 'Light Mode',
      darkMode: 'Dark Mode',
      adminPortal: 'Admin Portal',
      signIn: 'Sign In',
      logout: 'Log out',
      menu: 'Menu'
    },
    hero: {
      title: 'Where Women Experience Luxury & Radiance',
      subtitle: 'Signature hair artistry, botanical head spas, radiant facials, and curated skincare essentials crafted for modern women.',
      bookBtn: 'Book Salon Appointment',
      browseBtn: 'Shop Beauty Products',
      scrollHint: 'Scroll to explore'
    },
    home: {
      curatedBadge: 'CURATED SELECTION',
      productsTitle: 'Women’s Hair & Skincare Essentials',
      viewAllProducts: 'View All Products',
      servicesBadge: 'SIGNATURE TREATMENTS',
      servicesTitle: 'Beauty Salon & Spa Services',
      servicesSubtitle: 'Every session includes a tailored hair & skin consultation, organic botanical rituals, and serene suite care.',
      viewAllServices: 'Explore All Services',
      bookService: 'Book Service',
      specialistsBadge: 'EXPERT ARTISTS',
      specialistsTitle: 'Meet Our Certified Stylists',
      specialistsSubtitle: 'Experienced hair directors, colorists, nail artists, and botanical facialists dedicated to effortless elegance.',
      bookWith: 'Book with',
      testimonialsBadge: 'CLIENT LOVE',
      testimonialsTitle: 'Trusted by Happy Salon Guests',
      faqTitle: 'Frequently Asked Questions',
      faqSubtitle: 'Everything to know before your visit to Tiki Tiki Beauty Studio.',
      ctaTitle: 'Ready for Your Radiant Glow?',
      ctaDesc: 'Reserve a serene beauty suite today or explore salon-approved botanical haircare and skincare delivered to your door.',
      ctaStat1: 'Organic Tea Welcome',
      ctaStat2: 'Certified Artists',
      ctaStat3: 'Free Pickup & Express Delivery',
      ctaPrimary: 'Schedule Appointment',
      ctaSecondary: 'Shop Beauty Store',
      visitBadge: 'VISIT OUR STUDIO',
      visitTitle: 'Find Tiki Tiki Salon in BKK1',
      visitDesc: 'Step into our tranquil flagship sanctuary for private beauty suites, botanical head spa rituals, and express in-store order pickup.',
      visitAddressLabel: 'Studio Address',
      visitAddress: '42 Orchid Blossom Ave, BKK1, Phnom Penh',
      visitHoursLabel: 'Opening Hours',
      visitHours: 'Daily · 08:30 AM – 08:00 PM',
      visitPhoneLabel: 'Concierge Line',
      visitPhone: '+855 23 998 412',
      getDirections: 'Open in Google Maps'
    },
    products: {
      pageTitle: 'Curated Salon Hair & Beauty Care',
      searchPlaceholder: 'Search products...',
      category: 'Category',
      stockStatus: 'Availability',
      tag: 'Collection',
      price: 'Price',
      favoritesOnly: 'Saved',
      resetFilters: 'Reset filters',
      emptyTitle: 'No matching products found',
      emptyDesc: 'Try clearing filters or search query to explore the full collection.',
      clearAll: 'Clear all filters',
      addToBag: 'Add to Bag',
      addedToast: 'Added to shopping bag',
      savedToast: 'Saved to favorites',
      removedFavToast: 'Removed from favorites',
      quickView: 'Quick View',
      inStock: 'In Stock',
      lowStock: 'Low Stock',
      outOfStock: 'Out of Stock'
    },
    services: {
      popularTitle: 'Popular Treatments',
      allTitle: 'All Salon Services',
      searchPlaceholder: 'Search hair, spa & beauty services...',
      viewAll: 'View All',
      bookNow: 'Book Now',
      selected: 'Selected',
      viewDetails: 'Details',
      emptyTitle: 'No services found',
      emptyDesc: 'Try adjusting your search query or choosing another category.'
    },
    booking: {
      filtersTitle: 'Filters & Actions',
      items: 'Items',
      status: 'Status',
      date: 'Date',
      viewMode: 'View Mode',
      detailed: 'Detailed',
      minimalist: 'Minimalist',
      bookServiceBtn: 'Book a Service',
      browseCatalogBtn: 'Browse Service Catalog',
      noBookingsTitle: 'No bookings found',
      noBookingsDesc: "You don't have any matching appointment items.",
      cancelBooking: 'Cancel Booking',
      reschedule: 'Reschedule',
      downloadIcs: 'Download .ics Calendar',
      payAtSalon: 'Pay at Salon'
    },
    cart: {
      heading: 'Shopping Cart',
      emptyTitle: 'Your cart is empty',
      emptyDesc: 'Discover botanical shampoos, argan hair oils, facial serums, and salon styling essentials.',
      browseBtn: 'Browse Products',
      continueShopping: 'Continue Shopping',
      summaryTitle: 'Order Summary',
      subtotal: 'Subtotal',
      itemSingular: 'item',
      itemPlural: 'items',
      products: 'Products',
      productsCost: 'Products cost',
      deliveryCost: 'Delivery cost',
      estimatedTax: 'Estimated Tax (5%)',
      discount: 'Discount',
      free: 'Free',
      awayFromFree: 'away from free delivery',
      unlockedFree: 'You unlocked free delivery!',
      total: 'Total',
      checkoutBtn: 'Proceed to Checkout',
      promoLabel: 'Promo Code',
      promoTitle: 'I have a promo code',
      promoPlaceholder: 'Enter code (e.g. TIKI10)',
      apply: 'Apply',
      removePromo: 'Remove',
      onlyLeft: 'Only {count} left'
    },
    profile: {
      title: 'Profile',
      account: 'Account',
      pets: 'Beauty profile',
      vouchers: 'Vouchers',
      orders: 'Order history',
      addresses: 'My Addresses',
      billing: 'Billing information',
      support: 'Support',
      logout: 'Log out'
    },
    footer: {
      tagline: 'Luxury women’s beauty salon, botanical head spa rituals, and curated haircare & skincare essentials.',
      explore: 'Explore',
      customerCare: 'Customer Care',
      visitUs: 'Visit Our Salon',
      newsletterTitle: 'Join the Tiki Beauty Club',
      newsletterDesc: 'Get $10 off your first beauty booking and seasonal skincare tips.',
      subscribe: 'Subscribe',
      rights: 'All rights reserved.'
    },
    admin: {
      dashboard: 'Dashboard',
      bookings: 'Bookings',
      services: 'Services',
      products: 'Products',
      orders: 'Orders',
      customers: 'Customers',
      staff: 'Staff',
      settings: 'Settings',
      storefront: 'Storefront'
    }
  },
  kh: {
    nav: {
      home: 'ទំព័រដើម',
      products: 'ផលិតផល',
      services: 'សេវាកម្ម',
      bookings: 'ការកក់របស់ខ្ញុំ',
      bookNow: 'កក់ឥឡូវនេះ',
      bookShort: 'កក់',
      cart: 'កន្ត្រកទំនិញ',
      profile: 'មើលគណនី និងការកំណត់',
      language: 'ភាសា',
      theme: 'រចនាប័ទ្ម',
      light: 'ភ្លឺ',
      dark: 'ងងឹត',
      lightMode: 'ម៉ូដភ្លឺ',
      darkMode: 'ម៉ូដងងឹត',
      adminPortal: 'ផ្ទាំងគ្រប់គ្រង Admin',
      signIn: 'ចូលគណនី',
      logout: 'ចាកចេញ',
      menu: 'ម៉ឺនុយ'
    },
    hero: {
      title: 'កន្លែងដែលស្ត្រីទទួលបានភាពស្រស់ស្អាត និងប្រណីតភាព',
      subtitle: 'សេវាកម្មធ្វើសក់ ស្ប៉ាក្បាលធម្មជាតិ ថែរក្សាស្បែកមុខ និងផលិតផលថែទាំសម្រស់ស្ត្រីគុណភាពខ្ពស់។',
      bookBtn: 'កក់សេវាកម្ម Salon',
      browseBtn: 'មើលផលិតផលសម្រាប់ស្ត្រី',
      scrollHint: 'អូសចុះក្រោមដើម្បីស្វែងយល់'
    },
    home: {
      curatedBadge: 'ផលិតផលជ្រើសរើសពិសេស',
      productsTitle: 'ផលិតផលថែទាំសក់ និងសម្រស់ស្ត្រី',
      viewAllProducts: 'មើលផលិតផលទាំងអស់',
      servicesBadge: 'សេវាកម្មពេញនិយម',
      servicesTitle: 'សេវាកម្ម Salon និងស្ប៉ាសម្រស់',
      servicesSubtitle: 'រាល់ការណាត់ជួបរួមមានការពិគ្រោះយោបល់សក់ និងស្បែក ការថែទាំដោយផលិតផលធម្មជាតិ និងបន្ទប់ស្ប៉ាប្រណីត។',
      viewAllServices: 'មើលសេវាកម្មទាំងអស់',
      bookService: 'កក់សេវាកម្ម',
      specialistsBadge: 'ក្រុមអ្នកជំនាញ',
      specialistsTitle: 'ជួបជាមួយអ្នកជំនាញសម្រស់របស់យើង',
      specialistsSubtitle: 'អ្នកជំនាញដែលមានបទពិសោធន៍ខ្ពស់ក្នុងការកាត់សក់ លាបពណ៌សក់ ធ្វើក្រចក និងស្ប៉ាមុខធម្មជាតិ។',
      bookWith: 'កក់ជាមួយ',
      testimonialsBadge: 'មតិអតិថិជន',
      testimonialsTitle: 'ទំនុកចិត្តពីអតិថិជនស្ត្រី',
      faqTitle: 'សំណួរដែលសួរញឹកញាប់',
      faqSubtitle: 'ព័ត៌មានសំខាន់ៗមុនពេលអញ្ជើញមកកាន់ Tiki Tiki Beauty Studio។',
      ctaTitle: 'ត្រៀមខ្លួនសម្រាប់សម្រស់ភ្លឺថ្លាហើយឬនៅ?',
      ctaDesc: 'កក់បន្ទប់ស្ប៉ា និងធ្វើសក់របស់អ្នកថ្ងៃនេះ ឬទិញផលិតផលថែទាំសម្រស់ដឹកជញ្ជូនដល់ផ្ទះ។',
      ctaStat1: 'ស្វាគមន៍ដោយតែរុក្ខជាតិ',
      ctaStat2: 'អ្នកជំនាញមានវិញ្ញាបនបត្រ',
      ctaStat3: 'ដឹកជញ្ជូនរហ័ស និងទទួលនៅហាងឥតគិតថ្លៃ',
      ctaPrimary: 'កក់ពេលវេលាណាត់ជួប',
      ctaSecondary: 'ចូលទិញផលិតផល',
      visitBadge: 'ទីតាំងហាងរបស់យើង',
      visitTitle: 'ស្វែងរក Tiki Tiki Salon នៅ BKK1',
      visitDesc: 'អញ្ជើញមកទទួលយកបទពិសោធន៍ថែរក្សាសម្រស់ និងស្ប៉ាក្បាលបែបធម្មជាតិដ៏ស្ងប់ស្ងាត់ ឬមកទទួលផលិតផលដោយផ្ទាល់។',
      visitAddressLabel: 'អាសយដ្ឋានហាង',
      visitAddress: '42 Orchid Blossom Ave, BKK1, Phnom Penh',
      visitHoursLabel: 'ម៉ោងបើកបម្រើសេវាកម្ម',
      visitHours: 'រៀងរាល់ថ្ងៃ · 08:30 AM – 08:00 PM',
      visitPhoneLabel: 'លេខទំនាក់ទំនងកក់ទុក',
      visitPhone: '+855 23 998 412',
      getDirections: 'បើកមើលក្នុង Google Maps'
    },
    products: {
      pageTitle: 'ផលិតផលថែទាំសក់ និងសម្រស់ Salon',
      searchPlaceholder: 'ស្វែងរកផលិតផល...',
      category: 'ប្រភេទ',
      stockStatus: 'ស្តុកទំនិញ',
      tag: 'ការប្រមូលផ្តុំ',
      price: 'តម្លៃ',
      favoritesOnly: 'ចូលចិត្ត',
      resetFilters: 'កំណត់ឡើងវិញ',
      emptyTitle: 'រកមិនឃើញផលិតផលដែលត្រូវគ្នាទេ',
      emptyDesc: 'សូមសាកល្បងសម្អាតតម្រង ឬពាក្យស្វែងរកឡើងវិញ។',
      clearAll: 'សម្អាតតម្រងទាំងអស់',
      addToBag: 'ដាក់ចូលកន្ត្រក',
      addedToast: 'បានបន្ថែមទៅកន្ត្រកទំនិញ',
      savedToast: 'បានរក្សាទុកក្នុងបញ្ជីចូលចិត្ត',
      removedFavToast: 'បានដកចេញពីបញ្ជីចូលចិត្ត',
      quickView: 'មើលលម្អិត',
      inStock: 'មានក្នុងស្តុក',
      lowStock: 'ស្តុកជិតអស់',
      outOfStock: 'អស់ពីស្តុក'
    },
    services: {
      popularTitle: 'សេវាកម្មពេញនិយម',
      allTitle: 'សេវាកម្ម Salon ទាំងអស់',
      searchPlaceholder: 'ស្វែងរកសេវាកម្មថែទាំ និងស្ប៉ា...',
      viewAll: 'មើលទាំងអស់',
      bookNow: 'កក់ឥឡូវ',
      selected: 'បានជ្រើសរើស',
      viewDetails: 'ព័ត៌មានលម្អិត',
      emptyTitle: 'រកមិនឃើញសេវាកម្មទេ',
      emptyDesc: 'សូមសាកល្បងផ្លាស់ប្តូរពាក្យស្វែងរក ឬប្រភេទសេវាកម្ម។'
    },
    booking: {
      filtersTitle: 'តម្រង និងសកម្មភាព',
      items: 'មុខទំនិញ',
      status: 'ស្ថានភាព',
      date: 'កាលបរិច្ឆេទ',
      viewMode: 'របៀបបង្ហាញ',
      detailed: 'លម្អិត',
      minimalist: 'សង្ខេប',
      bookServiceBtn: 'កក់សេវាកម្មថ្មី',
      browseCatalogBtn: 'មើលបញ្ជីសេវាកម្ម',
      noBookingsTitle: 'មិនមានការកក់ទេ',
      noBookingsDesc: 'អ្នកមិនមានការណាត់ជួបដែលត្រូវនឹងតម្រងនេះទេ។',
      cancelBooking: 'បោះបង់ការកក់',
      reschedule: 'ប្តូរពេលវេលា',
      downloadIcs: 'ទាញយកប្រតិទិន .ics',
      payAtSalon: 'ទូទាត់នៅហាង'
    },
    cart: {
      heading: 'កន្ត្រកទំនិញ',
      emptyTitle: 'កន្ត្រកទំនិញរបស់អ្នកទទេ',
      emptyDesc: 'ស្វែងរកសាប៊ូកក់សក់ធម្មជាតិ ប្រេងលាបសក់ សេរ៉ូមមុខ និងផលិតផលសម្រស់ស្ត្រី។',
      browseBtn: 'រកមើលផលិតផល',
      continueShopping: 'បន្តទិញទំនិញ',
      summaryTitle: 'បញ្ជាក់ការបញ្ជាទិញ',
      subtotal: 'សរុបរង',
      itemSingular: 'មុខ',
      itemPlural: 'មុខ',
      products: 'ចំនួនផលិតផល',
      productsCost: 'តម្លៃផលិតផល',
      deliveryCost: 'ការដឹកជញ្ជូន',
      estimatedTax: 'ពន្ធ (5%)',
      discount: 'បញ្ចុះតម្លៃ',
      free: 'ឥតគិតថ្លៃ',
      awayFromFree: 'ទៀតដើម្បីដឹកជញ្ជូនឥតគិតថ្លៃ',
      unlockedFree: 'អ្នកទទួលបានការដឹកជញ្ជូនឥតគិតថ្លៃ!',
      total: 'សរុប',
      checkoutBtn: 'បន្តការទូទាត់',
      promoLabel: 'កូដបញ្ចុះតម្លៃ',
      promoTitle: 'ខ្ញុំមានកូដបញ្ចុះតម្លៃ',
      promoPlaceholder: 'បញ្ចូលកូដ (ឧ. TIKI10)',
      apply: 'ប្រើកូដ',
      removePromo: 'ដកចេញ',
      onlyLeft: 'នៅសល់តែ {count}'
    },
    profile: {
      title: 'គណនី',
      account: 'ព័ត៌មានគណនី',
      pets: 'ទម្រង់សម្រស់របស់ខ្ញុំ',
      vouchers: 'ប័ណ្ណបញ្ចុះតម្លៃ',
      orders: 'ប្រវត្តិការបញ្ជាទិញ',
      addresses: 'អាសយដ្ឋានរបស់ខ្ញុំ',
      billing: 'វិធីសាស្ត្រទូទាត់',
      support: 'ជំនួយអតិថិជន',
      logout: 'ចាកចេញ'
    },
    footer: {
      tagline: 'សេវាកម្មថែរក្សាសម្រស់ស្ត្រី ស្ប៉ាសក់ធម្មជាតិ និងផលិតផលសុខភាពស្បែក និងសក់ដ៏ប្រណីត។',
      explore: 'ស្វែងយល់',
      customerCare: 'សេវាអតិថិជន',
      visitUs: 'ទីតាំងហាង',
      newsletterTitle: 'ចូលរួម Tiki Beauty Club',
      newsletterDesc: 'ទទួលបានការបញ្ចុះតម្លៃ $10 សម្រាប់ការកក់ដំបូង។',
      subscribe: 'ចុះឈ្មោះ',
      rights: 'រក្សាសិទ្ធិគ្រប់យ៉ាង។'
    },
    admin: {
      dashboard: 'ផ្ទាំងគ្រប់គ្រង',
      bookings: 'ការណាត់ជួប',
      services: 'សេវាកម្ម',
      products: 'ផលិតផល',
      orders: 'ការបញ្ជាទិញ',
      customers: 'អតិថិជន',
      staff: 'បុគ្គលិក',
      settings: 'ការកំណត់',
      storefront: 'ទៅកាន់ហាង'
    }
  }
}

export function useI18n() {
  const isKhmer = computed(() => currentLang.value === 'kh')

  const setLanguage = (lang) => {
    const normalized = lang === 'kh' ? 'kh' : 'en'
    currentLang.value = normalized
    syncHtmlLang(normalized)
    try {
      localStorage.setItem(LANG_KEY, normalized)
    } catch {
      // Ignore storage errors
    }
  }

  const t = (path, fallback = '') => {
    const parts = path.split('.')
    let node = messages[currentLang.value] || messages.en
    for (const part of parts) {
      if (node && typeof node === 'object' && part in node) {
        node = node[part]
      } else {
        node = null
        break
      }
    }
    if (typeof node === 'string') return node
    if (currentLang.value !== 'en') {
      let enNode = messages.en
      for (const part of parts) {
        if (enNode && typeof enNode === 'object' && part in enNode) {
          enNode = enNode[part]
        } else {
          enNode = null
          break
        }
      }
      if (typeof enNode === 'string') return enNode
    }
    return fallback || path
  }

  return {
    currentLang,
    isKhmer,
    setLanguage,
    t
  }
}
