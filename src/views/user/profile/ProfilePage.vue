<template>
  <div class="profile-layout-container position-relative">
    <div class="bg-decorative-blob blob-bottom-right pointer-events-none" aria-hidden="true"></div>

    <div class="app-container position-relative z-1 pt-3 pb-5">
      <!-- Breadcrumb & Title -->
      <div class="profile-header-group mb-3">
        <nav class="breadcrumb-nav mb-1" aria-label="breadcrumb">
          <router-link to="/" class="breadcrumb-link d-inline-flex align-items-center gap-1 text-decoration-none">
            <span class="text-muted">‹ {{ t('nav.home') }}</span>
            <span class="text-muted opacity-50">/</span>
            <span class="heading-text fw-semibold">{{ t('profile.title') }}</span>
          </router-link>
        </nav>
        <h1 class="page-title fw-bolder m-0">{{ t('profile.title') }}</h1>
      </div>

      <div class="profile-columns-layout d-flex flex-column flex-lg-row align-items-start">
        <!-- LEFT SIDEBAR -->
        <aside class="profile-sidebar-column flex-shrink-0">
          <div class="profile-nav-card">
            <nav aria-label="Profile sections" class="d-flex flex-column">
              <button
                v-for="item in sidebarItems"
                :key="item.id"
                type="button"
                class="profile-sidebar-item border-0 text-start"
                :class="{ active: activeSection === item.id, 'support-highlight-item': item.id === 'support' }"
                @click="scrollToSection(item.id)"
              >
                <span class="nav-icon">{{ item.emoji }}</span>
                <span class="item-text">{{ item.label }}</span>
              </button>

              <div class="sidebar-spacer"></div>

              <button
                type="button"
                class="profile-sidebar-item logout-item border-0 text-start"
                @click="showLogoutModal = true"
              >
                <span class="nav-icon text-danger">🚪</span>
                <span class="item-text text-danger">{{ t('profile.logout') }}</span>
              </button>
            </nav>
          </div>
        </aside>

        <!-- RIGHT CONTENT CARDS -->
        <main class="profile-cards-column flex-grow-1 w-100">
          <!-- 1. ACCOUNT -->
          <section id="account" class="ref-card mb-4">
            <h2 class="ref-card-title fw-bold mb-4">{{ t('profile.account') }}</h2>
            <div class="d-flex align-items-start gap-4 flex-wrap">
              <img
                :src="account.avatar"
                :alt="account.name"
                class="account-avatar rounded-circle object-fit-cover flex-shrink-0 border"
              />
              <div class="d-flex flex-column">
                <div class="d-flex align-items-center gap-2 mb-1">
                  <strong class="account-name fw-bold">{{ account.name }}</strong>
                  <span class="pet-badge-orange fw-semibold">{{ account.tier || 'VIP' }}</span>
                </div>
                <span class="account-meta text-muted mb-1">{{ account.email }}</span>
                <span class="account-meta text-muted mb-3">{{ account.phone }}</span>

                <div>
                  <button
                    type="button"
                    class="btn-edit-badge d-inline-flex align-items-center gap-1 border-0 fw-semibold"
                    @click="openEditAccountModal"
                  >
                    <span>✏️</span>
                    <span>Edit Profile</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          <!-- 2. BEAUTY PROFILE -->
          <section id="pets" class="ref-card mb-4">
            <h2 class="ref-card-title fw-bold mb-3">{{ t('profile.pets') }}</h2>

            <div v-if="showPetBanner" class="ref-green-banner d-flex align-items-center justify-content-between gap-3 mb-4">
              <span class="green-banner-text">
                This helps us recommend tailored haircare, botanical facials, and salon styling treatments for your hair &amp; skin ✨
              </span>
              <button
                type="button"
                class="btn-close-green-circle border-0 d-flex align-items-center justify-content-center flex-shrink-0"
                @click="showPetBanner = false"
                aria-label="Dismiss tip"
              >
                ✕
              </button>
            </div>

            <div class="d-flex flex-column gap-3 mb-3">
              <div v-for="pet in pets" :key="pet.id" class="pet-inner-box">
                <div class="d-flex flex-column flex-sm-row align-items-start gap-3 gap-md-4">
                  <img
                    :src="pet.photo"
                    :alt="pet.name"
                    class="pet-photo rounded-4 object-fit-cover flex-shrink-0"
                    style="object-position: center 20%;"
                  />

                  <div class="flex-grow-1 w-100">
                    <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-2">
                      <h3 class="pet-title fw-bold m-0">{{ pet.name }}</h3>
                      <div class="d-flex align-items-center gap-2">
                        <router-link to="/booking" class="btn-edit-badge text-decoration-none fw-semibold">
                          ✨ Book Salon
                        </router-link>
                        <button
                          type="button"
                          class="btn-edit-badge border-0 fw-semibold"
                          @click="openEditPetModal(pet)"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          type="button"
                          class="btn btn-sm btn-outline-danger rounded-3 py-1 px-2"
                          aria-label="Delete beauty profile"
                          @click="confirmDeletePet(pet)"
                        >
                          <Trash2 :size="13" />
                        </button>
                      </div>
                    </div>

                    <div class="d-flex flex-wrap align-items-center gap-2 mb-3">
                      <span class="pet-badge-orange fw-semibold">{{ pet.breed }}</span>
                      <span class="pet-badge-white">{{ pet.type }}</span>
                      <span class="pet-badge-white">{{ pet.age }}</span>
                      <span class="pet-badge-white">{{ pet.gender }}</span>
                    </div>

                    <div class="attributes-grid d-flex flex-wrap gap-2">
                      <div class="attribute-pill-box d-flex align-items-center gap-2">
                        <span>💇‍♀️</span>
                        <div>
                          <span class="attr-label d-block">Hair Length</span>
                          <strong class="attr-value d-block">{{ pet.weight }}</strong>
                        </div>
                      </div>
                      <div class="attribute-pill-box d-flex align-items-center gap-2">
                        <span>✨</span>
                        <div>
                          <span class="attr-label d-block">Care Focus</span>
                          <strong class="attr-value d-block">{{ pet.size }}</strong>
                        </div>
                      </div>
                      <div class="attribute-pill-box d-flex align-items-center gap-2">
                        <span>🌿</span>
                        <div>
                          <span class="attr-label d-block">Formula</span>
                          <strong class="attr-value d-block text-truncate" style="max-width: 110px;">{{ pet.diet }}</strong>
                        </div>
                      </div>
                      <div class="attribute-pill-box d-flex align-items-center gap-2">
                        <span>🌸</span>
                        <div>
                          <span class="attr-label d-block">Preferences</span>
                          <strong class="attr-value d-block text-truncate" style="max-width: 120px;">{{ pet.specialNeeds }}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button type="button" class="btn-add-another-pet d-inline-flex align-items-center gap-1" @click="openAddPetModal">
              <span>+ Add another beauty profile</span>
            </button>
          </section>

          <!-- 3. VOUCHERS -->
          <section id="vouchers" class="ref-card mb-4">
            <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-4">
              <h2 class="ref-card-title fw-bold m-0">{{ t('profile.vouchers') }}</h2>
              <button type="button" class="btn-voucher-orange border-0 fw-semibold" @click="showVoucherModal = true">
                + Claim Voucher
              </button>
            </div>

            <div v-if="vouchers.length" class="row g-3">
              <div v-for="v in vouchers" :key="v.id" class="col-12 col-md-6">
                <div class="voucher-item-card p-3 rounded-4 border h-100 d-flex flex-column justify-content-between">
                  <div>
                    <div class="d-flex align-items-center justify-content-between mb-2">
                      <span class="badge bg-orange-soft text-orange fw-bold px-2 py-1">{{ v.code }}</span>
                      <span class="small text-muted">Min ${{ v.minSpend }}</span>
                    </div>
                    <h3 class="h6 fw-bold mb-1 heading-text">{{ v.title }}</h3>
                    <p class="text-muted small mb-3">{{ v.description }}</p>
                  </div>
                  <div class="d-flex align-items-center justify-content-between pt-2 border-top">
                    <span class="text-muted" style="font-size: 0.74rem;">Expires {{ v.expiresAt }}</span>
                    <button type="button" class="btn-edit-badge border-0 fw-semibold" @click="applyVoucherToCart(v.code)">
                      Use in Cart →
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="text-center py-4 text-muted small">
              No active vouchers yet. Claim <code>TIKIWELCOME</code> for $15 off!
            </div>
          </section>

          <!-- 4. ORDER HISTORY -->
          <section id="orders" class="ref-card mb-4">
            <div class="d-flex align-items-center justify-content-between mb-4">
              <h2 class="ref-card-title fw-bold m-0">{{ t('profile.orders') }}</h2>
              <span class="badge bg-orange-soft text-orange fw-bold px-2 py-1 rounded-pill">{{ customerOrders.length }} orders</span>
            </div>

            <div v-if="customerOrders.length" class="d-flex flex-column gap-3">
              <div v-for="ord in customerOrders" :key="ord.id" class="pet-inner-box border">
                <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 pb-2 mb-2 border-bottom">
                  <div>
                    <strong class="heading-text">{{ ord.orderNumber }}</strong>
                    <span class="text-muted small ms-2">{{ formatDate(ord.createdAt) }}</span>
                  </div>
                  <div class="d-flex align-items-center gap-2">
                    <BaseBadge :status="ord.status" size="sm" />
                    <span class="fw-bold text-primary">${{ Number(ord.total).toFixed(2) }}</span>
                  </div>
                </div>

                <ul class="list-unstyled small text-muted mb-2">
                  <li v-for="item in ord.items" :key="item.name" class="d-flex justify-content-between">
                    <span>{{ item.quantity }}× {{ item.name }}</span>
                    <span>${{ (item.price * item.quantity).toFixed(2) }}</span>
                  </li>
                </ul>

                <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 pt-2 border-top small">
                  <span class="text-muted">{{ ord.paymentMethod }} · {{ ord.address }}</span>
                  <router-link to="/products" class="text-primary fw-semibold text-decoration-none">
                    Shop Again →
                  </router-link>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-4 text-muted small">
              You haven't placed any store orders yet.
            </div>
          </section>

          <!-- 5. MY ADDRESSES -->
          <section id="addresses" class="ref-card mb-4">
            <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-4">
              <h2 class="ref-card-title fw-bold m-0">{{ t('profile.addresses') }}</h2>
              <button type="button" class="btn-add-another-pet" @click="openAddAddressModal">
                + Add Address
              </button>
            </div>

            <div class="row g-3">
              <div v-for="addr in addresses" :key="addr.id" class="col-12 col-md-6">
                <div class="pet-inner-box h-100 border d-flex flex-column justify-content-between">
                  <div>
                    <div class="d-flex align-items-center justify-content-between mb-2">
                      <span class="fw-bold heading-text">{{ addr.label }}</span>
                      <span v-if="addr.isDefault" class="pet-badge-orange fw-semibold">Default</span>
                    </div>
                    <p class="small mb-1 fw-semibold">{{ addr.recipient }} · {{ addr.phone }}</p>
                    <p class="small text-muted mb-2">{{ addr.street }}, {{ addr.city }} {{ addr.postalCode }}</p>
                    <p v-if="addr.notes" class="text-muted mb-3" style="font-size: 0.75rem;">Note: {{ addr.notes }}</p>
                  </div>
                  <div class="d-flex align-items-center gap-2 pt-2 border-top">
                    <button
                      v-if="!addr.isDefault"
                      type="button"
                      class="btn-edit-badge border-0 fw-semibold"
                      @click="makeDefaultAddress(addr.id)"
                    >
                      Set Default
                    </button>
                    <button
                      type="button"
                      class="btn btn-sm btn-outline-danger rounded-3 ms-auto"
                      @click="removeAddress(addr.id)"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- 6. BILLING INFORMATION -->
          <section id="billing" class="ref-card mb-4">
            <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-4">
              <h2 class="ref-card-title fw-bold m-0">{{ t('profile.billing') }}</h2>
              <button type="button" class="btn-add-another-pet" @click="showBillingModal = true">
                + Add Payment Method
              </button>
            </div>

            <div class="row g-3">
              <div v-for="method in billingMethods" :key="method.id" class="col-12 col-md-6">
                <div class="pet-inner-box h-100 border d-flex flex-column justify-content-between">
                  <div>
                    <div class="d-flex align-items-center justify-content-between mb-2">
                      <span class="fw-bold heading-text">💳 {{ method.brand }} •••• {{ method.last4 }}</span>
                      <span v-if="method.isDefault" class="pet-badge-orange fw-semibold">Default</span>
                    </div>
                    <p class="small text-muted mb-2">{{ method.holder }} · Exp {{ method.expiry }}</p>
                  </div>
                  <div class="d-flex align-items-center gap-2 pt-2 border-top">
                    <button
                      v-if="!method.isDefault"
                      type="button"
                      class="btn-edit-badge border-0 fw-semibold"
                      @click="makeDefaultBilling(method.id)"
                    >
                      Set Default
                    </button>
                    <button
                      type="button"
                      class="btn btn-sm btn-outline-danger rounded-3 ms-auto"
                      @click="removeBilling(method.id)"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- 7. SUPPORT -->
          <section id="support" class="ref-card">
            <h2 class="ref-card-title fw-bold mb-2">{{ t('profile.support') }}</h2>
            <p class="text-muted small mb-4">
              Need help with a salon appointment, haircare or skincare advice, or order delivery? Send a note to our beauty concierge.
            </p>

            <form @submit.prevent="submitSupportForm" class="mb-4">
              <div class="row g-3 mb-3">
                <div class="col-md-6">
                  <BaseInput v-model="supportForm.subject" label="Subject" placeholder="e.g. Botanical serum recommendation" required />
                </div>
                <div class="col-md-6">
                  <BaseSelect
                    v-model="supportForm.topic"
                    label="Topic"
                    :options="[
                      { label: 'Salon Appointment', value: 'Appointment' },
                      { label: 'Store Order & Delivery', value: 'Order' },
                      { label: 'Hair & Skin Care Advice', value: 'Skincare' },
                      { label: 'Billing & Vouchers', value: 'Billing' }
                    ]"
                  />
                </div>
              </div>
              <div class="mb-3">
                <BaseInput
                  type="textarea"
                  :rows="3"
                  v-model="supportForm.message"
                  label="Message"
                  placeholder="Tell us how we can elevate your beauty and salon experience..."
                  required
                />
              </div>
              <BaseButton type="submit" variant="primary">Send Support Request</BaseButton>
            </form>

            <div v-if="supportTickets.length" class="pt-3 border-top">
              <h3 class="h6 fw-bold mb-2 heading-text">Recent Support Requests</h3>
              <div class="d-flex flex-column gap-2">
                <div v-for="tkt in supportTickets" :key="tkt.id" class="p-3 rounded-3 border d-flex justify-content-between align-items-center">
                  <div>
                    <div class="fw-semibold small heading-text">{{ tkt.subject }}</div>
                    <div class="text-muted" style="font-size: 0.75rem;">{{ tkt.topic }} · #{{ tkt.id }}</div>
                  </div>
                  <BaseBadge :status="tkt.status" size="sm" />
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>

    <!-- EDIT ACCOUNT MODAL -->
    <BaseModal v-model="isEditAccountModalOpen" title="Edit Account Details" size="sm">
      <form @submit.prevent="saveAccountDetails">
        <div class="d-flex flex-column gap-3 mb-4">
          <BaseInput v-model="editAccountForm.name" label="Full Name" required />
          <BaseInput v-model="editAccountForm.email" label="Email Address" type="email" required />
          <BaseInput v-model="editAccountForm.phone" label="Phone Number" type="tel" required />
          <BaseInput v-model="editAccountForm.avatar" label="Avatar URL" placeholder="https://..." />
        </div>
        <div class="d-flex justify-content-end gap-2">
          <BaseButton type="button" variant="outline-secondary" @click="isEditAccountModalOpen = false">Cancel</BaseButton>
          <BaseButton type="submit" variant="primary">Save Changes</BaseButton>
        </div>
      </form>
    </BaseModal>

    <!-- EDIT / ADD BEAUTY PROFILE MODAL -->
    <BaseModal v-model="isPetModalOpen" :title="editingPetId ? 'Edit Beauty Profile' : 'Add Beauty Profile'" size="md">
      <form @submit.prevent="savePetDetails">
        <div class="row g-3 mb-4">
          <div class="col-12 col-sm-6">
            <BaseInput v-model="petForm.name" label="Profile Name" required placeholder="e.g. Everyday Glow & Waves" />
          </div>
          <div class="col-12 col-sm-6">
            <BaseInput v-model="petForm.breed" label="Hair Texture" required placeholder="e.g. Wavy • Medium" />
          </div>
          <div class="col-6">
            <BaseSelect
              v-model="petForm.type"
              label="Focus Area"
              :options="[
                { label: 'Hair & Skin', value: 'Hair & Skin' },
                { label: 'Color & Styling', value: 'Color & Styling' },
                { label: 'Nails & Facial', value: 'Nails & Facial' }
              ]"
            />
          </div>
          <div class="col-6">
            <BaseSelect
              v-model="petForm.gender"
              label="Undertone"
              :options="[
                { label: 'Warm Neutral', value: 'Warm Neutral' },
                { label: 'Cool Rosy', value: 'Cool Rosy' },
                { label: 'Golden Olive', value: 'Golden Olive' }
              ]"
            />
          </div>
          <div class="col-6">
            <BaseInput v-model="petForm.age" label="Skin Type" placeholder="e.g. Combination Skin" />
          </div>
          <div class="col-6">
            <BaseInput v-model="petForm.weight" label="Hair Length" placeholder="e.g. Long Length" />
          </div>
          <div class="col-6">
            <BaseSelect
              v-model="petForm.size"
              label="Care Focus"
              :options="[
                { label: 'Hydration Focus', value: 'Hydration Focus' },
                { label: 'Volume & Shine', value: 'Volume & Shine' },
                { label: 'Keratin Repair', value: 'Keratin Repair' },
                { label: 'Glass-Skin Glow', value: 'Glass-Skin Glow' }
              ]"
            />
          </div>
          <div class="col-6">
            <BaseInput v-model="petForm.diet" label="Formula Preference" placeholder="e.g. Sulfate-Free Botanical" />
          </div>
          <div class="col-12">
            <BaseInput v-model="petForm.specialNeeds" label="Sensitivities & Notes" placeholder="e.g. Heat protection & gentle fragrance" />
          </div>
        </div>
        <div class="d-flex justify-content-end gap-2">
          <BaseButton type="button" variant="outline-secondary" @click="isPetModalOpen = false">Cancel</BaseButton>
          <BaseButton type="submit" variant="primary">{{ editingPetId ? 'Update Profile' : 'Save Profile' }}</BaseButton>
        </div>
      </form>
    </BaseModal>

    <!-- CLAIM VOUCHER MODAL -->
    <BaseModal v-model="showVoucherModal" title="Claim Voucher Code" size="sm">
      <form @submit.prevent="submitVoucherCode">
        <BaseInput
          v-model="voucherInput"
          label="Voucher Code"
          placeholder="Try TIKIWELCOME or GLOW20"
          required
          class="mb-3"
        />
        <div class="d-flex justify-content-end gap-2">
          <BaseButton type="button" variant="outline-secondary" @click="showVoucherModal = false">Cancel</BaseButton>
          <BaseButton type="submit" variant="primary">Claim</BaseButton>
        </div>
      </form>
    </BaseModal>

    <!-- ADD ADDRESS MODAL -->
    <BaseModal v-model="showAddressModal" title="Add Delivery Address" size="sm">
      <form @submit.prevent="saveNewAddress">
        <div class="d-flex flex-column gap-3 mb-4">
          <BaseInput v-model="addressForm.label" label="Address Label" placeholder="e.g. Home, Office" required />
          <BaseInput v-model="addressForm.recipient" label="Recipient Name" required />
          <BaseInput v-model="addressForm.phone" label="Phone" type="tel" required />
          <BaseInput v-model="addressForm.street" label="Street / Building" required />
          <div class="row g-2">
            <div class="col-7">
              <BaseInput v-model="addressForm.city" label="City" required />
            </div>
            <div class="col-5">
              <BaseInput v-model="addressForm.postalCode" label="Postal Code" />
            </div>
          </div>
          <BaseInput v-model="addressForm.notes" label="Delivery Note" placeholder="Gate code or landmarks" />
        </div>
        <div class="d-flex justify-content-end gap-2">
          <BaseButton type="button" variant="outline-secondary" @click="showAddressModal = false">Cancel</BaseButton>
          <BaseButton type="submit" variant="primary">Save Address</BaseButton>
        </div>
      </form>
    </BaseModal>

    <!-- ADD PAYMENT MODAL -->
    <BaseModal v-model="showBillingModal" title="Add Payment Method" size="sm">
      <form @submit.prevent="saveNewBilling">
        <div class="d-flex flex-column gap-3 mb-4">
          <BaseSelect
            v-model="billingForm.brand"
            label="Payment Provider"
            :options="[
              { label: 'Visa', value: 'Visa' },
              { label: 'Mastercard', value: 'Mastercard' },
              { label: 'ABA PayWay', value: 'ABA PayWay' }
            ]"
          />
          <BaseInput v-model="billingForm.holder" label="Cardholder / Account Name" required />
          <div class="row g-2">
            <div class="col-7">
              <BaseInput v-model="billingForm.last4" label="Last 4 Digits" maxlength="4" placeholder="4242" required />
            </div>
            <div class="col-5">
              <BaseInput v-model="billingForm.expiry" label="Expiry" placeholder="MM/YY" required />
            </div>
          </div>
        </div>
        <div class="d-flex justify-content-end gap-2">
          <BaseButton type="button" variant="outline-secondary" @click="showBillingModal = false">Cancel</BaseButton>
          <BaseButton type="submit" variant="primary">Save Method</BaseButton>
        </div>
      </form>
    </BaseModal>

    <!-- LOGOUT MODAL -->
    <BaseModal v-model="showLogoutModal" title="Confirm Logout" size="sm">
      <p class="mb-0 text-muted small">Are you sure you want to log out of your account?</p>
      <template #footer>
        <BaseButton variant="outline-secondary" class="flex-grow-1" @click="showLogoutModal = false">Cancel</BaseButton>
        <BaseButton variant="danger" class="flex-grow-1" @click="confirmLogout">Log out</BaseButton>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Trash2 } from '@lucide/vue'
import { useProfile } from '../../../composables/useProfile'
import { useAdmin } from '../../../composables/useAdmin'
import { useCart } from '../../../composables/useCart'
import { useI18n } from '../../../composables/useI18n'
import { useToastStore } from '../../../stores/toast'

const route = useRoute()
const router = useRouter()
const toastStore = useToastStore()
const { t } = useI18n()
const { orders } = useAdmin()
const { applyPromo } = useCart()

const {
  account,
  pets,
  addresses,
  billingMethods,
  vouchers,
  supportTickets,
  updateAccount,
  addPet,
  updatePet,
  deletePet,
  addAddress,
  deleteAddress,
  setDefaultAddress,
  addBillingMethod,
  deleteBillingMethod,
  setDefaultBillingMethod,
  claimVoucher,
  addSupportTicket
} = useProfile()

const activeSection = ref('account')
const showPetBanner = ref(true)

const sidebarItems = computed(() => [
  { id: 'account', label: t('profile.account'), emoji: '👤' },
  { id: 'pets', label: t('profile.pets'), emoji: '🌸' },
  { id: 'vouchers', label: t('profile.vouchers'), emoji: '🎟️' },
  { id: 'orders', label: t('profile.orders'), emoji: '🧾' },
  { id: 'addresses', label: t('profile.addresses'), emoji: '📍' },
  { id: 'billing', label: t('profile.billing'), emoji: '💳' },
  { id: 'support', label: t('profile.support'), emoji: '💬' }
])

const customerOrders = computed(() => orders.value)

const scrollToSection = (sectionId) => {
  activeSection.value = sectionId
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const formatDate = (iso) => {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return iso
  }
}

// Account Modal
const isEditAccountModalOpen = ref(false)
const editAccountForm = ref({ ...account.value })
const openEditAccountModal = () => {
  editAccountForm.value = { ...account.value }
  isEditAccountModalOpen.value = true
}
const saveAccountDetails = () => {
  updateAccount(editAccountForm.value)
  isEditAccountModalOpen.value = false
  toastStore.showToast('Profile updated!', 'success')
}

// Beauty Profile Modal
const isPetModalOpen = ref(false)
const editingPetId = ref(null)
const petForm = ref({
  name: '',
  breed: '',
  type: 'Hair & Skin',
  age: '',
  gender: 'Warm Neutral',
  weight: '',
  size: 'Hydration Focus',
  diet: '',
  specialNeeds: '',
  photo: '/images/hero_model.jpg'
})

const openAddPetModal = () => {
  editingPetId.value = null
  petForm.value = {
    name: '',
    breed: '',
    type: 'Hair & Skin',
    age: 'Combination Skin',
    gender: 'Warm Neutral',
    weight: 'Medium Length',
    size: 'Hydration Focus',
    diet: 'Sulfate-Free Botanical',
    specialNeeds: 'None',
    photo: '/images/skincare.jpg'
  }
  isPetModalOpen.value = true
}

const openEditPetModal = (pet) => {
  editingPetId.value = pet.id
  petForm.value = { ...pet }
  isPetModalOpen.value = true
}

const savePetDetails = () => {
  if (editingPetId.value) {
    updatePet(editingPetId.value, petForm.value)
    toastStore.showToast(`${petForm.value.name} updated.`, 'success')
  } else {
    addPet(petForm.value)
    toastStore.showToast(`Added ${petForm.value.name} to your beauty profiles!`, 'success')
  }
  isPetModalOpen.value = false
}

const confirmDeletePet = (pet) => {
  deletePet(pet.id)
  toastStore.showToast(`Removed ${pet.name}.`, 'info')
}

// Vouchers
const showVoucherModal = ref(false)
const voucherInput = ref('')
const submitVoucherCode = () => {
  const res = claimVoucher(voucherInput.value)
  toastStore.showToast(res.message, res.success ? 'success' : 'danger')
  if (res.success) {
    voucherInput.value = ''
    showVoucherModal.value = false
  }
}

const applyVoucherToCart = (code) => {
  const res = applyPromo(code)
  toastStore.showToast(res.message, 'success')
  router.push('/cart')
}

// Addresses
const showAddressModal = ref(false)
const addressForm = reactive({
  label: '',
  recipient: account.value.name,
  phone: account.value.phone,
  street: '',
  city: 'Phnom Penh',
  postalCode: '120101',
  notes: ''
})
const openAddAddressModal = () => {
  addressForm.label = ''
  addressForm.street = ''
  addressForm.notes = ''
  showAddressModal.value = true
}
const saveNewAddress = () => {
  addAddress({ ...addressForm })
  showAddressModal.value = false
  toastStore.showToast('New address added.', 'success')
}
const makeDefaultAddress = (id) => {
  setDefaultAddress(id)
  toastStore.showToast('Default delivery address updated.', 'success')
}
const removeAddress = (id) => {
  deleteAddress(id)
  toastStore.showToast('Address removed.', 'info')
}

// Billing
const showBillingModal = ref(false)
const billingForm = reactive({
  brand: 'Visa',
  holder: account.value.name.toUpperCase(),
  last4: '',
  expiry: '12/28'
})
const saveNewBilling = () => {
  addBillingMethod({ ...billingForm })
  billingForm.last4 = ''
  showBillingModal.value = false
  toastStore.showToast('Payment method saved.', 'success')
}
const makeDefaultBilling = (id) => {
  setDefaultBillingMethod(id)
  toastStore.showToast('Default payment method updated.', 'success')
}
const removeBilling = (id) => {
  deleteBillingMethod(id)
  toastStore.showToast('Payment method removed.', 'info')
}

// Support
const supportForm = reactive({
  subject: '',
  topic: 'Appointment',
  message: ''
})
const submitSupportForm = () => {
  const ticket = addSupportTicket({ ...supportForm })
  supportForm.subject = ''
  supportForm.message = ''
  toastStore.showToast(`Support ticket #${ticket.id} sent! We will reply shortly.`, 'success')
}

// Logout
const showLogoutModal = ref(false)
const confirmLogout = () => {
  showLogoutModal.value = false
  toastStore.showToast('Signed out.', 'info')
  router.push('/login')
}

onMounted(() => {
  window.scrollTo(0, 0)
  if (route.hash) {
    const id = route.hash.replace('#', '')
    activeSection.value = id
    setTimeout(() => scrollToSection(id), 150)
  }
})
</script>

<style scoped>
.profile-layout-container {
  background-color: color-mix(in srgb, var(--storefront-bg, #FAF8F5) 76%, transparent);
  min-height: 100vh;
  padding-top: 76px;
  padding-bottom: 60px;
}

.blob-bottom-right {
  position: fixed;
  bottom: 0;
  right: 0;
  width: 380px;
  height: 380px;
  background-color: rgba(234, 122, 56, 0.12);
  border-radius: 100% 0 0 0;
  z-index: 0;
}

.page-title,
.heading-text,
.ref-card-title,
.account-name,
.pet-title,
.attr-value {
  color: var(--text-heading-color, #1a1a1a);
}

.page-title {
  font-size: 2.1rem;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.profile-columns-layout {
  gap: 24px;
}

.profile-sidebar-column {
  width: 245px;
  position: sticky;
  top: 76px;
}

.profile-nav-card,
.ref-card {
  background-color: var(--storefront-surface, #ffffff);
  border: var(--border-width, 1.5px) solid var(--border-clr, #e2e8f0);
  box-shadow: none !important;
}

.profile-nav-card {
  border-radius: 16px;
  padding: 14px;
}

.profile-sidebar-item {
  width: 100%;
  background: transparent;
  padding: 10px 14px;
  border-radius: 14px;
  color: var(--text-base, #374151);
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 6px;
  transition: all 0.16s ease;
  display: flex;
  align-items: center;
  gap: 10px;
}

.profile-sidebar-item:hover:not(.active) {
  background-color: var(--surface-ground, #f1f5f9);
}

.profile-sidebar-item.active {
  background-color: var(--primary-color-soft, #FBF2EB);
  color: var(--primary-color, #EA7A38);
  font-weight: 700;
}

.support-highlight-item {
  background-color: rgba(234, 122, 56, 0.06);
}

.sidebar-spacer {
  height: 24px;
}

.ref-card {
  border-radius: 16px;
  padding: 24px 26px;
}

.account-avatar {
  width: 68px;
  height: 68px;
}

.btn-edit-badge {
  background-color: var(--primary-color-soft, #FFF3E8);
  color: var(--primary-color, #EA7A38);
  border-radius: 9px;
  padding: 5px 12px;
  font-size: 0.8rem;
}

.ref-green-banner {
  background-color: rgba(16, 185, 129, 0.12);
  border-radius: 14px;
  padding: 12px 16px;
}

.green-banner-text {
  color: var(--success-color, #0d9467);
  font-size: 0.85rem;
  font-weight: 500;
}

.btn-close-green-circle {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #10b981;
  color: #ffffff;
  font-size: 0.65rem;
}

.pet-inner-box,
.voucher-item-card {
  background-color: var(--surface-ground, #F8F9FA);
  border-radius: 16px;
  padding: 18px 20px;
  border-color: var(--border-clr) !important;
}

.pet-photo {
  width: 76px;
  height: 76px;
}

.pet-badge-orange {
  background-color: var(--primary-color-soft, #FFF3E8);
  color: var(--primary-color, #EA7A38);
  border-radius: 9999px;
  padding: 3px 11px;
  font-size: 0.74rem;
}

.pet-badge-white {
  background-color: var(--storefront-surface, #ffffff);
  color: var(--text-base, #4B5563);
  border: 1px solid var(--border-clr, #E5E7EB);
  border-radius: 9999px;
  padding: 3px 11px;
  font-size: 0.74rem;
  font-weight: 500;
}

.attribute-pill-box {
  background-color: var(--primary-color-soft, #FFF3E8);
  border-radius: 12px;
  padding: 8px 12px;
  flex: 1 1 auto;
  min-width: 110px;
}

.attr-label {
  font-size: 0.65rem;
  color: var(--secondary-color, #9C6B45);
  font-weight: 500;
}

.attr-value {
  font-size: 0.82rem;
}

.btn-add-another-pet {
  background-color: var(--storefront-surface, #FFFFFF);
  border: 1px dashed rgba(234, 122, 56, 0.5);
  color: var(--primary-color, #EA7A38);
  border-radius: 10px;
  padding: 7px 16px;
  font-size: 0.84rem;
  font-weight: 600;
}

.btn-voucher-orange {
  background-color: #EA7A38;
  color: #ffffff;
  border-radius: 10px;
  padding: 8px 18px;
  font-size: 0.85rem;
}

@media (max-width: 991px) {
  .profile-sidebar-column {
    width: 100%;
    position: static;
  }
  .sidebar-spacer {
    height: 10px;
  }
}
</style>
