<template>
  <div class="profile-layout-container position-relative">
    
    <!-- Background Decorative Organic Shape (Bottom Right Wave) -->
    <div class="bg-decorative-blob blob-bottom-right pointer-events-none"></div>
    
    <div class="app-container position-relative z-1 pt-2 pb-5">
      
      <!-- Top Breadcrumb & Page Title -->
      <div class="profile-header-group mb-3">
        <nav class="breadcrumb-nav mb-1" aria-label="breadcrumb">
          <router-link to="/" class="breadcrumb-link d-inline-flex align-items-center gap-1 text-decoration-none">
            <span class="text-muted">‹ Home</span>
            <span class="text-muted opacity-50">/</span>
            <span class="text-dark fw-semibold">Profile</span>
          </router-link>
        </nav>
        <h1 class="page-title fw-bolder text-dark m-0">Profile</h1>
      </div>

      <!-- Main Two-Column Flex Layout -->
      <div class="profile-columns-layout d-flex flex-column flex-lg-row align-items-start">
        
        <!-- ========================================================= -->
        <!-- LEFT SIDEBAR: PROFILE NAVIGATION MENU                     -->
        <!-- ========================================================= -->
        <aside class="profile-sidebar-column flex-shrink-0">
          <div class="profile-nav-card bg-white">
            <nav class="d-flex flex-column">
              
              <button 
                type="button" 
                class="profile-sidebar-item d-flex align-items-center gap-2.5 text-start border-0"
                :class="{ 'active': activeSection === 'account' }"
                @click="scrollToSection('account')"
              >
                <span class="nav-icon text-orange">👤</span>
                <span class="item-text">Account</span>
              </button>

              <button 
                type="button" 
                class="profile-sidebar-item d-flex align-items-center gap-2.5 text-start border-0"
                :class="{ 'active': activeSection === 'pets' }"
                @click="scrollToSection('pets')"
              >
                <span class="nav-icon">🐾</span>
                <span class="item-text">My pets</span>
              </button>

              <button 
                type="button" 
                class="profile-sidebar-item d-flex align-items-center gap-2.5 text-start border-0"
                :class="{ 'active': activeSection === 'vouchers' }"
                @click="scrollToSection('vouchers')"
              >
                <span class="nav-icon">🎟️</span>
                <span class="item-text">Vouchers</span>
              </button>

              <button 
                type="button" 
                class="profile-sidebar-item d-flex align-items-center gap-2.5 text-start border-0"
                :class="{ 'active': activeSection === 'orders' }"
                @click="scrollToSection('orders')"
              >
                <span class="nav-icon">🧾</span>
                <span class="item-text">Order history</span>
              </button>

              <button 
                type="button" 
                class="profile-sidebar-item d-flex align-items-center gap-2.5 text-start border-0"
                :class="{ 'active': activeSection === 'addresses' }"
                @click="scrollToSection('addresses')"
              >
                <span class="nav-icon">📍</span>
                <span class="item-text">My Addresses</span>
              </button>

              <button 
                type="button" 
                class="profile-sidebar-item d-flex align-items-center gap-2.5 text-start border-0"
                :class="{ 'active': activeSection === 'billing' }"
                @click="scrollToSection('billing')"
              >
                <span class="nav-icon">💳</span>
                <span class="item-text">Billing information</span>
              </button>

              <!-- Large Gap Above Support & Logout -->
              <div class="sidebar-spacer"></div>

              <button 
                type="button" 
                class="profile-sidebar-item support-highlight-item d-flex align-items-center gap-2.5 text-start border-0"
                :class="{ 'active': activeSection === 'support' }"
                @click="scrollToSection('support')"
              >
                <span class="nav-icon text-orange">💬</span>
                <span class="item-text">Support</span>
              </button>

              <button 
                type="button" 
                class="profile-sidebar-item logout-item d-flex align-items-center gap-2.5 text-start border-0"
                @click="handleLogout"
              >
                <span class="nav-icon text-danger">🚪</span>
                <span class="item-text text-danger">Log out</span>
              </button>

            </nav>
          </div>
        </aside>

        <!-- ========================================================= -->
        <!-- RIGHT CONTENT: CARDS                                      -->
        <!-- ========================================================= -->
        <main class="profile-cards-column flex-grow-1 w-100">
          
          <!-- 1. ACCOUNT CARD -->
          <section id="account" class="ref-card bg-white mb-4">
            <h2 class="ref-card-title fw-bold text-dark mb-4">Account</h2>
            
            <div class="d-flex align-items-start gap-4">
              <!-- Avatar -->
              <img 
                :src="account.avatar" 
                alt="Alisa Gitten" 
                class="account-avatar rounded-circle object-fit-cover flex-shrink-0"
              />

              <!-- Account Details & Edit -->
              <div class="d-flex flex-column">
                <strong class="account-name fw-bold text-dark mb-1">{{ account.name }}</strong>
                <span class="account-meta text-muted mb-1">{{ account.email }}</span>
                <span class="account-meta text-muted mb-3">{{ account.phone }}</span>

                <div>
                  <button 
                    type="button" 
                    class="btn-edit-badge d-inline-flex align-items-center gap-1.5 border-0 fw-semibold"
                    @click="openEditAccountModal"
                  >
                    <span>✏️</span>
                    <span>Edit</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          <!-- 2. MY PETS CARD -->
          <section id="pets" class="ref-card bg-white mb-4">
            <h2 class="ref-card-title fw-bold text-dark mb-3">My pets</h2>

            <!-- Green Recommendation Banner -->
            <div v-if="showPetBanner" class="ref-green-banner d-flex align-items-center justify-content-between gap-3 mb-4">
              <span class="green-banner-text">
                This helps us recommend better food, care products and special offers just for your pet 🐾
              </span>
              <button 
                type="button" 
                class="btn-close-green-circle border-0 d-flex align-items-center justify-content-center flex-shrink-0"
                @click="showPetBanner = false"
                title="Dismiss"
              >
                ✕
              </button>
            </div>

            <!-- Pet Inner Card List -->
            <div class="d-flex flex-column gap-3 mb-3">
              <div 
                v-for="pet in pets" 
                :key="pet.id"
                class="pet-inner-box"
              >
                <div class="d-flex align-items-start gap-3 gap-md-4">
                  <!-- Pet Photo -->
                  <img 
                    :src="pet.photo" 
                    :alt="pet.name" 
                    class="pet-photo rounded-4 object-fit-cover flex-shrink-0"
                  />

                  <!-- Pet Details -->
                  <div class="flex-grow-1">
                    <h3 class="pet-title fw-bold text-dark mb-2">{{ pet.name }}</h3>

                    <!-- Badges Row -->
                    <div class="d-flex flex-wrap align-items-center gap-1.5 mb-3">
                      <span class="pet-badge-orange fw-semibold">
                        {{ pet.breed }}
                      </span>
                      <span class="pet-badge-white">
                        {{ pet.type }}
                      </span>
                      <span class="pet-badge-white">
                        {{ pet.age }}
                      </span>
                      <span class="pet-badge-white">
                        {{ pet.gender }}
                      </span>
                    </div>

                    <!-- 4 Attribute Boxes Row -->
                    <div class="attributes-grid d-flex flex-wrap gap-2.5 mb-3">
                      <!-- Weight -->
                      <div class="attribute-pill-box d-flex align-items-center gap-2">
                        <span class="attr-icon">🍞</span>
                        <div>
                          <span class="attr-label d-block">Weight</span>
                          <strong class="attr-value text-dark d-block">{{ pet.weight }}</strong>
                        </div>
                      </div>

                      <!-- Size -->
                      <div class="attribute-pill-box d-flex align-items-center gap-2">
                        <span class="attr-icon">📏</span>
                        <div>
                          <span class="attr-label d-block">Size</span>
                          <strong class="attr-value text-dark d-block">{{ pet.size }}</strong>
                        </div>
                      </div>

                      <!-- Diet -->
                      <div class="attribute-pill-box d-flex align-items-center gap-2">
                        <span class="attr-icon">🥚</span>
                        <div>
                          <span class="attr-label d-block">Diet</span>
                          <strong class="attr-value text-dark d-block text-truncate" style="max-width: 90px;">{{ pet.diet }}</strong>
                        </div>
                      </div>

                      <!-- Special Needs -->
                      <div class="attribute-pill-box d-flex align-items-center gap-2">
                        <span class="attr-icon">🧡</span>
                        <div>
                          <span class="attr-label d-block">Special needs</span>
                          <strong class="attr-value text-dark d-block text-truncate" style="max-width: 105px;">{{ pet.specialNeeds }}</strong>
                        </div>
                      </div>
                    </div>

                    <!-- Edit Pet Button -->
                    <div>
                      <button 
                        type="button" 
                        class="btn-edit-badge d-inline-flex align-items-center gap-1.5 border-0 fw-semibold"
                        @click="openEditPetModal(pet)"
                      >
                        <span>✏️</span>
                        <span>Edit</span>
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            </div>

            <!-- Add Another Pet Button -->
            <div>
              <button 
                type="button" 
                class="btn-add-another-pet d-inline-flex align-items-center gap-1"
                @click="openAddPetModal"
              >
                <span>+ Add another pet</span>
              </button>
            </div>
          </section>

          <!-- 3. VOUCHERS CARD -->
          <section id="vouchers" class="ref-card bg-white mb-4">
            <h2 class="ref-card-title fw-bold text-dark mb-4">Vouchers</h2>

            <div class="d-flex flex-column flex-md-row align-items-center align-items-md-start gap-4">
              <!-- Poodle Mascot Photo -->
              <img 
                src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
                alt="Poodle mascot" 
                class="voucher-poodle-img flex-shrink-0 object-fit-cover rounded-4"
              />

              <!-- Voucher Description -->
              <div class="flex-grow-1 text-center text-md-start pt-1">
                <h3 class="voucher-heading fw-bold text-dark mb-2 d-flex align-items-center justify-content-center justify-content-md-start gap-1">
                  <span>No vouchers yet</span>
                  <span>🐾</span>
                </h3>
                <p class="voucher-desc text-muted mb-4">
                  Looks like you don't have any vouchers right now.<br />
                  But don't worry — we're always preparing something special for you and your pet 💚
                </p>

                <button 
                  type="button" 
                  class="btn-voucher-orange border-0 fw-semibold"
                  @click="openAddVoucherModal"
                >
                  + Add Voucher
                </button>
              </div>
            </div>
          </section>

        </main>
      </div>
    </div>

    <!-- ========================================================= -->
    <!-- EDIT ACCOUNT MODAL                                        -->
    <!-- ========================================================= -->
    <div v-if="isEditAccountModalOpen" class="modal-backdrop-custom position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center z-1060 p-3">
      <div class="modal-card bg-white rounded-4 border shadow-lg p-4 max-w-500 w-100 animate-scale-up">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="fw-bold text-dark m-0">Edit Account Details</h5>
          <button type="button" class="btn-close" @click="isEditAccountModalOpen = false"></button>
        </div>

        <form @submit.prevent="saveAccountDetails">
          <div class="d-flex flex-column gap-3 mb-4">
            <div>
              <label class="form-label small fw-semibold text-dark">Full Name</label>
              <input type="text" v-model="editAccountForm.name" class="form-control rounded-3" required />
            </div>
            <div>
              <label class="form-label small fw-semibold text-dark">Email Address</label>
              <input type="email" v-model="editAccountForm.email" class="form-control rounded-3" required />
            </div>
            <div>
              <label class="form-label small fw-semibold text-dark">Phone Number</label>
              <input type="tel" v-model="editAccountForm.phone" class="form-control rounded-3" required />
            </div>
          </div>

          <div class="d-flex justify-content-end gap-2">
            <button type="button" class="btn btn-light rounded-pill px-3 py-1.5 fw-semibold small" @click="isEditAccountModalOpen = false">
              Cancel
            </button>
            <button type="submit" class="btn-voucher-orange border-0 rounded-pill px-4 py-1.5 fw-semibold small">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- ========================================================= -->
    <!-- EDIT / ADD PET MODAL                                      -->
    <!-- ========================================================= -->
    <div v-if="isPetModalOpen" class="modal-backdrop-custom position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center z-1060 p-3">
      <div class="modal-card bg-white rounded-4 border shadow-lg p-4 max-w-500 w-100 animate-scale-up">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="fw-bold text-dark m-0">{{ editingPetId ? 'Edit Pet' : 'Add New Pet' }}</h5>
          <button type="button" class="btn-close" @click="isPetModalOpen = false"></button>
        </div>

        <form @submit.prevent="savePetDetails">
          <div class="row g-3 mb-4">
            <div class="col-12 col-sm-6">
              <label class="form-label small fw-semibold text-dark">Pet Name</label>
              <input type="text" v-model="petForm.name" class="form-control rounded-3" required placeholder="e.g. Bella" />
            </div>
            <div class="col-12 col-sm-6">
              <label class="form-label small fw-semibold text-dark">Breed</label>
              <input type="text" v-model="petForm.breed" class="form-control rounded-3" required placeholder="e.g. Golden Retriever" />
            </div>
            <div class="col-6">
              <label class="form-label small fw-semibold text-dark">Type</label>
              <select v-model="petForm.type" class="form-select rounded-3">
                <option value="Dog">Dog</option>
                <option value="Cat">Cat</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div class="col-6">
              <label class="form-label small fw-semibold text-dark">Gender</label>
              <select v-model="petForm.gender" class="form-select rounded-3">
                <option value="Female">Female</option>
                <option value="Male">Male</option>
              </select>
            </div>
            <div class="col-6">
              <label class="form-label small fw-semibold text-dark">Age</label>
              <input type="text" v-model="petForm.age" class="form-control rounded-3" placeholder="e.g. 3 years" />
            </div>
            <div class="col-6">
              <label class="form-label small fw-semibold text-dark">Weight</label>
              <input type="text" v-model="petForm.weight" class="form-control rounded-3" placeholder="e.g. 30kg" />
            </div>
            <div class="col-6">
              <label class="form-label small fw-semibold text-dark">Size</label>
              <select v-model="petForm.size" class="form-select rounded-3">
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
                <option value="Extra Large">Extra Large</option>
              </select>
            </div>
            <div class="col-6">
              <label class="form-label small fw-semibold text-dark">Diet</label>
              <input type="text" v-model="petForm.diet" class="form-control rounded-3" placeholder="e.g. Grain-free" />
            </div>
            <div class="col-12">
              <label class="form-label small fw-semibold text-dark">Special needs</label>
              <input type="text" v-model="petForm.specialNeeds" class="form-control rounded-3" placeholder="e.g. Sensitive stomach" />
            </div>
          </div>

          <div class="d-flex justify-content-end gap-2">
            <button type="button" class="btn btn-light rounded-pill px-3 py-1.5 fw-semibold small" @click="isPetModalOpen = false">
              Cancel
            </button>
            <button type="submit" class="btn-voucher-orange border-0 rounded-pill px-4 py-1.5 fw-semibold small">
              {{ editingPetId ? 'Update Pet' : 'Save Pet' }}
            </button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const activeSection = ref('account')
const showPetBanner = ref(true)

// Account Data
const account = ref({
  name: 'Alisa Gitten',
  email: 'alisa.gitten2910@gmail.com',
  phone: '+4 079 355 05 86',
  avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
})

// Pets Data
const pets = ref([
  {
    id: 1,
    name: 'Bella',
    breed: 'Golden Retriever',
    type: 'Dog',
    age: '3 years',
    gender: 'Female',
    weight: '30kg',
    size: 'Large',
    diet: 'Grain-free',
    specialNeeds: 'Sensitive stomach',
    photo: 'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
  }
])

// Modals State
const isEditAccountModalOpen = ref(false)
const editAccountForm = ref({ ...account.value })

const isPetModalOpen = ref(false)
const editingPetId = ref(null)
const petForm = ref({
  name: '',
  breed: '',
  type: 'Dog',
  age: '',
  gender: 'Female',
  weight: '',
  size: 'Medium',
  diet: '',
  specialNeeds: '',
  photo: 'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
})

const scrollToSection = (sectionId) => {
  activeSection.value = sectionId
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const openEditAccountModal = () => {
  editAccountForm.value = { ...account.value }
  isEditAccountModalOpen.value = true
}

const saveAccountDetails = () => {
  account.value = { ...editAccountForm.value }
  try {
    localStorage.setItem('tiki_profile_account', JSON.stringify(account.value))
  } catch (e) {
    console.error(e)
  }
  isEditAccountModalOpen.value = false
}

const openAddPetModal = () => {
  editingPetId.value = null
  petForm.value = {
    name: '',
    breed: '',
    type: 'Dog',
    age: '1 year',
    gender: 'Female',
    weight: '12kg',
    size: 'Medium',
    diet: 'Natural organic',
    specialNeeds: 'None',
    photo: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
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
    const idx = pets.value.findIndex(p => p.id === editingPetId.value)
    if (idx !== -1) {
      pets.value[idx] = { ...petForm.value, id: editingPetId.value }
    }
  } else {
    pets.value.push({
      ...petForm.value,
      id: Date.now()
    })
  }
  try {
    localStorage.setItem('tiki_profile_pets', JSON.stringify(pets.value))
  } catch (e) {
    console.error(e)
  }
  isPetModalOpen.value = false
}

const openAddVoucherModal = () => {
  alert('✨ Promo Code "TIKIWELCOME" applied! You received $15 off your next grooming session.')
}

const handleLogout = () => {
  if (confirm('Are you sure you want to log out?')) {
    router.push('/')
  }
}

onMounted(() => {
  window.scrollTo(0, 0)
  try {
    const savedAcc = localStorage.getItem('tiki_profile_account')
    if (savedAcc) {
      account.value = JSON.parse(savedAcc)
    }
    const savedPets = localStorage.getItem('tiki_profile_pets')
    if (savedPets) {
      pets.value = JSON.parse(savedPets)
    }
  } catch (e) {
    console.error(e)
  }
})
</script>

<style scoped>
/* ========================================================= */
/* PAGE WRAPPER & PROPORTIONS                                */
/* ========================================================= */
.profile-layout-container {
  background-color: #FAF8F5;
  min-height: 100vh;
  padding-top: 72px;
  padding-bottom: 60px;
}

/* Background Decorative Blob at bottom right */
.blob-bottom-right {
  position: fixed;
  bottom: 0;
  right: 0;
  width: 440px;
  height: 440px;
  background-color: #EA7A38;
  border-radius: 100% 0 0 0;
  z-index: 0;
}

/* Page Header */
.page-title {
  font-size: 2.25rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: #1a1a1a;
}

.breadcrumb-link {
  font-size: 0.86rem;
}

/* Flex layout between Sidebar and Cards */
.profile-columns-layout {
  gap: 24px;
}

/* ========================================================= */
/* SIDEBAR STYLING EXACT MATCH                               */
/* ========================================================= */
.profile-sidebar-column {
  width: 242px;
  position: sticky;
  top: 76px;
}

.profile-nav-card {
  border-radius: 28px;
  padding: 16px 14px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.03);
}

.profile-sidebar-item {
  width: 100%;
  background: transparent;
  padding: 10px 16px;
  border-radius: 18px;
  color: #374151;
  font-size: 0.94rem;
  font-weight: 600;
  margin-bottom: 12px;
  transition: all 0.16s ease;
  display: flex;
  align-items: center;
  gap: 12px;
}

.profile-sidebar-item:hover:not(.active):not(.support-highlight-item):not(.logout-item) {
  background-color: #f9fafb;
  color: #111827;
}

.profile-sidebar-item.active {
  background-color: #FBF2EB !important;
  color: #DF7636 !important;
  font-weight: 700;
}

.support-highlight-item {
  background-color: #FBF5EE;
  color: #DF7636;
  font-weight: 700;
  margin-bottom: 8px;
}

.support-highlight-item:hover {
  background-color: #FBF2EB;
}

.logout-item {
  margin-bottom: 0;
  color: #DC2626;
  font-weight: 600;
}

.logout-item:hover {
  background-color: #FEF2F2;
}

.sidebar-spacer {
  height: 52px;
}

.nav-icon {
  font-size: 1.05rem;
  width: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-text {
  line-height: 1;
}

/* ========================================================= */
/* MAIN CONTENT CARDS                                        */
/* ========================================================= */
.ref-card {
  border-radius: 22px;
  padding: 28px 32px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.03);
}

.ref-card-title {
  font-size: 1.15rem;
  letter-spacing: -0.01em;
}

/* Account Details */
.account-avatar {
  width: 66px;
  height: 66px;
}

.account-name {
  font-size: 1.05rem;
  line-height: 1.2;
}

.account-meta {
  font-size: 0.85rem;
  line-height: 1.3;
}

/* Edit Pill Button */
.btn-edit-badge {
  background-color: #FFF3E8;
  color: #EA7A38;
  border-radius: 9px;
  padding: 5px 12px;
  font-size: 0.82rem;
  transition: all 0.16s ease;
}

.btn-edit-badge:hover {
  background-color: #FFE6D0;
  color: #D96928;
}

/* Green Banner */
.ref-green-banner {
  background-color: #EAF8F0;
  border-radius: 14px;
  padding: 12px 16px;
}

.green-banner-text {
  color: #2E7D32;
  font-size: 0.85rem;
  font-weight: 500;
  line-height: 1.4;
}

.btn-close-green-circle {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: #34D399;
  color: #ffffff;
  font-size: 0.62rem;
  line-height: 1;
  cursor: pointer;
}

/* Pet Inner Box */
.pet-inner-box {
  background-color: #F8F9FA;
  border-radius: 18px;
  padding: 20px 22px;
}

.pet-photo {
  width: 76px;
  height: 76px;
  border-radius: 14px;
}

.pet-title {
  font-size: 1.18rem;
  line-height: 1;
}

/* Pet Badges */
.pet-badge-orange {
  background-color: #FFF3E8;
  color: #EA7A38;
  border-radius: 9999px;
  padding: 3px 11px;
  font-size: 0.74rem;
}

.pet-badge-white {
  background-color: #FFFFFF;
  color: #4B5563;
  border: 1px solid #E5E7EB;
  border-radius: 9999px;
  padding: 3px 11px;
  font-size: 0.74rem;
  font-weight: 500;
}

/* 4 Attributes Pill Box */
.attributes-grid {
  display: flex;
}

.attribute-pill-box {
  background-color: #FFF3E8;
  border-radius: 12px;
  padding: 8px 12px;
  flex: 1 1 auto;
  min-width: 105px;
}

.attr-icon {
  font-size: 1.05rem;
}

.attr-label {
  font-size: 0.65rem;
  color: #9C6B45;
  font-weight: 500;
  line-height: 1.2;
}

.attr-value {
  font-size: 0.82rem;
  line-height: 1.2;
}

/* Add Another Pet Button */
.btn-add-another-pet {
  background-color: #FFFFFF;
  border: 1px dashed #FFD4B2;
  color: #EA7A38;
  border-radius: 10px;
  padding: 7px 16px;
  font-size: 0.84rem;
  font-weight: 600;
  transition: all 0.16s ease;
}

.btn-add-another-pet:hover {
  background-color: #FFF8F3;
  border-color: #EA7A38;
}

/* Vouchers Section */
.voucher-poodle-img {
  width: 130px;
  height: 130px;
  border-radius: 18px;
}

.voucher-heading {
  font-size: 1.12rem;
}

.voucher-desc {
  font-size: 0.84rem;
  line-height: 1.5;
}

.btn-voucher-orange {
  background-color: #EA7A38;
  color: #ffffff;
  border-radius: 10px;
  padding: 9px 22px;
  font-size: 0.86rem;
  transition: all 0.16s ease;
}

.btn-voucher-orange:hover {
  background-color: #D96928;
  transform: translateY(-1px);
}

/* Modal styles */
.max-w-500 {
  max-width: 500px;
}

.modal-backdrop-custom {
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(4px);
}

.animate-scale-up {
  animation: scaleUp 0.18s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes scaleUp {
  from { transform: scale(0.96); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

@media (max-width: 991px) {
  .profile-sidebar-column {
    width: 100%;
    position: static;
  }
  .sidebar-spacer {
    height: 16px;
  }
}
</style>
