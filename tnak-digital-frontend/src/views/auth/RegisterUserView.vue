<template>
    <div class="auth-container d-flex flex-column align-items-center justify-content-center min-vh-100 position-relative"
        style="background-color: var(--body-bg-color);">

        <div class="auth-content text-center" style="max-width: 440px; width: 100%; padding: 0 24px;">

            <!-- Verification Success State with Default Password -->
            <div v-if="showSuccessState" class="success-panel text-stage">
                <div class="icon-stage position-relative mx-auto mb-4 d-flex align-items-center justify-content-center" style="width: 80px; height: 80px;">
                    <Fingerprint class="auth-icon" style="color: var(--success-color); transform: scale(1.1);" :size="32" stroke-width="1.5" />
                </div>
                <h2 class="mb-3 text-heading-color" style="font-size: 1.75rem; font-weight: 600;">
                    Verification Successful!
                </h2>
                <p class="text-base mb-4" style="font-size: 0.95rem; line-height: 1.6;">
                    Your administrator account has been verified. Use the temporary password below to log in.
                </p>
                <div class="p-3 rounded mb-4 d-flex align-items-center justify-content-between" 
                     style="background-color: var(--surface-ground); border: 1px solid var(--border-clr);">
                    <span class="fw-semibold text-heading-color" style="font-size: 1.1rem; font-family: monospace; user-select: all; word-break: break-all; padding-right: 12px;">
                        {{ generatedPassword }}
                    </span>
                    <button @click="copyPassword" class="btn btn-sm btn-outline-primary py-1 px-3 text-nowrap" style="font-size: 0.85rem;">
                        {{ isCopied ? 'Copied!' : 'Copy' }}
                    </button>
                </div>
                <button @click="goToLogin" class="auth-btn position-relative w-100 d-flex align-items-center justify-content-center gap-2 overflow-hidden">
                    <span class="btn-bg position-absolute top-0 start-0 w-100 h-100"></span>
                    <span class="btn-content position-relative z-1 d-flex align-items-center gap-2">
                        Continue to Login
                    </span>
                    <ArrowRight class="btn-arrow position-relative z-1" :size="18" />
                </button>
            </div>

            <div v-else>
                <!-- Sleek Icon with "Scanning" Ring -->
                <div class="icon-stage position-relative mx-auto mb-5 d-flex align-items-center justify-content-center">
                    <!-- SVG Ring that draws itself -->
                    <svg class="progress-ring position-absolute top-0 start-0 w-100 h-100" viewBox="0 0 100 100">
                        <circle class="ring-bg" cx="50" cy="50" r="48" fill="none" :stroke="'var(--border-clr)'"
                            stroke-width="1.5" />
                        <circle class="ring-progress" cx="50" cy="50" r="48" fill="none" :stroke="'var(--primary-color)'"
                            stroke-width="1.5" stroke-linecap="round" />
                    </svg>

                    <Fingerprint class="auth-icon" :size="32" color="var(--text-heading-color)" stroke-width="1.5" />
                    <div class="laser-line position-absolute w-100 start-0"></div>
                </div>

                <div class="text-stage">
                    <div class="line-mask overflow-hidden mb-2">
                        <h1 class="auth-title m-0 text-heading-color"
                            style="font-size: 2.25rem; font-weight: 600; letter-spacing: -0.04em;">
                            Verify Identity
                        </h1>
                    </div>
                    <div class="line-mask overflow-hidden mb-5">
                        <p class="auth-desc m-0 text-base" style="font-size: 1.05rem; line-height: 1.5; font-weight: 400;">
                            Secure access to your unified workspace.
                        </p>
                    </div>
                </div>

                <div class="btn-stage">
                    <button @click="onSubmit()"
                        class="auth-btn position-relative w-100 d-flex align-items-center justify-content-center gap-2 overflow-hidden"
                        :disabled="isLoading">
                        <span class="btn-bg position-absolute top-0 start-0 w-100 h-100"></span>
                        <span class="btn-content position-relative z-1 d-flex align-items-center gap-2">
                            <Loader2 v-if="isLoading" class="spin" :size="18" />
                            {{ isLoading ? 'Authenticating' : 'Authorize' }}
                        </span>
                        <ArrowRight v-if="!isLoading" class="btn-arrow position-relative z-1" :size="18" />
                    </button>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
import { useUserStore } from '@/stores/users/user';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Fingerprint, ArrowRight, Loader2 } from '@lucide/vue';
import gsap from 'gsap';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const isLoading = ref(false);

const showSuccessState = ref(false);
const generatedPassword = ref('');
const isCopied = ref(false);

const copyPassword = async () => {
    try {
        await navigator.clipboard.writeText(generatedPassword.value);
        isCopied.value = true;
        setTimeout(() => {
            isCopied.value = false;
        }, 2000);
    } catch (err) {
        console.error("Failed to copy password: ", err);
    }
};

const goToLogin = () => {
    router.push({ name: 'login' });
};

onMounted(() => {
    const tl = gsap.timeline();

    gsap.set('.auth-title', { yPercent: 100 });
    gsap.set('.auth-desc', { yPercent: 100 });
    gsap.set('.auth-btn', { opacity: 0, y: 15 });
    gsap.set('.auth-icon', { scale: 0.8, opacity: 0 });

    tl.to('.auth-icon', { scale: 1, opacity: 1, duration: 1.2, ease: 'expo.out' })
        .to('.ring-progress', { strokeDashoffset: 0, duration: 1.5, ease: 'power3.inOut' }, "-=0.8")
        .to('.auth-title', { yPercent: 0, duration: 1, ease: 'expo.out' }, "-=1.2")
        .to('.auth-desc', { yPercent: 0, duration: 1, ease: 'expo.out' }, "-=1.1")
        .to('.auth-btn', { opacity: 1, y: 0, duration: 1, ease: 'expo.out' }, "-=0.9");
});

const onSubmit = async () => {
    isLoading.value = true;

    gsap.to('.laser-line', { opacity: 0.8, duration: 0.2 });
    gsap.fromTo('.laser-line',
        { y: 0 },
        { y: 80, duration: 1.5, ease: 'sine.inOut', repeat: -1, yoyo: true }
    );
    gsap.to('.progress-ring', { rotation: '+=360', duration: 2, repeat: -1, ease: 'linear', transformOrigin: '50% 50%' });

    const verifyToken = { token: route.query.token };
    const res = await userStore.requestRegisterAdmin(verifyToken);

    if (!res) {
        isLoading.value = false;
        gsap.killTweensOf('.laser-line');
        gsap.killTweensOf('.progress-ring');
        gsap.to('.laser-line', { opacity: 0, duration: 0.2 });
        gsap.to('.ring-progress', { strokeDashoffset: 301, duration: 0.5, ease: 'power2.out' });

        gsap.fromTo('.auth-content',
            { x: -5 },
            { x: 5, duration: 0.08, yoyo: true, repeat: 5, ease: 'linear', onComplete: () => gsap.set('.auth-content', { x: 0 }) }
        );
        return;
    }

    gsap.killTweensOf('.laser-line');
    gsap.killTweensOf('.progress-ring');

    const outroTl = gsap.timeline();
    outroTl.to('.laser-line', { opacity: 0, duration: 0.2 })
        .to('.ring-progress', { strokeDashoffset: 0, stroke: 'var(--success-color)', duration: 0.4, ease: 'power2.out' })
        .to('.auth-icon', { color: 'var(--success-color)', scale: 1.1, duration: 0.4, ease: 'back.out(2)' }, "-=0.4")
        .to('.auth-title', { yPercent: -100, opacity: 0, duration: 0.6, ease: 'expo.in' }, "+=0.3")
        .to('.auth-desc', { yPercent: -100, opacity: 0, duration: 0.6, ease: 'expo.in' }, "-=0.5")
        .to('.auth-btn', { y: 20, opacity: 0, duration: 0.6, ease: 'expo.in' }, "-=0.5")
        .to('.icon-stage', { scale: 0, opacity: 0, duration: 0.6, ease: 'expo.in' }, "-=0.3")
        .add(() => {
            if (res && res.defaultPassword) {
                generatedPassword.value = res.defaultPassword;
                showSuccessState.value = true;
            } else {
                router.push({ name: 'login' });
            }
        });
}
</script>

<style scoped>
.icon-stage {
    width: 80px;
    height: 80px;
}

.progress-ring {
    /* SVG Ring Setup */
    overflow: visible;
}

.ring-progress {
    stroke-dasharray: 301;
    stroke-dashoffset: 301;
    transform-origin: 50% 50%;
    transform: rotate(-90deg);
}

.laser-line {
    height: 1px;
    background: var(--primary-color);
    box-shadow: 0 0 10px var(--primary-color);
    top: 0;
    opacity: 0;
}

.line-mask {
    padding-bottom: 2px;
}

/* Custom Minimalist Button */
.auth-btn {
    background: transparent;
    border: 1px solid var(--border-clr);
    border-radius: 8px;
    height: 52px;
    cursor: pointer;
    transition: border-color 0.3s ease;
    outline: none;
    color: var(--text-heading-color);
}

.auth-btn:hover {
    border-color: var(--primary-color);
}

.btn-bg {
    background: var(--surface-ground);
    transform: translateY(101%);
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.auth-btn:hover .btn-bg {
    transform: translateY(0);
}

.auth-btn:hover .btn-arrow {
    transform: translateX(4px);
}

.btn-arrow {
    transition: transform 0.3s ease;
}

.spin {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}
</style>