<script setup lang="ts">
const route = useRoute()
const showTabBar = computed(() => route.path === '/' || route.path === '/account')
</script>

<template>
  <div class="desktop-block">
    <div class="desktop-block__bg">
      <div class="desktop-block__blob desktop-block__blob--1" />
      <div class="desktop-block__blob desktop-block__blob--2" />
      <div class="desktop-block__blob desktop-block__blob--3" />
      <div class="desktop-block__blob desktop-block__blob--4" />
    </div>

    <div class="desktop-block__center">
      <div class="desktop-block__brand">
        <h1 class="desktop-block__title">auklm</h1>
        <img src="/drop.svg" width="32" height="32" alt="" class="desktop-block__icon" />
      </div>
      <p class="desktop-block__sub">suivi de cycle</p>
      <p class="desktop-block__about">
        Suis ton cycle menstruel, enregistre tes dates<br>et obtiens des estimations personnalisees.
      </p>
      <div class="desktop-block__cta">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" class="desktop-block__cta-icon">
          <rect x="4" y="1.5" width="8" height="13" rx="1.5" stroke="currentColor" stroke-width="1.2"/>
          <line x1="6.5" y1="12.5" x2="9.5" y2="12.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
        </svg>
        <span>Ouvre ce lien sur ton telephone</span>
      </div>
    </div>
  </div>

  <div class="app-shell">
    <NuxtPage />

    <nav v-if="showTabBar" class="tab-bar">
      <NuxtLink to="/" class="tab-bar__item" :class="{ 'tab-bar__item--active': route.path === '/' }">
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" class="tab-bar__icon">
          <circle cx="11" cy="11" r="9" fill="currentColor" class="tab-bar__fill" />
          <circle cx="11" cy="11" r="8.5" stroke="currentColor" stroke-width="1.4"/>
          <path d="M11 6.5V11L14 13" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="tab-bar__label">Cycle</span>
      </NuxtLink>
      <NuxtLink to="/account" class="tab-bar__item" :class="{ 'tab-bar__item--active': route.path === '/account' }">
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" class="tab-bar__icon">
          <circle cx="11" cy="8.5" r="4" fill="currentColor" class="tab-bar__fill" />
          <circle cx="11" cy="8.5" r="3.5" stroke="currentColor" stroke-width="1.4"/>
          <path d="M4.5 18.5C4.5 15.46 7.41 13 11 13C14.59 13 17.5 15.46 17.5 18.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
        </svg>
        <span class="tab-bar__label">Compte</span>
      </NuxtLink>
    </nav>

    <InstallPrompt />
    <AppToast />
  </div>
</template>
