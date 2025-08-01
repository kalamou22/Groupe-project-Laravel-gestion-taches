# 🚀 Gestion de Tâches - Application Web Complète

Une application moderne de gestion de projets et de tâches développée avec **Laravel** (backend) et **React** (frontend).

## 📋 Fonctionnalités

### 👥 Gestion des Utilisateurs
- **Authentification sécurisée** avec JWT
- **Rôles utilisateurs** (Admin, Développeur, Designer, etc.)
- **Profils personnalisés** avec avatars

### 📊 Gestion des Projets
- **Création et gestion** de projets
- **Tableau de bord** avec statistiques en temps réel
- **Progression visuelle** avec barres de progression
- **Vue Kanban** pour organiser les tâches

### ✅ Gestion des Tâches
- **Création et assignation** de tâches
- **Statuts multiples** (En attente, En cours, Terminée)
- **Dates d'échéance** et priorités
- **Commentaires** et collaboration
- **Drag & Drop** pour changer les statuts

### 📈 Analytics et Rapports
- **Statistiques détaillées** par projet
- **Graphiques interactifs** (Recharts)
- **Rapports de productivité**
- **Métriques d'équipe**

### 🎨 Interface Moderne
- **Design responsive** avec Tailwind CSS
- **Animations fluides** et transitions
- **Mode sombre/clair**
- **Interface intuitive** et accessible

## 🛠️ Technologies Utilisées

### Backend (Laravel)
- **Laravel 10** - Framework PHP
- **Laravel Sanctum** - Authentification API
- **PostgreSQL** - Base de données
- **Eloquent ORM** - Gestion des données
- **API RESTful** - Architecture API

### Frontend (React)
- **React 18** - Bibliothèque JavaScript
- **React Router** - Navigation
- **Tailwind CSS** - Framework CSS
- **Recharts** - Graphiques
- **Axios** - Client HTTP
- **Context API** - Gestion d'état

## 🚀 Installation

### Prérequis
- PHP 8.1+
- Composer
- Node.js 16+
- PostgreSQL 12+
- Git

### 1. Cloner le projet
```bash
git clone https://github.com/kalamou22/Groupe-project-Laravel-gestion-taches.git
cd Groupe-project-Laravel-gestion-taches
```

### 2. Configuration Backend (Laravel)
```bash
# Installer les dépendances PHP
cd backend
composer install

# Copier le fichier d'environnement
cp .env.example .env

# Générer la clé d'application
php artisan key:generate

# Configurer la base de données PostgreSQL dans .env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=gestion_taches
DB_USERNAME=postgres
DB_PASSWORD=votre_mot_de_passe

# Exécuter les migrations
php artisan migrate

# Seeder les données de test
php artisan db:seed

# Démarrer le serveur Laravel
php artisan serve
```

### 3. Configuration Frontend (React)
```bash
# Installer les dépendances Node.js
cd frontend
npm install

# Démarrer le serveur de développement
npm start
```

### 4. Accès à l'application
- **Frontend** : http://localhost:3000
- **Backend API** : http://localhost:8000

## 👤 Comptes de Test

### Administrateur
- **Email** : admin@infyproject.com
- **Mot de passe** : password

### Utilisateur Test
- **Email** : user@example.com
- **Mot de passe** : password

## 📁 Structure du Projet

```
Gestion_taches/
├── backend/                 # API Laravel
│   ├── app/
│   │   ├── Http/Controllers/
│   │   ├── Models/
│   │   └── Providers/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   └── routes/
├── frontend/               # Application React
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── hooks/
│   └── public/
└── README.md
```

## 🔧 Configuration

### Variables d'Environnement Backend (.env)
```env
APP_NAME="Gestion de Tâches"
APP_ENV=local
APP_KEY=base64:...
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=gestion_taches
DB_USERNAME=postgres
DB_PASSWORD=votre_mot_de_passe

CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### Variables d'Environnement Frontend
```env
REACT_APP_API_URL=http://localhost:8000/api
```

## 🚀 Déploiement

### Production
1. **Backend** : Configurer un serveur web (Apache/Nginx) avec PHP
2. **Frontend** : Build de production avec `npm run build`
3. **Base de données** : Configurer PostgreSQL en production
4. **Variables d'environnement** : Adapter les URLs et configurations

### Docker (Optionnel)
```bash
# Backend
docker build -t gestion-taches-backend ./backend
docker run -p 8000:8000 gestion-taches-backend

# Frontend
docker build -t gestion-taches-frontend ./frontend
docker run -p 3000:3000 gestion-taches-frontend
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👨‍💻 Auteur

**Kalamou**
- Email : kalamou2021@gmail.com
- GitHub : [@kalamou22](https://github.com/kalamou22)

## 🙏 Remerciements

- **Laravel** pour le framework backend
- **React** pour la bibliothèque frontend
- **Tailwind CSS** pour le framework CSS
- **Recharts** pour les graphiques
- **PostgreSQL** pour la base de données
- **Tous les contributeurs** qui ont participé au projet

---

⭐ Si ce projet vous plaît, n'oubliez pas de le star sur GitHub ! 