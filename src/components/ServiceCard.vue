<template>
  <div 
    class="template-service-card rounded-4 border bg-white position-relative d-flex flex-column h-100 cursor-pointer"
    :class="{ 'is-selected': isSelected }"
    @click="$emit('select', service)"
  >
    
    <!-- 1. Top Illustration Box with Flow Lines & 3D Isometric Element -->
    <div class="template-canvas-box rounded-3 position-relative overflow-hidden d-flex align-items-center justify-content-center mb-3">
      
      <!-- Subtle Architectural Workflow Connection Lines -->
      <svg class="diagram-flow-lines position-absolute w-100 h-100" viewBox="0 0 320 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M 30 60 C 90 60, 90 60, 120 60" stroke="#e2e8f0" stroke-width="1.5" stroke-dasharray="3 3" />
        <path d="M 200 60 C 230 60, 230 60, 290 60" stroke="#e2e8f0" stroke-width="1.5" stroke-dasharray="3 3" />
        <rect x="25" y="55" width="10" height="10" rx="3" fill="#f1f5f9" stroke="#cbd5e1" />
        <rect x="285" y="55" width="10" height="10" rx="3" fill="#f1f5f9" stroke="#cbd5e1" />
        <circle cx="160" cy="60" r="44" fill="#ffffff" fill-opacity="0.75" />
      </svg>

      <!-- Centered Isometric 3D Graphic / Render -->
      <div class="isometric-hero-graphic position-relative z-1 d-flex align-items-center justify-content-center">
        <!-- If 3D render image exists -->
        <div class="isometric-3d-wrap d-flex align-items-center justify-content-center">
          <!-- Realistic 3D Glass / Isometric Stylized Illustration based on Service Type -->
          <div v-if="service.iconType === 'hair' || service.id === 1" class="iso-model iso-hair">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <rect x="18" y="16" width="28" height="32" rx="6" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5" />
              <path d="M22 24h20M22 30h16M22 36h12" stroke="#94a3b8" stroke-width="1.5" stroke-linecap="round"/>
              <circle cx="44" cy="40" r="10" fill="#EA7A38" fill-opacity="0.12" stroke="#EA7A38" stroke-width="1.5" />
              <text x="39" y="44" font-size="12" fill="#EA7A38">✂️</text>
            </svg>
          </div>

          <div v-else-if="service.iconType === 'color' || service.id === 2" class="iso-model iso-color">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <path d="M32 12 L50 22 L50 42 L32 52 L14 42 L14 22 Z" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5" />
              <path d="M32 12 L32 52 M14 22 L32 32 L50 22" stroke="#e2e8f0" stroke-width="1.5" />
              <circle cx="32" cy="32" r="12" fill="#8b5cf6" fill-opacity="0.15" stroke="#8b5cf6" stroke-width="1.5" />
              <text x="26" y="37" font-size="14">🎨</text>
            </svg>
          </div>

          <div v-else-if="service.iconType === 'blowout' || service.id === 3" class="iso-model iso-blowout">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <rect x="16" y="20" width="32" height="24" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5" />
              <path d="M22 28h20M22 36h14" stroke="#0ea5e9" stroke-width="2" stroke-linecap="round"/>
              <circle cx="44" cy="20" r="8" fill="#38bdf8" fill-opacity="0.2" stroke="#0ea5e9" stroke-width="1.5" />
              <text x="40" y="24" font-size="10">✨</text>
            </svg>
          </div>

          <div v-else-if="service.iconType === 'scalp' || service.id === 4" class="iso-model iso-scalp">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <circle cx="32" cy="32" r="22" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5" />
              <path d="M32 16v32M16 32h32" stroke="#e2e8f0" stroke-width="1.5" stroke-dasharray="2 2" />
              <circle cx="32" cy="32" r="12" fill="#10b981" fill-opacity="0.15" stroke="#10b981" stroke-width="1.5" />
              <text x="26" y="37" font-size="14">🌿</text>
            </svg>
          </div>

          <div v-else-if="service.iconType === 'bridal' || service.id === 5" class="iso-model iso-bridal">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <path d="M20 44 L32 18 L44 44 Z" fill="#fffbeb" stroke="#f59e0b" stroke-width="1.5" />
              <circle cx="32" cy="34" r="8" fill="#d97706" fill-opacity="0.2" />
              <text x="26" y="38" font-size="14">👑</text>
            </svg>
          </div>

          <div v-else-if="service.iconType === 'manicure' || service.id === 6" class="iso-model iso-mani">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <rect x="20" y="16" width="24" height="32" rx="12" fill="#fdf2f8" stroke="#ec4899" stroke-width="1.5" />
              <text x="26" y="37" font-size="14">💅</text>
            </svg>
          </div>

          <div v-else-if="service.iconType === 'pedicure' || service.id === 7" class="iso-model iso-pedi">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <rect x="16" y="18" width="32" height="28" rx="8" fill="#f0fdf4" stroke="#22c55e" stroke-width="1.5" />
              <text x="26" y="37" font-size="14">🦶</text>
            </svg>
          </div>

          <div v-else class="iso-model iso-default">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <circle cx="32" cy="32" r="20" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5" />
              <text x="25" y="38" font-size="16">{{ service.icon || '💄' }}</text>
            </svg>
          </div>
        </div>
      </div>

      <!-- Top Right Status / Category Tag -->
      <div class="position-absolute top-0 end-0 m-2 z-2">
        <span 
          class="badge-category-pill"
          :class="getCategoryTagClass(service.category)"
        >
          {{ service.categoryBadge || service.category }}
        </span>
      </div>

      <!-- Selection Check Indicator -->
      <div v-if="isSelected" class="selected-check-badge position-absolute top-0 start-0 m-2 z-2 d-flex align-items-center justify-content-center rounded-circle">
        <span>✓</span>
      </div>

    </div>

    <!-- 2. Tool / Inclusions Row with Specialist Mini-Avatar -->
    <div class="d-flex justify-content-between align-items-center mb-2 px-1">
      
      <!-- Small Tool / Feature Icon Pills -->
      <div class="d-flex align-items-center gap-1 tool-icons-group">
        <span class="tool-mini-icon" title="Consultation">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </span>
        <span class="tool-mini-icon" title="Organic Products">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
        </span>
        <span class="tool-mini-icon" title="Wash Included">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M8 12s1.5 2 4 2 4-2 4-2"></path>
          </svg>
        </span>
        <span class="tool-count-badge small">+3</span>
      </div>

      <!-- Specialist Mini Avatar -->
      <div class="specialist-mini-profile d-flex align-items-center gap-1" :title="service.specialistName || 'Master Specialist'">
        <img 
          :src="service.specialistAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&q=80'" 
          alt="Stylist" 
          class="mini-avatar-img rounded-circle object-fit-cover" 
        />
      </div>

    </div>

    <!-- 3. Title & Subtitle / Description -->
    <div class="card-content-body flex-grow-1 px-1 mb-3">
      <h6 class="template-title fw-bold text-dark mb-1">{{ service.title }}</h6>
      <p class="template-desc text-muted small m-0 line-clamp-2">
        {{ service.description }}
      </p>
    </div>

    <!-- 4. Bottom Meta Bar & Use/Book Pill Button -->
    <div class="template-footer-bar d-flex justify-content-between align-items-center pt-2 border-top mt-auto px-1">
      
      <!-- Meta Information (Duration • Price / Bookings) -->
      <div class="d-flex align-items-center gap-1 template-meta-stats text-muted small">
        <span class="meta-icon">⚡</span>
        <span class="fw-semibold text-dark">${{ service.price }}</span>
        <span class="text-muted opacity-60">•</span>
        <span class="text-muted">{{ service.duration }}</span>
      </div>

      <!-- Action Button ("Use" / "Book" / "Select") -->
      <button 
        type="button" 
        class="btn-template-action rounded-3 px-3 py-1 fw-semibold small"
        :class="{ 'btn-template-active': isSelected }"
        @click.stop="$emit('select', service)"
      >
        <span>{{ isSelected ? 'Selected' : 'Use' }}</span>
      </button>

    </div>

  </div>
</template>

<script setup>
defineProps({
  service: {
    type: Object,
    required: true
  },
  isSelected: {
    type: Boolean,
    default: false
  }
})

defineEmits(['select'])

const getCategoryTagClass = (category) => {
  if (!category) return 'cat-tag-default'
  const c = category.toLowerCase()
  if (c.includes('hair')) return 'cat-tag-blue'
  if (c.includes('color')) return 'cat-tag-purple'
  if (c.includes('scalp')) return 'cat-tag-green'
  if (c.includes('nail')) return 'cat-tag-pink'
  if (c.includes('package')) return 'cat-tag-orange'
  if (c.includes('makeup')) return 'cat-tag-teal'
  return 'cat-tag-default'
}
</script>

<style scoped>
/* ======================================================= */
/* TEMPLATE CARD EXACT REPLICA STYLING                     */
/* ======================================================= */
.template-service-card {
  background-color: #ffffff;
  border: 1px solid #e8ecf1 !important;
  padding: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.02);
  transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
  user-select: none;
}

.template-service-card:hover {
  transform: translateY(-2px);
  border-color: #cbd5e1 !important;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
}

.template-service-card.is-selected {
  border-color: #EA7A38 !important;
  box-shadow: 0 0 0 2px rgba(234, 122, 56, 0.2), 0 8px 24px rgba(234, 122, 56, 0.08);
  background-color: #ffffff;
}

/* 1. Top Illustration Viewport */
.template-canvas-box {
  background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
  height: 116px;
  width: 100%;
  border: 1px solid #edf2f7;
}

.diagram-flow-lines {
  pointer-events: none;
  opacity: 0.85;
}

.isometric-3d-wrap {
  width: 60px;
  height: 60px;
  transition: transform 0.3s ease;
}

.template-service-card:hover .isometric-3d-wrap {
  transform: scale(1.08) translateY(-2px);
}

/* Category Tags */
.badge-category-pill {
  font-size: 0.65rem;
  font-weight: 700;
  padding: 0.2rem 0.55rem;
  border-radius: 9999px;
  letter-spacing: 0.3px;
}

.cat-tag-blue {
  background-color: #eff6ff;
  color: #2563eb;
  border: 1px solid rgba(37, 99, 235, 0.2);
}

.cat-tag-purple {
  background-color: #faf5ff;
  color: #8b5cf6;
  border: 1px solid rgba(139, 92, 246, 0.2);
}

.cat-tag-green {
  background-color: #f0fdf4;
  color: #16a34a;
  border: 1px solid rgba(22, 163, 74, 0.2);
}

.cat-tag-pink {
  background-color: #fdf2f8;
  color: #db2777;
  border: 1px solid rgba(219, 39, 119, 0.2);
}

.cat-tag-orange {
  background-color: #fff7ed;
  color: #ea580c;
  border: 1px solid rgba(234, 88, 12, 0.2);
}

.cat-tag-teal {
  background-color: #f0fdfa;
  color: #0d9488;
  border: 1px solid rgba(13, 148, 136, 0.2);
}

.cat-tag-default {
  background-color: #f8fafc;
  color: #475569;
  border: 1px solid #e2e8f0;
}

.selected-check-badge {
  width: 20px;
  height: 20px;
  background-color: #EA7A38;
  color: #ffffff;
  font-size: 0.7rem;
  font-weight: bold;
  box-shadow: 0 2px 6px rgba(234, 122, 56, 0.4);
}

/* 2. Micro Tool Icons */
.tool-mini-icon {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.tool-count-badge {
  font-size: 0.68rem;
  color: #64748b;
  font-weight: 600;
  margin-left: 2px;
}

.mini-avatar-img {
  width: 22px;
  height: 22px;
  border: 1.5px solid #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
}

/* 3. Title & Description */
.template-title {
  font-size: 0.92rem;
  color: #1e293b !important;
  letter-spacing: -0.01em;
  line-height: 1.3;
}

.template-service-card:hover .template-title {
  color: #EA7A38 !important;
}

.template-desc {
  font-size: 0.78rem;
  line-height: 1.4;
  color: #64748b !important;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 4. Bottom Footer Bar */
.template-meta-stats {
  font-size: 0.76rem;
}

.meta-icon {
  font-size: 0.75rem;
  color: #EA7A38;
}

.btn-template-action {
  background-color: #ffffff;
  color: #334155;
  border: 1px solid #d1d5db;
  font-size: 0.78rem;
  padding: 0.28rem 0.85rem;
  transition: all 0.18s ease;
}

.btn-template-action:hover {
  background-color: #f8fafc;
  border-color: #94a3b8;
  color: #0f172a;
}

.btn-template-active {
  background-color: #EA7A38 !important;
  color: #ffffff !important;
  border-color: #EA7A38 !important;
  box-shadow: 0 2px 6px rgba(234, 122, 56, 0.3);
}

.cursor-pointer {
  cursor: pointer;
}
</style>
