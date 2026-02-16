<template>
  <div class="desktop-block">
    <div class="desktop-block__bg">
      <div class="desktop-block__blob desktop-block__blob--1" />
      <div class="desktop-block__blob desktop-block__blob--2" />
      <div class="desktop-block__blob desktop-block__blob--3" />
      <div class="desktop-block__blob desktop-block__blob--4" />
    </div>

    <div class="desktop-block__center">
      <h1 class="desktop-block__title">aulala</h1>
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
    <InstallPrompt />
  </div>
</template>
