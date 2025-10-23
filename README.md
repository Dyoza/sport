# Programme Sportif Ultra

Une application complète pour orchestrer tes entraînements quotidiens : planification intelligente, suivi de progression, bibliothèque d'exercices et enregistrement des séances. L'interface web immersive est alimentée par un backend FastAPI et une base SQLite préremplie.

## Aperçu des fonctionnalités

- **Tableau de bord dynamique** : focus du jour, séance à réaliser, aperçu des séances à venir.
- **Visualisations interactives** : courbes de charge tonnage, fréquence cardiaque au repos et variabilité HRV sur 30 jours.
- **Bilan hebdomadaire intelligent** : synthèse du volume réalisé, intensité moyenne, calories estimées et taux d'adhérence au plan.
- **Suivi de streak** : calcul automatique des jours consécutifs d'entraînement pour entretenir la motivation.
- **Suivi récupération & habitudes** : hydratation, sommeil, humeur et score de préparation sur les deux dernières semaines.
- **Calendrier adaptatif** : planification hebdomadaire des blocs d'entraînement avec validation automatique des séances réalisées.
- **Journal de performance** : formulaire ergonomique pour enregistrer chaque séance (durée, RPE, calories, notes).
- **Historique instantané** : fil des dernières séances enregistrées avec ressentis, énergie et indicateurs clés.
- **Bibliothèque d'exercices** : fiches détaillées avec points clés et vidéos de démonstration.

## Structure du projet

```
backend/
  app/
    main.py          # Application FastAPI et routes REST
    crud.py          # Logique d'accès aux données et agrégations
    models.py        # Modèles SQLModel (SQLite)
    schemas.py       # Schémas Pydantic pour les réponses API
    database.py      # Configuration de la base et session
    seed.py          # Script de génération de données réalistes
  requirements.txt   # Dépendances Python
frontend/
  src/
    App.tsx et composants React + Tailwind CSS
  package.json       # Dépendances et scripts Vite
README.md            # Guide d'installation et d'utilisation
```

## Prérequis

- Python 3.10+
- Node.js 18+
- npm ou yarn

## Installation et lancement

### 1. Backend FastAPI

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # sous Windows: .venv\Scripts\activate
pip install -r requirements.txt
python -m app.seed  # initialise la base de données avec un programme complet
uvicorn app.main:app --reload
```

Le serveur est disponible sur http://localhost:8000 et expose l'API sous `/api/*`.

### 2. Frontend React

Dans un nouveau terminal :

```bash
cd frontend
npm install
# optionnel : définir l'URL de l'API (par défaut `http://localhost:8000/api` via proxy Vite)
echo "VITE_API_URL=http://localhost:8000/api" > .env.local
npm run dev
```

L'interface est accessible sur http://localhost:5173 et se connecte automatiquement à l'API locale.

### 3. Build de production

```bash
# Frontend
cd frontend
npm run build

# Backend
cd ../backend
uvicorn app.main:app  # lancer sans --reload en production
```

## Données initiales

Le script `app/seed.py` crée :

- Un catalogue d'exercices force, cardio et mobilité.
- Trois entraînements structurés avec séquences et tempos.
- Une programmation hebdomadaire (5 séances) pour nourrir le calendrier.
- Des logs de récupération sur 3 semaines et des métriques de performance sur 30 jours.

Tu peux relancer `python -m app.seed` pour régénérer les données si nécessaire (le script s'arrête s'il détecte déjà des enregistrements).

## Tests rapides de l'API

Une fois le backend lancé, vérifie le tableau de bord :

```bash
curl http://localhost:8000/api/dashboard | jq
curl http://localhost:8000/api/sessions/recent | jq
```

La documentation interactive est disponible sur http://localhost:8000/docs.

## Personnalisation

- Modifie `backend/app/seed.py` pour adapter les programmes, focus ou métriques.
- Ajoute tes propres séances via l'API `POST /api/workouts` (à implémenter selon tes besoins).
- Active/désactive les sections (bilan hebdomadaire, historique des séances, métriques...) depuis le panneau de personnalisation.
- Les styles Tailwind sont centralisés dans `frontend/src/index.css` et `tailwind.config.cjs` pour ajuster la palette, les ombres et les polices.

Bon entraînement !
