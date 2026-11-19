<template>
  <div class="cart-layout-container">
    <!-- Top Banner Header (Clean Split Hero staying side-by-side across all viewports) -->
    <section class="cart-hero-band border-bottom d-flex align-items-center">
      <div class="app-container py-2 py-md-3 w-100">
        <div class="cart-hero-row d-flex align-items-center justify-content-between">
          <div class="cart-hero-copy">
            <div class="cart-hero-accent mb-1 mb-sm-2" aria-hidden="true">
              <svg width="34" height="24" viewBox="0 0 34 24" fill="none">
                <path
                  d="M15.5 19.5C15.5 11.5 9.8 5.2 2.5 4.2C2.2 11.4 7.7 17.8 15.5 19.5Z"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M18.5 19.5C18.5 12.8 23.2 7.5 29.5 6.6C29.8 12.7 25.1 18.1 18.5 19.5Z"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <h1 class="cart-page-heading fw-bolder m-0 mb-1 mb-sm-2">{{ t('cart.heading') }}</h1>
            <nav aria-label="breadcrumb" class="cart-hero-breadcrumb text-muted d-flex flex-wrap align-items-center gap-1 gap-sm-2">
              <router-link to="/" class="breadcrumb-home-link text-decoration-none">{{ t('nav.home') }}</router-link>
              <span aria-hidden="true">›</span>
              <span class="fw-semibold cart-heading-text">{{ t('cart.heading') }}</span>
            </nav>
          </div>

          <div class="cart-hero-media ms-auto">
            <img
              src="/images/cart-basket-hero.jpg"
              width="1120"
              height="500"
              alt="Women's salon haircare and beauty essentials"
              class="cart-hero-img d-block"
            />
          </div>
        </div>
      </div>
    </section>

    <div class="app-container py-4 py-md-5">
      <div class="row g-4 align-items-start">
        <!-- LEFT COLUMN: INDIVIDUAL ITEM CARDS -->
        <div class="col-12 col-lg-8">
          <div v-if="cartItems.length > 0" class="d-flex flex-column gap-3">
            <article
              v-for="item in cartItems"
              :key="item.id"
              class="cart-item-card rounded-4 p-3 p-md-4 d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3"
            >
              <!-- Left: Thumbnail + Info -->
              <div class="cart-item-info d-flex align-items-center gap-3 flex-grow-1 min-w-0">
                <div class="product-thumb-box rounded-3 border flex-shrink-0 overflow-hidden">
                  <img :src="item.image" :alt="item.title" class="w-100 h-100 object-fit-cover d-block" />
                </div>

                <div class="d-flex flex-column flex-grow-1 min-w-0">
                  <h2 class="product-title fw-bold mb-1">{{ item.title }}</h2>
                  <div class="d-flex align-items-center gap-1 text-warning mb-1" aria-label="Rated 5 stars">
                    <Star v-for="n in 5" :key="n" :size="13" fill="currentColor" />
                  </div>
                  <span
                    class="stock-label fw-semibold"
                    :class="getItemStockInfo(item).isLow ? 'stock-low' : 'stock-in'"
                  >
                    {{ getItemStockInfo(item).label }}
                  </span>
                </div>
              </div>

              <!-- Middle: Quantity Stepper -->
              <div class="d-flex align-items-center justify-content-between justify-content-sm-end gap-4">
                <div class="qty-pill-box d-flex align-items-center justify-content-between rounded-3 px-2 py-1">
                  <button
                    type="button"
                    class="btn-qty-action border-0 bg-transparent fw-bold"
                    @click="decreaseQuantity(item.id)"
                    aria-label="Decrease quantity"
                  >
                    –
                  </button>
                  <span class="qty-number fw-bold px-2">{{ item.quantity }}</span>
                  <button
                    type="button"
                    class="btn-qty-action border-0 bg-transparent fw-bold"
                    @click="increaseQuantity(item.id)"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <!-- Right: Price + Delete -->
                <div class="d-flex align-items-center gap-3">
                  <span class="price-current fw-bold text-end" style="min-width: 78px;">
                    {{ formatPrice(item.price * item.quantity) }}
                  </span>

                  <button
                    type="button"
                    class="btn-delete-item rounded-3 border-0 d-flex align-items-center justify-content-center"
                    @click="handleRemoveItem(item)"
                    aria-label="Remove item"
                  >
                    <Trash2 :size="16" />
                  </button>
                </div>
              </div>
            </article>
          </div>

          <!-- Empty Cart State -->
          <div v-else class="cart-empty-card rounded-4 text-center py-5 px-4">
            <div class="fs-1 mb-2">🛒</div>
            <h5 class="fw-bold mb-1 cart-heading-text">{{ t('cart.emptyTitle') }}</h5>
            <p class="text-muted small mb-4">{{ t('cart.emptyDesc') }}</p>
            <router-link to="/products" class="btn-tnak-primary rounded-pill px-4 py-2 fw-semibold text-decoration-none d-inline-block">
              {{ t('cart.browseBtn') }}
            </router-link>
          </div>
        </div>

        <!-- RIGHT COLUMN: UNIFIED ORDER SUMMARY CARD -->
        <div class="col-12 col-lg-4">
          <div class="summary-card rounded-4 p-4">
            <h2 class="summary-title fw-bold mb-3">{{ t('cart.summaryTitle') }}</h2>

            <div class="d-flex flex-column gap-2 mb-3">
              <div class="d-flex justify-content-between align-items-center">
                <span class="text-muted small">
                  {{ t('cart.subtotal') }} ({{ totalQuantity }} {{ totalQuantity === 1 ? t('cart.itemSingular') : t('cart.itemPlural') }})
                </span>
                <span class="fw-semibold small cart-heading-text">{{ formatPrice(productsCost) }}</span>
              </div>

              <div class="d-flex justify-content-between align-items-center">
                <span class="text-muted small">{{ t('cart.deliveryCost') }}</span>
                <span class="fw-semibold small d-inline-flex align-items-center gap-1" :class="deliveryCost === 0 ? 'text-success' : 'cart-heading-text'">
                  <Truck v-if="deliveryCost === 0" :size="14" />
                  <span>{{ deliveryCost === 0 ? t('cart.free') : formatPrice(deliveryCost) }}</span>
                </span>
              </div>

              <div class="d-flex justify-content-between align-items-center">
                <span class="text-muted small">{{ t('cart.estimatedTax') }}</span>
                <span class="fw-semibold small cart-heading-text">{{ formatPrice(estimatedTax) }}</span>
              </div>

              <div class="d-flex justify-content-between align-items-center text-success">
                <span class="small d-flex align-items-center gap-2">
                  <span>{{ t('cart.discount') }}{{ isPromoApplied ? ` (${promoCode})` : '' }}</span>
                  <button v-if="isPromoApplied" type="button" class="btn btn-link btn-sm p-0 text-danger small" @click="onRemovePromo">
                    {{ t('cart.removePromo') }}
                  </button>
                </span>
                <span class="fw-semibold small">-{{ formatPrice(promoDiscount) }}</span>
              </div>
            </div>

            <div class="main-divider my-3"></div>

            <!-- Total -->
            <div class="d-flex justify-content-between align-items-center mb-3">
              <span class="fs-5 fw-bold cart-heading-text">{{ t('cart.total') }}</span>
              <span class="fs-4 fw-bolder cart-heading-text">{{ formatPrice(grandTotal) }}</span>
            </div>

            <!-- Promo Code Tinted Box -->
            <div class="promo-code-box rounded-3 p-3 mb-3">
              <label for="cart-promo-input" class="promo-box-label d-block fw-bold mb-2">
                {{ t('cart.promoLabel') }}
              </label>
              <div class="d-flex gap-2">
                <input
                  id="cart-promo-input"
                  type="text"
                  v-model="inputCode"
                  :placeholder="t('cart.promoPlaceholder')"
                  class="form-control form-control-sm rounded-2 text-uppercase font-monospace promo-input"
                />
                <button
                  type="button"
                  class="btn-promo-apply rounded-2 px-3 py-1 small fw-semibold flex-shrink-0"
                  @click="onApplyPromo"
                >
                  {{ t('cart.apply') }}
                </button>
              </div>
              <p v-if="promoFeedback" class="small mt-2 mb-0 fw-medium" :class="isPromoApplied ? 'text-success' : 'text-danger'">
                {{ promoFeedback }}
              </p>
            </div>

            <!-- Free Delivery Progress -->
            <div class="free-delivery-box rounded-3 mb-3">
              <div class="d-flex align-items-center gap-2 mb-2">
                <span v-if="awayFromFreeDelivery > 0" class="free-delivery-text fw-semibold">
                  ☘️ {{ formatPrice(awayFromFreeDelivery) }} {{ t('cart.awayFromFree') }}
                </span>
                <span v-else class="free-delivery-text fw-semibold text-success">
                  🎉 {{ t('cart.unlockedFree') }}
                </span>
              </div>
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

            <!-- Checkout CTA -->
            <button
              type="button"
              class="btn-order-orange w-100 rounded-3 fw-bold"
              :disabled="cartItems.length === 0"
              @click="openCheckoutModal"
            >
              {{ t('cart.checkoutBtn') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- CHECKOUT MODAL -->
    <BaseModal v-model="isCheckoutModalOpen" title="Complete Your Order" size="md">
      <form @submit.prevent="confirmOrder">
        <div class="mb-3">
          <label class="form-label fw-semibold small">Fulfillment Option</label>
          <div class="d-flex gap-2">
            <button
              type="button"
              class="flex-grow-1 p-2 rounded-3 border text-start small fw-semibold"
              :class="checkoutForm.deliveryType === 'delivery' ? 'border-primary bg-primary bg-opacity-10 text-primary' : 'bg-transparent'"
              @click="checkoutForm.deliveryType = 'delivery'"
            >
              🚚 Home Delivery ({{ deliveryCost === 0 ? 'Free' : formatPrice(deliveryCost) }})
            </button>
            <button
              type="button"
              class="flex-grow-1 p-2 rounded-3 border text-start small fw-semibold"
              :class="checkoutForm.deliveryType === 'pickup' ? 'border-primary bg-primary bg-opacity-10 text-primary' : 'bg-transparent'"
              @click="checkoutForm.deliveryType = 'pickup'"
            >
              🏪 Salon Pickup (Free)
            </button>
          </div>
        </div>

        <div class="row g-3 mb-3">
          <div class="col-md-6">
            <BaseInput v-model="checkoutForm.customerName" label="Full Name" required />
          </div>
          <div class="col-md-6">
            <BaseInput v-model="checkoutForm.customerPhone" label="Phone Number" type="tel" required />
          </div>
        </div>

        <div v-if="checkoutForm.deliveryType === 'delivery'" class="mb-3">
          <BaseSelect
            v-if="addresses.length"
            v-model="selectedAddressId"
            label="Saved Delivery Address"
            :options="[
              ...addresses.map(a => ({ label: `${a.label}: ${a.street}, ${a.city}`, value: a.id })),
              { label: '+ Enter new street address', value: 'custom' }
            ]"
            class="mb-2"
          />
          <BaseInput
            v-model="checkoutForm.address"
            label="Street Address"
            placeholder="House/Apt, Street, District"
            required
          />
        </div>

        <div class="mb-3">
          <BaseSelect
            v-model="checkoutForm.paymentMethod"
            label="Payment Method"
            required
            :options="[
              { label: 'Visa / Credit Card (•••• 4242)', value: 'Credit Card (Visa)' },
              { label: 'ABA PayWay QR', value: 'ABA PayWay' },
              { label: 'Apple Pay', value: 'Apple Pay' },
              { label: 'Cash on Delivery', value: 'Cash on Delivery' }
            ]"
          />
        </div>

        <div class="p-3 rounded-3 mb-3 border" style="background: var(--surface-ground);">
          <div class="d-flex justify-content-between small mb-1">
            <span class="text-muted">Items ({{ totalQuantity }})</span>
            <span class="fw-semibold">{{ formatPrice(productsCost) }}</span>
          </div>
          <div class="d-flex justify-content-between small mb-1">
            <span class="text-muted">Tax (5%)</span>
            <span class="fw-semibold">{{ formatPrice(estimatedTax) }}</span>
          </div>
          <div class="d-flex justify-content-between small mb-1" v-if="isPromoApplied">
            <span class="text-success">Promo ({{ promoCode }})</span>
            <span class="text-success fw-semibold">-{{ formatPrice(promoDiscount) }}</span>
          </div>
          <div class="d-flex justify-content-between small mb-2">
            <span class="text-muted">Shipping</span>
            <span class="fw-semibold">{{ finalShipping === 0 ? 'Free' : formatPrice(finalShipping) }}</span>
          </div>
          <div class="d-flex justify-content-between pt-2 border-top fw-bold">
            <span>Total Due</span>
            <span class="text-primary fs-5">{{ formatPrice(finalOrderTotal) }}</span>
          </div>
        </div>

        <div class="d-flex justify-content-end gap-2">
          <BaseButton type="button" variant="outline-secondary" @click="isCheckoutModalOpen = false">
            Cancel
          </BaseButton>
          <BaseButton type="submit" variant="primary">
            Place Order ({{ formatPrice(finalOrderTotal) }})
          </BaseButton>
        </div>
      </form>
    </BaseModal>

    <!-- ORDER SUCCESS MODAL -->
    <BaseModal v-model="isSuccessModalOpen" title="Order Confirmed!" size="sm">
      <div class="text-center py-2">
        <div class="mb-3 text-success">
          <CheckCircle2 :size="52" class="mx-auto" />
        </div>
        <h5 class="fw-bold mb-1">Thank you, {{ lastPlacedOrder?.customerName }}!</h5>
        <p class="small text-muted mb-3">
          Your order <strong>{{ lastPlacedOrder?.orderNumber }}</strong> totaling
          <strong class="text-primary">{{ formatPrice(lastPlacedOrder?.total) }}</strong> has been received.
        </p>
        <div class="d-flex gap-2">
          <BaseButton variant="outline-secondary" class="flex-grow-1" @click="goToProducts">
            Shop More
          </BaseButton>
          <BaseButton variant="primary" class="flex-grow-1" @click="goToOrders">
            View Order History
          </BaseButton>
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Star, Trash2, Truck, CheckCircle2 } from '@lucide/vue'
import { useCart } from '../../../composables/useCart'
import { useProducts } from '../../../composables/useProducts'
import { useAdmin } from '../../../composables/useAdmin'
import { useProfile } from '../../../composables/useProfile'
import { useI18n } from '../../../composables/useI18n'
import { useToastStore } from '../../../stores/toast'

const router = useRouter()
const toastStore = useToastStore()
const { t } = useI18n()
const { products } = useProducts()
const { addOrder } = useAdmin()
const { account, pets, addresses, defaultAddress } = useProfile()

const getItemStockInfo = (item) => {
  const found = products.value.find(p => p.id === item.id)
  if (found && typeof found.stock === 'number' && found.stock <= 15) {
    return {
      isLow: true,
      label: t('cart.onlyLeft').replace('{count}', String(found.stock))
    }
  }
  return {
    isLow: false,
    label: t('products.inStock')
  }
}

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
  clearCart,
  applyPromo,
  removePromo
} = useCart()

const inputCode = ref('')
const promoFeedback = ref('')

const estimatedTax = computed(() => Number((productsCost.value * 0.05).toFixed(2)))
const grandTotal = computed(() => Math.max(0, totalCost.value + estimatedTax.value))

const isCheckoutModalOpen = ref(false)
const isSuccessModalOpen = ref(false)
const lastPlacedOrder = ref(null)
const selectedAddressId = ref(defaultAddress.value?.id || 'custom')

const checkoutForm = reactive({
  deliveryType: 'delivery',
  customerName: account.value.name || '',
  customerPhone: account.value.phone || '',
  address: defaultAddress.value ? `${defaultAddress.value.street}, ${defaultAddress.value.city}` : '',
  paymentMethod: 'Credit Card (Visa)'
})

watch(selectedAddressId, (val) => {
  if (val === 'custom') {
    checkoutForm.address = ''
  } else {
    const addr = addresses.value.find(a => a.id === val)
    if (addr) {
      checkoutForm.address = `${addr.street}, ${addr.city}`
    }
  }
})

const finalShipping = computed(() => (checkoutForm.deliveryType === 'pickup' ? 0 : deliveryCost.value))
const finalOrderTotal = computed(() => {
  const discounted = Math.max(0, productsCost.value - promoDiscount.value)
  return discounted + estimatedTax.value + finalShipping.value
})

const formatPrice = (val) => {
  if (val === undefined || val === null) return '$0.00'
  return '$' + Number(val).toFixed(2)
}

const onApplyPromo = () => {
  if (!inputCode.value.trim()) return
  const res = applyPromo(inputCode.value)
  promoFeedback.value = res.message
  toastStore.showToast(res.message, res.success ? 'success' : 'danger')
}

const onRemovePromo = () => {
  removePromo()
  promoFeedback.value = ''
  inputCode.value = ''
  toastStore.showToast('Promo code removed.', 'info')
}

const handleRemoveItem = (item) => {
  removeItem(item.id)
  toastStore.showToast(`Removed ${item.title} from bag.`, 'info')
}

const openCheckoutModal = () => {
  checkoutForm.customerName = account.value.name || ''
  checkoutForm.customerPhone = account.value.phone || ''
  if (defaultAddress.value) {
    selectedAddressId.value = defaultAddress.value.id
    checkoutForm.address = `${defaultAddress.value.street}, ${defaultAddress.value.city}`
  }
  isCheckoutModalOpen.value = true
}

const confirmOrder = () => {
  const newOrder = addOrder({
    customerName: checkoutForm.customerName,
    customerEmail: account.value.email || 'guest@example.com',
    customerPhone: checkoutForm.customerPhone,
    petName: pets.value[0] ? `${pets.value[0].name} (${pets.value[0].breed})` : 'Beauty Care',
    items: cartItems.value.map(i => ({
      name: i.title,
      quantity: i.quantity,
      price: i.price
    })),
    subtotal: Number(productsCost.value.toFixed(2)),
    discount: Number(promoDiscount.value.toFixed(2)),
    shippingFee: Number(finalShipping.value.toFixed(2)),
    total: Number(finalOrderTotal.value.toFixed(2)),
    status: 'Processing',
    paymentStatus: checkoutForm.paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Paid',
    paymentMethod: checkoutForm.paymentMethod,
    address: checkoutForm.deliveryType === 'pickup' ? 'Salon Pickup — 42 Orchid Blossom Ave' : checkoutForm.address
  })

  lastPlacedOrder.value = newOrder
  clearCart()
  isCheckoutModalOpen.value = false
  isSuccessModalOpen.value = true
  toastStore.showToast(`Order ${newOrder.orderNumber} placed successfully!`, 'success')
}

const goToProducts = () => {
  isSuccessModalOpen.value = false
  router.push('/products')
}

const goToOrders = () => {
  isSuccessModalOpen.value = false
  router.push('/profile#orders')
}

onMounted(() => {
  window.scrollTo(0, 0)
})
</script>

<style scoped>
.cart-layout-container {
  background-color: color-mix(in srgb, var(--storefront-bg, #f4f6f9) 76%, transparent);
  min-height: 100vh;
  padding-top: 0;
  padding-bottom: 60px;
}

.cart-hero-band {
  padding-top: 68px;
  padding-bottom: 12px;
  min-height: clamp(148px, 24vw, 260px);
  background-color: var(--storefront-surface, #ffffff);
  border-color: var(--border-clr, #e2e8f0) !important;
}

.cart-hero-row {
  gap: clamp(10px, 2.5vw, 24px);
}

.cart-hero-copy {
  flex: 1 1 0;
  min-inline-size: 0;
}

.cart-hero-accent {
  color: var(--primary-color, #EA7A38);
  line-height: 1;
}

.cart-hero-accent svg {
  inline-size: clamp(22px, 3.2vw, 34px);
  block-size: auto;
  display: block;
}

.cart-page-heading {
  color: var(--primary-color, #EA7A38);
  font-size: clamp(1rem, 3.2vw, 2.5rem);
  letter-spacing: -0.025em;
  line-height: 1.25;
  overflow-wrap: break-word;
}

.cart-hero-breadcrumb {
  font-size: clamp(0.72rem, 1.15vw, 0.875rem);
}

.breadcrumb-home-link {
  color: var(--secondary-color, #64748b);
  transition: color 0.16s ease;
}

.breadcrumb-home-link:hover {
  color: var(--primary-color, #EA7A38);
}

.cart-hero-media {
  flex-shrink: 0;
  inline-size: clamp(160px, 47%, 420px);
  max-inline-size: 100%;
}

.cart-hero-img {
  inline-size: 100%;
  block-size: auto;
  aspect-ratio: 1120 / 500;
  max-block-size: 195px;
  object-fit: contain;
  mix-blend-mode: multiply;
}

[data-theme='dark'] .cart-hero-media {
  background-color: #ffffff;
  border-radius: clamp(10px, 1.8vw, 18px);
  padding: clamp(4px, 0.8vw, 6px) clamp(8px, 1.4vw, 14px);
  border: var(--border-width, 1.5px) solid var(--border-clr);
}

[data-theme='dark'] .cart-hero-img {
  mix-blend-mode: normal;
  max-block-size: 175px;
}

.cart-heading-text,
.product-title,
.summary-title {
  color: var(--text-heading-color, #0f172a);
}

.summary-title {
  font-size: 1.2rem;
}

.cart-item-card,
.cart-empty-card,
.summary-card {
  background-color: var(--storefront-surface, #ffffff);
  border: var(--border-width, 1.5px) solid var(--border-clr, #e2e8f0);
  box-shadow: none !important;
  transition: border-color 0.18s ease;
}

.summary-card {
  position: sticky;
  top: 78px;
}

@media (max-width: 991px) {
  .summary-card {
    position: static;
  }
}

.cart-item-card {
  min-inline-size: 0;
  max-inline-size: 100%;
  overflow: hidden;
}

.cart-item-info {
  inline-size: 100%;
  min-inline-size: 0;
  max-inline-size: 100%;
}

.cart-item-card:hover {
  border-color: var(--border-hover-color);
}

.product-thumb-box {
  width: 76px;
  height: 76px;
  background-color: var(--surface-ground, #f1f5f9);
  border-color: var(--border-clr, #e2e8f0) !important;
}

.product-title {
  font-size: 0.98rem;
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  overflow-wrap: anywhere;
}

.stock-label {
  font-size: 0.76rem;
}

.stock-in {
  color: var(--success-color, #0d9467);
}

.stock-low {
  color: var(--warning-color, #d97706);
}

.qty-pill-box {
  background-color: var(--storefront-surface, #ffffff);
  border: var(--border-width, 1.5px) solid var(--border-clr, #e2e8f0);
  width: 100px;
  height: 36px;
}

.btn-qty-action {
  color: var(--primary-color, #EA7A38);
  font-size: 1.05rem;
  line-height: 1;
  padding: 4px 7px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.btn-qty-action:hover {
  background-color: var(--primary-color-soft);
}

.qty-number {
  font-size: 0.92rem;
  color: var(--text-heading-color, #0f172a);
}

.price-current {
  color: var(--text-heading-color, #0f172a);
  font-size: 1.05rem;
}

.btn-delete-item {
  width: 34px;
  height: 34px;
  background-color: transparent;
  color: var(--danger-color, #ef4444);
  transition: background-color 0.15s ease, color 0.15s ease;
}

.btn-delete-item:hover {
  background-color: rgba(239, 68, 68, 0.12);
  color: var(--danger-color, #ef4444);
}

.promo-code-box {
  background-color: var(--primary-color-soft);
  border: 1.5px solid var(--primary-color-border);
}

.promo-box-label {
  color: var(--primary-color, #EA7A38);
  font-size: 0.84rem;
}

.promo-input {
  background-color: var(--storefront-surface, #ffffff);
}

.btn-promo-apply {
  background-color: var(--storefront-surface, #ffffff);
  border: var(--border-width, 1.5px) solid var(--primary-color-border);
  color: var(--primary-color, #EA7A38);
  transition: background-color 0.16s ease, color 0.16s ease, border-color 0.16s ease;
  cursor: pointer;
}

.btn-promo-apply:hover {
  background-color: var(--primary-color, #EA7A38);
  border-color: var(--primary-color, #EA7A38);
  color: #ffffff;
}

.free-delivery-box {
  background-color: rgba(13, 148, 103, 0.08);
  border: 1px solid rgba(13, 148, 103, 0.22);
  padding: 10px 12px;
}

.free-delivery-text {
  color: var(--success-color, #0d9467);
  font-size: 0.8rem;
}

.free-progress-track {
  background-color: rgba(13, 148, 103, 0.18);
}

.bg-delivery-green {
  background-color: var(--success-color, #0d9467);
}

.btn-order-orange {
  background-color: var(--primary-color, #EA7A38);
  border: var(--border-width, 1.5px) solid var(--primary-color, #EA7A38);
  color: #ffffff;
  font-size: 0.95rem;
  padding: 11px 16px;
  transition: background-color 0.18s ease, border-color 0.18s ease;
  cursor: pointer;
  box-shadow: none !important;
}

.btn-order-orange:hover:not(:disabled) {
  background-color: var(--primary-color-dark, #D46222);
  border-color: var(--primary-color-dark, #D46222);
}

.btn-order-orange:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
