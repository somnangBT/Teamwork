<template>
  <div class="forbidden-wrapper p-3">
    <div class="forbidden-content flex-column text-center gap-3 p-5 border">
      <h1 class="fw-bold text-danger display-1 mb-0">403</h1>
      <h2 class="fw-semibold h4" style="color: var(--text-heading-color);">Access Denied</h2>
      <p class="text-muted small mb-3" style="max-width: 420px;">
        You don't have permission to access this area. Please sign in with an authorized account.
      </p>
      <div class="d-flex flex-wrap justify-content-center gap-2">
        <BaseButton variant="primary" @click="$router.push('/')">Return Home</BaseButton>
        <BaseButton variant="outline-secondary" @click="$router.push('/login')">Sign In</BaseButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.forbidden-wrapper {
  min-height: 100vh;
  width: 100%;
  background-color: var(--surface-ground);
  display: flex;
}

.forbidden-content {
  flex: 1;
  background-color: var(--body-bg-color);
  border-radius: var(--border-radius, 16px);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
