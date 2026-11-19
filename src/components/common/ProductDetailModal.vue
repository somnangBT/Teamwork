<template>
  <BaseModal v-model="visible" :title="product?.name || 'Product Details'" :size="activeTab === 'studio' ? 'xl' : 'md'">
    <div v-if="product" class="d-flex flex-column gap-3">
      <!-- Mode Switcher: Product Info vs Virtual Try-On Studio -->
      <div class="d-flex align-items-center justify-content-between gap-2 pb-2 border-bottom" style="border-color: var(--border-clr, #e2e8f0) !important;">
        <div class="d-inline-flex p-1 rounded-pill border" style="background: var(--surface-ground, #f8fafc); border-color: var(--border-clr, #e2e8f0) !important;">
          <button
            type="button"
            class="btn btn-sm rounded-pill px-3 fw-semibold border-0"
            :class="activeTab === 'info' ? 'bg-white text-dark border' : 'text-muted'"
            @click="activeTab = 'info'"
          >
            Product Details
          </button>
          <button
            type="button"
            class="btn btn-sm rounded-pill px-3 fw-semibold border-0 d-inline-flex align-items-center gap-1"
            :class="activeTab === 'studio' ? 'text-white' : 'text-muted'"
            :style="activeTab === 'studio' ? 'background: var(--primary-color, #EA7A38);' : ''"
            @click="activeTab = 'studio'"
          >
            <Sparkles :size="14" />
            <span>Virtual Try-On Studio</span>
          </button>
        </div>

        <span class="small text-muted d-none d-sm-inline">
          {{ activeTab === 'studio' ? 'Preview how this look styles on a character' : 'Click Virtual Try-On to preview look' }}
        </span>
      </div>

      <!-- TAB 1: PRODUCT DETAILS -->
      <div v-if="activeTab === 'info'" class="row g-4 align-items-center">
        <div class="col-12 col-md-5">
          <div class="rounded-4 overflow-hidden border position-relative" style="aspect-ratio: 1 / 1; border-color: var(--border-clr, #e2e8f0) !important;">
            <img :src="product.image" :alt="product.name" class="w-100 h-100 object-fit-cover" />
            <span
              v-if="product.tag"
              class="position-absolute top-0 start-0 m-2 badge rounded-pill text-white"
              style="background: var(--primary-color, #EA7A38);"
            >
              {{ product.tag }}
            </span>
          </div>
        </div>

        <div class="col-12 col-md-7 d-flex flex-column gap-3">
          <div class="d-flex flex-wrap align-items-center justify-content-between gap-2">
            <span class="badge bg-light text-muted border px-2 py-1 rounded-pill">{{ product.category }}</span>
            <BaseBadge :status="product.status || 'In Stock'" size="sm" />
          </div>

          <div>
            <h4 class="fw-bold mb-1" style="color: var(--text-heading-color);">{{ product.name }}</h4>
            <div class="d-flex align-items-baseline gap-2">
              <span class="fs-3 fw-bolder text-primary">{{ product.price }}</span>
              <span class="text-muted small">{{ product.stock }} units available</span>
            </div>
          </div>

          <p class="text-muted small mb-0" style="line-height: 1.6;">
            {{ product.description }}
          </p>

          <div class="d-flex align-items-center gap-2 pt-2">
            <div class="d-flex align-items-center border rounded-3 px-2 py-1 gap-2">
              <button
                type="button"
                class="btn btn-sm border-0 fw-bold"
                aria-label="Decrease quantity"
                @click="quantity = Math.max(1, quantity - 1)"
              >
                -
              </button>
              <span class="fw-bold px-2">{{ quantity }}</span>
              <button
                type="button"
                class="btn btn-sm border-0 fw-bold"
                aria-label="Increase quantity"
                @click="quantity = Math.min(Math.max(1, product.stock), quantity + 1)"
              >
                +
              </button>
            </div>

            <BaseButton
              variant="primary"
              class="flex-grow-1"
              :disabled="product.stock <= 0"
              @click="handleAddToBag"
            >
              <ShoppingBag :size="16" />
              <span>{{ product.stock <= 0 ? 'Out of Stock' : 'Add to Bag' }}</span>
            </BaseButton>

            <button
              type="button"
              class="btn btn-outline-secondary rounded-3 d-flex align-items-center justify-content-center"
              style="width: 42px; height: 42px;"
              :class="{ 'text-danger border-danger': isFav }"
              :aria-label="isFav ? 'Remove from favorites' : 'Save to favorites'"
              @click="$emit('favorite', product)"
            >
              <Heart :size="18" :fill="isFav ? 'currentColor' : 'none'" />
            </button>
          </div>

          <button
            type="button"
            class="btn btn-outline-dark rounded-pill fw-semibold d-flex align-items-center justify-content-center gap-2 py-2"
            @click="activeTab = 'studio'"
          >
            <Sparkles :size="16" />
            <span>Try On / Preview in Virtual Studio</span>
          </button>
        </div>
      </div>

      <!-- TAB 2: VELL VIRTUAL TRY-ON STUDIO -->
      <div v-else class="d-flex flex-column gap-3">
        <div class="rounded-4 overflow-hidden border" style="border-color: var(--border-clr, #e2e8f0) !important; background: #cfd2d4;">
          <iframe
            src="/vell-studio.html"
            title="VELL Virtual Styling Studio"
            class="w-100 border-0 d-block"
            style="height: 620px;"
          ></iframe>
        </div>

        <div class="d-flex flex-wrap align-items-center justify-content-between gap-3 pt-1">
          <div class="d-flex align-items-center gap-3">
            <img :src="product.image" :alt="product.name" class="rounded-3 border object-fit-cover" style="width: 46px; height: 46px;" />
            <div>
              <div class="fw-bold small" style="color: var(--text-heading-color);">{{ product.name }}</div>
              <div class="fw-bolder text-primary small">{{ product.price }}</div>
            </div>
          </div>

          <BaseButton
            variant="primary"
            :disabled="product.stock <= 0"
            @click="handleAddToBag"
          >
            <ShoppingBag :size="16" />
            <span>{{ product.stock <= 0 ? 'Out of Stock' : 'Add to Bag' }}</span>
          </BaseButton>
        </div>
      </div>
    </div>
  </BaseModal>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ShoppingBag, Heart, Sparkles } from '@lucide/vue'
import { useProfile } from '../../composables/useProfile'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  product: { type: Object, default: null }
})

const emit = defineEmits(['update:modelValue', 'buy', 'favorite'])
const { isProductFavorite } = useProfile()

const quantity = ref(1)
const activeTab = ref('info')

watch(() => props.product, () => {
  quantity.value = 1
  activeTab.value = 'info'
})

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
})

const isFav = computed(() => (props.product ? isProductFavorite(props.product.id) : false))

const handleAddToBag = () => {
  if (!props.product) return
  emit('buy', props.product, quantity.value)
  visible.value = false
}
</script>
