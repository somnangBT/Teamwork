<template>
  <div class="cart-layout-container position-relative">
    
    <div class="app-container position-relative z-1 pt-2 pb-5">
      
      <!-- Top Title -->
      <div class="mb-3">
        <h1 class="cart-page-heading fw-bold text-dark m-0">Shopping Cart</h1>
      </div>

      <div class="row g-4 align-items-start">
        
        <!-- ========================================================= -->
        <!-- LEFT COLUMN: SHOPPING CART ITEMS LIST                     -->
        <!-- ========================================================= -->
        <div class="col-12 col-lg-8">
          <div class="cart-main-card bg-white rounded-4 p-4 p-md-5">
            
            <div v-if="cartItems.length > 0" class="cart-items-list d-flex flex-column">
              <div 
                v-for="(item, index) in cartItems" 
                :key="item.id"
                class="cart-item-row d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3 py-3"
                :class="{ 'border-bottom': index !== cartItems.length - 1 }"
              >
                <!-- Left: Product Image & Details -->
                <div class="d-flex align-items-center gap-3 flex-grow-1">
                  
                  <!-- Thumbnail Box -->
                  <div class="product-thumb-box rounded-3 border d-flex align-items-center justify-content-center flex-shrink-0">
                    <img :src="item.image" :alt="item.title" class="product-thumb-img object-fit-contain" />
                  </div>

                  <!-- Name, Variant & Action Icons -->
                  <div class="d-flex flex-column">
                    <h6 class="product-title fw-bold text-dark mb-1">{{ item.title }}</h6>
                    <span class="product-variant text-muted small mb-2">{{ item.variant }}</span>

                    <!-- Heart Favorite & Trash Remove Icons -->
                    <div class="d-flex align-items-center gap-3">
                      <button 
                        type="button" 
                        class="btn-icon-action border-0 bg-transparent p-0"
                        :class="{ 'text-danger': item.isFavorite, 'text-warning': !item.isFavorite }"
                        @click="toggleFavorite(item.id)"
                        :title="item.isFavorite ? 'Remove from favorites' : 'Save to favorites'"
                      >
                        <span class="icon-glyph">{{ item.isFavorite ? '❤️' : '♡' }}</span>
                      </button>

                      <button 
                        type="button" 
                        class="btn-icon-action border-0 bg-transparent p-0 text-muted"
                        @click="removeItem(item.id)"
                        title="Remove item"
                      >
                        <span class="icon-glyph">🗑️</span>
                      </button>
                    </div>
                  </div>

                </div>

                <!-- Right: Quantity Pill & Price Tag -->
                <div class="d-flex align-items-center justify-content-between justify-content-sm-end gap-3 gap-md-4 mt-2 mt-sm-0">
                  
                  <!-- Quantity Pill Selector (- 1 +) -->
                  <div class="qty-pill-box d-flex align-items-center justify-content-between rounded-3 px-2 py-1">
                    <button 
                      type="button" 
                      class="btn-qty-action border-0 bg-transparent fw-bold"
                      @click="decreaseQuantity(item.id)"
                      title="Decrease quantity"
                    >
                      –
                    </button>
                    <span class="qty-number fw-bold px-2">{{ item.quantity }}</span>
                    <button 
                      type="button" 
                      class="btn-qty-action border-0 bg-transparent fw-bold"
                      @click="increaseQuantity(item.id)"
                      title="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  <!-- Price Display -->
                  <div class="text-end" style="min-width: 95px;">
                    <div class="d-flex align-items-baseline justify-content-end gap-1.5">
                      <span class="price-current fw-bold">{{ formatPrice(item.price * item.quantity) }}</span>
                      <span v-if="item.originalPrice" class="price-original text-muted text-decoration-line-through small">
                        {{ formatPrice(item.originalPrice * item.quantity) }}
                      </span>
                    </div>
                  </div>

                </div>

              </div>
            </div>

            <!-- Empty Cart State -->
            <div v-else class="text-center py-5">
              <div class="fs-1 mb-2">🛒</div>
              <h5 class="fw-bold text-dark mb-1">Your cart is empty</h5>
              <p class="text-muted small mb-4">Discover premium pet food, grooming tools, and toys.</p>
              <router-link to="/products" class="btn btn-orange-primary rounded-pill px-4 py-2 fw-semibold text-decoration-none">
                Browse Products
              </router-link>
            </div>

          </div>
        </div>

        <!-- ========================================================= -->
        <!-- RIGHT COLUMN: ORDER SUMMARY & PROMO CODE                  -->
        <!-- ========================================================= -->
        <div class="col-12 col-lg-4 d-flex flex-column gap-3">
          
          <!-- Card 1: Order Summary -->
          <div class="summary-card bg-white rounded-4 p-4">
            <h5 class="summary-title fw-bold text-dark mb-3">Order summary</h5>

            <!-- Line Items -->
            <div class="d-flex flex-column gap-2 mb-3">
              <div class="d-flex justify-content-between align-items-center">
                <span class="text-muted small">Products</span>
                <span class="text-dark fw-medium small">{{ totalQuantity }}</span>
              </div>

              <div class="d-flex justify-content-between align-items-center">
                <span class="text-muted small">Products cost</span>
                <span class="text-dark fw-semibold small">{{ formatPrice(productsCost) }}</span>
              </div>

              <div class="d-flex justify-content-between align-items-center">
                <span class="text-muted small">Delivery cost</span>
                <span class="text-dark fw-semibold small">{{ deliveryCost === 0 ? 'Free' : formatPrice(deliveryCost) }}</span>
              </div>

              <div v-if="isPromoApplied" class="d-flex justify-content-between align-items-center text-success">
                <span class="small">Promo Discount ({{ promoCode }})</span>
                <span class="fw-semibold small">-{{ formatPrice(promoDiscount) }}</span>
              </div>
            </div>

            <!-- Free Delivery Progress Box -->
            <div class="free-delivery-box rounded-3 p-3 mb-3">
              <div class="d-flex align-items-center gap-1.5 mb-2">
                <span class="icon-clover">☘️</span>
                <span v-if="awayFromFreeDelivery > 0" class="free-delivery-text fw-semibold">
                  {{ awayFromFreeDelivery }} € away from free delivery
                </span>
                <span v-else class="free-delivery-text fw-semibold text-success">
                  🎉 You unlocked free delivery!
                </span>
              </div>

              <!-- Progress Bar Track -->
              <div class="progress free-progress-track" style="height: 6px;">
                <div 
                  class="progress-bar bg-delivery-green rounded-pill" 
                  role="progressbar" 
                  :style="{ width: freeDeliveryProgress + '%' }" 
                  :aria-valuenow="freeDeliveryProgress" 
                  aria-valuemin="0" 
                  aria-valuemax="100"
                ></div>
              </div>
            </div>

            <!-- Total Row -->
            <div class="d-flex justify-content-between align-items-center my-3 pt-2">
              <span class="fs-5 fw-bold text-dark">Total</span>
              <span class="fs-4 fw-bolder text-dark">{{ formatPrice(totalCost) }}</span>
            </div>

            <!-- Order Primary CTA Button -->
            <button 
              type="button" 
              class="btn-order-orange w-100 rounded-3 py-3 fw-bold border-0"
              :disabled="cartItems.length === 0"
              @click="handleCheckout"
            >
              Order
            </button>
          </div>

          <!-- Card 2: Promo Code Dropdown/Card -->
          <div class="promo-card bg-white rounded-4 p-3 shadow-xs">
            <div 
              class="d-flex justify-content-between align-items-center cursor-pointer"
              @click="isPromoInputOpen = !isPromoInputOpen"
            >
              <div class="d-flex align-items-center gap-2">
                <span>🎟️</span>
                <span class="fw-bold text-dark small">I have a promo code</span>
              </div>
              <span class="text-dark small transition-transform" :class="{ 'rotate-90': isPromoInputOpen }">▸</span>
            </div>

            <!-- Expandable Promo Input -->
            <div v-if="isPromoInputOpen" class="mt-3 pt-2 border-top">
              <div class="d-flex gap-2">
                <input 
                  type="text" 
                  v-model="inputCode" 
                  placeholder="Enter code (e.g. TIKI10)" 
                  class="form-control form-control-sm rounded-3 text-uppercase font-monospace"
                />
                <button 
                  type="button" 
                  class="btn btn-dark btn-sm rounded-3 px-3 fw-semibold"
                  @click="onApplyPromo"
                >
                  Apply
                </button>
              </div>
              <p v-if="promoFeedback" class="small mt-2 mb-0 fw-medium" :class="isPromoApplied ? 'text-success' : 'text-danger'">
                {{ promoFeedback }}
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCart } from '../../../composables/useCart'

const router = useRouter()
const { 
  cartItems, 
  totalQuantity, 
  productsCost, 
  deliveryCost, 
  awayFromFreeDelivery, 
  freeDeliveryProgress, 
  totalCost, 
  promoCode,
  promoDiscount,
  isPromoApplied,
  increaseQuantity, 
  decreaseQuantity, 
  removeItem, 
  toggleFavorite,
  applyPromo
} = useCart()

const isPromoInputOpen = ref(false)
const inputCode = ref('')
const promoFeedback = ref('')

const formatPrice = (val) => {
  if (val === undefined || val === null) return '0,00 €'
  return val.toFixed(2).replace('.', ',') + ' €'
}

const onApplyPromo = () => {
  if (!inputCode.value.trim()) return
  const res = applyPromo(inputCode.value)
  promoFeedback.value = res.message
}

const handleCheckout = () => {
  alert(`✨ Order confirmed for ${formatPrice(totalCost.value)}! Thank you for shopping with Tiki Tiki.`)
}

onMounted(() => {
  window.scrollTo(0, 0)
})
</script>

<style scoped>
/* ========================================================= */
/* SHOPPING CART PAGE STYLING                                */
/* ========================================================= */
.cart-layout-container {
  background-color: #FAF8F5;
  min-height: 100vh;
  padding-top: 72px;
  padding-bottom: 60px;
}

.cart-page-heading {
  font-size: 1.85rem;
  letter-spacing: -0.02em;
  color: #111111;
}

/* ========================================================= */
/* LEFT: MAIN CART CARD                                      */
/* ========================================================= */
.cart-main-card {
  border-radius: 24px;
  border: 1px solid rgba(0, 0, 0, 0.04);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
}

.product-thumb-box {
  width: 72px;
  height: 72px;
  background-color: #ffffff;
  border-color: #e5e7eb !important;
}

.product-thumb-img {
  width: 58px;
  height: 58px;
}

.product-title {
  font-size: 0.95rem;
  line-height: 1.3;
}

.product-variant {
  font-size: 0.82rem;
  color: #6b7280 !important;
}

.icon-glyph {
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.15s ease;
}

.btn-icon-action:hover .icon-glyph {
  transform: scale(1.18);
}

/* Quantity Pill Box (- 1 +) */
.qty-pill-box {
  background-color: #FFF5EB;
  border: 1px solid #FFE4D0;
  width: 82px;
}

.btn-qty-action {
  color: #EA7A38;
  font-size: 0.95rem;
  line-height: 1;
  padding: 0 4px;
  cursor: pointer;
  transition: transform 0.12s ease;
}

.btn-qty-action:hover {
  transform: scale(1.2);
}

.qty-number {
  font-size: 0.88rem;
  color: #111111;
}

/* Price Styling */
.price-current {
  color: #DF5436;
  font-size: 1.05rem;
}

.price-original {
  font-size: 0.82rem;
  color: #9ca3af !important;
}

/* ========================================================= */
/* RIGHT: ORDER SUMMARY & PROMO                              */
/* ========================================================= */
.summary-card {
  border-radius: 24px;
  border: 1px solid rgba(0, 0, 0, 0.04);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
}

.summary-title {
  font-size: 1.25rem;
  letter-spacing: -0.01em;
}

/* Free Delivery Box */
.free-delivery-box {
  background-color: #EAF8F0;
}

.free-delivery-text {
  color: #2E7D32;
  font-size: 0.84rem;
}

.icon-clover {
  font-size: 0.95rem;
}

.free-progress-track {
  background-color: #c7eed6;
}

.bg-delivery-green {
  background-color: #2ECC71;
}

/* Order Primary Button */
.btn-order-orange {
  background-color: #EA7A38;
  color: #ffffff;
  font-size: 1rem;
  letter-spacing: 0.2px;
  transition: all 0.18s ease;
  cursor: pointer;
}

.btn-order-orange:hover:not(:disabled) {
  background-color: #D96928;
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(234, 122, 56, 0.28);
}

.btn-order-orange:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Promo Code Card */
.promo-card {
  border-radius: 18px;
  border: 1px solid rgba(0, 0, 0, 0.04);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.02);
}

.cursor-pointer {
  cursor: pointer;
}

.transition-transform {
  transition: transform 0.2s ease;
}

.rotate-90 {
  transform: rotate(90deg);
}

.btn-orange-primary {
  background-color: #EA7A38;
  color: #ffffff;
}

.btn-orange-primary:hover {
  background-color: #D96928;
  color: #ffffff;
}
</style>
