<template>
  <div class="notfound-wrapper p-3">
    <div class="notfound-content flex-column text-center gap-3 p-5 border">
      <h1 class="fw-bold text-primary display-1 mb-0">404</h1>
      <h2 class="fw-semibold h4" style="color: var(--text-heading-color);">Page Not Found</h2>
      <p class="text-muted small mb-3" style="max-width: 420px;">
        The page you are looking for doesn't exist or has been moved. Let's take you back to Tiki Tiki Pet Salon.
      </p>
      <div class="d-flex flex-wrap justify-content-center gap-2">
        <BaseButton variant="primary" @click="$router.push('/')">Return Home</BaseButton>
        <BaseButton variant="outline-secondary" @click="$router.push('/services')">Browse Services</BaseButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.notfound-wrapper {
  min-height: 100vh;
  width: 100%;
  background-color: var(--surface-ground);
  display: flex;
}

.notfound-content {
  flex: 1;
  background-color: var(--body-bg-color);
  border-radius: var(--border-radius, 16px);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
