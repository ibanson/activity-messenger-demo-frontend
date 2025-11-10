# Activity Messenger – Demo Frontend

[![Vue.js](https://img.shields.io/badge/Vue.js-2.x-42b883?logo=vuedotjs&logoColor=white&style=for-the-badge)](https://vuejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4.3-38B2AC?logo=tailwindcss&logoColor=white&style=for-the-badge)](https://tailwindcss.com/)
[![PNPM](https://img.shields.io/badge/PNPM-9.0-F69220?logo=pnpm&logoColor=white&style=for-the-badge)](https://pnpm.io/)

Application frontend réalisée dans le cadre d’un **test technique**.
Ce projet est une Single Page Application (SPA) construite avec **Vue.js 2**, **Vue Router 3**, **Tailwind CSS 3.4.3** et **Axios** pour les appels HTTP.

> Ce dépôt illustre la mise en place d’un projet Vue 2 moderne avec Tailwind et gestion des états simples.
> Le but principal était de démontrer une approche structurée, lisible et réutilisable dans un temps limité.
> Par défaut, le frontend s’attend à ce que l’API backend soit disponible à l’adresse suivante : http://api.activitymessenger.local/v1  -> adapter l'URL si nécessaire pour que la communication se fasse correctement dans src/services/BoardService.js.

---

## Stack technique

- [Vue.js 2](https://v2.vuejs.org/) (via Vue CLI 5)
- [Vue Router 3](https://router.vuejs.org/)
- [Tailwind CSS 3.4.3](https://tailwindcss.com/)
- [Axios 1.12.2](https://axios-http.com/)
- [Core-JS](https://github.com/zloirock/core-js) pour la compatibilité
- [Docker](https://www.docker.com/) + [Docker Compose](https://docs.docker.com/compose/)
- [pnpm](https://pnpm.io/) comme gestionnaire de paquets ultra rapide

---

## 📁 Structure du projet

```bash
activity-messenger/
├─ docker-compose.yml                 # Orchestration principale (API, Frontend, DB, Nginx, Adminer)
│                                     # -> Dépôt cloné depuis : https://github.com/ibanson/activity-messenger-docker-config
│
├─ docker-config/                     # Configurations Docker partagées
│   ├─ api/
│   │   └─ Dockerfile                 # Image du backend (Laravel)
│   │
│   ├─ nginx/
│   │   ├─ Dockerfile                 # Image Nginx (reverse proxy)
│   │   └─ default.conf               # Configuration du serveur Nginx
│   │
│   └─ ssl/                           # (Optionnel) Certificats SSL de développement
│
├─ api/                               # Dépôt cloné depuis : https://github.com/ibanson/activity-messenger-demo-api
│   └─ (Code source du backend Laravel)
│
├─ frontend/                          # Dépôt cloné depuis : https://github.com/ibanson/activity-messenger-demo-frontend
│   └─ (Code source Vue.js 2)
│
├─ pg-data/                           # Volume local persistant pour PostgreSQL (non versionné)
│
└─ .gitignore                         # Ignore volumes, certificats, builds, etc.
```

## Project setup

### 1. Cloner le dépôt

```bash
git clone https://github.com/ibanson/activity-messenger-demo-frontend.git
cd activity-messenger-demo-frontend
```

### 2. Installer les dépendances

```bash
pnpm install
```

### 3. Lancer le serveur de développement

```bash
pnpm run serve
```

### Le projet sera accessible à l’adresse

```bash
http://localhost:8080
```