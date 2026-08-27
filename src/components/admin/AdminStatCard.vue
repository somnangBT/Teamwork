<template>
  <div class="luxury-stat-card bg-white rounded-3 p-3 p-md-3.5 border d-flex flex-column justify-content-between position-relative overflow-hidden">
    <!-- Top Row: Label & Icon -->
    <div class="d-flex align-items-center justify-content-between mb-3">
      <span class="stat-title text-muted text-uppercase fw-bold" style="font-size: 0.72rem; letter-spacing: 0.8px;">
        {{ label }}
      </span>
      <div 
        class="stat-icon-squircle d-flex align-items-center justify-content-center rounded-3"
        :class="`icon-theme-${color}`"
      >
        <slot name="icon">
          <!-- Fallback dynamic SVG based on type -->
          <svg v-if="color === 'emerald'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="1" x2="12" y2="23"></line>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
          </svg>
          <svg v-else-if="color === 'orange'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <svg v-else-if="color === 'blue'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
            <line x1="12" y1="22.08" x2="12" y2="12"></line>
          </svg>
          <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </slot>
      </div>
    </div>

    <!-- Main Value & Metric Trend -->
    <div class="d-flex align-items-baseline justify-content-between mt-auto">
      <div>
        <h3 class="stat-main-number fw-bold text-dark mb-1" style="letter-spacing: -0.03em; font-size: 1.65rem;">
          {{ value }}
        </h3>
        <p v-if="subtitle" class="stat-subtext text-muted mb-0" style="font-size: 0.76rem;">
          {{ subtitle }}
        </p>
      </div>

      <div v-if="trend" class="d-flex align-items-center gap-1">
        <span 
          class="badge rounded-pill px-2 py-1 fw-bold"
          :class="trendIsPositive ? 'bg-success-soft text-success' : 'bg-danger-soft text-danger'"
          style="font-size: 0.7rem;"
        >
          {{ trendIsPositive ? '↑' : '↓' }} {{ trend }}
        </span>
      </div>
    </div>

    <!-- Subtle accent line on top -->
    <div class="stat-top-accent position-absolute top-0 start-0 end-0" :class="`accent-${color}`"></div>
  </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  color: {
    type: String,
    default: 'orange' // 'orange', 'emerald', 'blue', 'rose'
  },
  trend: {
    type: String,
    default: ''
  },
  trendIsPositive: {
    type: Boolean,
    default: true
  },
  subtitle: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.luxury-stat-card {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 6px 16px -4px rgba(0, 0, 0, 0.02);
  border-color: rgba(15, 23, 42, 0.08) !important;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  min-height: 125px;
}

.luxury-stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px -6px rgba(0, 0, 0, 0.07);
  border-color: rgba(234, 122, 56, 0.3) !important;
}

.stat-icon-squircle {
  width: 36px;
  height: 36px;
  transition: transform 0.2s ease;
}

.luxury-stat-card:hover .stat-icon-squircle {
  transform: scale(1.05);
}

.icon-theme-orange {
  background-color: rgba(234, 122, 56, 0.12);
  color: #EA7A38;
}

.icon-theme-emerald {
  background-color: rgba(16, 185, 129, 0.12);
  color: #10b981;
}

.icon-theme-blue {
  background-color: rgba(59, 130, 246, 0.12);
  color: #3b82f6;
}

.icon-theme-rose {
  background-color: rgba(239, 68, 68, 0.12);
  color: #ef4444;
}

.bg-success-soft {
  background-color: rgba(16, 185, 129, 0.12);
}

.bg-danger-soft {
  background-color: rgba(239, 68, 68, 0.12);
}

.stat-top-accent {
  height: 3px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.luxury-stat-card:hover .stat-top-accent {
  opacity: 1;
}

.accent-orange { background: linear-gradient(90deg, #EA7A38, #f59e0b); }
.accent-emerald { background: linear-gradient(90deg, #10b981, #34d399); }
.accent-blue { background: linear-gradient(90deg, #3b82f6, #60a5fa); }
.accent-rose { background: linear-gradient(90deg, #ef4444, #f87171); }

[data-theme="dark"] .luxury-stat-card {
  background-color: #1e293b !important;
  border-color: rgba(255, 255, 255, 0.08) !important;
}

[data-theme="dark"] .stat-main-number {
  color: #f8fafc !important;
}
</style>
