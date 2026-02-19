# Contribuer a auklm

Merci de vouloir contribuer ! Voici les regles pour que tout se passe bien.

## Setup

Voir le [README](README.md) pour l'installation et la configuration.

## Workflow

1. Cree une branche depuis `main` :
   - `feat/nom-feature` pour une nouvelle fonctionnalite
   - `fix/nom-bug` pour un correctif
   - `docs/sujet` pour la documentation
   - `refactor/sujet` pour du refactoring

2. Fais tes modifications

3. Ouvre une Pull Request vers `main` avec une description claire

> Seul le mainteneur peut push directement sur `main`. Toute contribution passe par une PR.

## Commits

On utilise les [Conventional Commits](https://www.conventionalcommits.org/) :

```
feat: ajouter le calendrier mensuel
fix: corriger le calcul de prediction
docs: mettre a jour le README
refactor: simplifier le composable useCycle
```

## Conventions de code

- **TypeScript** partout
- **Vue 3 Composition API** avec `<script setup lang="ts">`
- **CSS scoped** avec convention BEM (`.block__element--modifier`)
- **Variables CSS** du design system (`var(--color-accent)`, `var(--space-4)`, etc.)
- Pas de Tailwind — CSS custom uniquement

## Structure du projet

```
app/
  components/    Composants UI (calendrier, dashboard, historique)
  composables/   Logique metier (useCycle)
  middleware/    Auth guard
  pages/         Pages (index, login)
  utils/         Client auth
server/
  api/           Routes API (auth, dates)
  db/            Schema Drizzle
  utils/         Singletons (DB, auth)
```

## Tests

Pas de tests automatises pour l'instant. Teste manuellement tes changements avant de soumettre ta PR :
- Verifie sur mobile (PWA)
- Verifie la page login
- Verifie le calendrier et l'historique
