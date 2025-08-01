#!/bin/bash

echo "🚀 Installation et configuration PostgreSQL pour Gestion de Tâches"
echo "================================================================"

# Vérifier si PostgreSQL est installé
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL n'est pas installé."
    echo "📦 Installation de PostgreSQL..."
    
    # Détecter le système d'exploitation
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        echo "🍎 Installation sur macOS..."
        brew install postgresql@14
        brew services start postgresql@14
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        echo "🐧 Installation sur Linux..."
        sudo apt-get update
        sudo apt-get install -y postgresql postgresql-contrib
        sudo systemctl start postgresql
        sudo systemctl enable postgresql
    else
        echo "❌ Système d'exploitation non supporté. Veuillez installer PostgreSQL manuellement."
        exit 1
    fi
else
    echo "✅ PostgreSQL est déjà installé."
fi

# Créer la base de données
echo "🗄️  Configuration de la base de données..."

# Demander les informations de connexion
read -p "Nom d'utilisateur PostgreSQL (défaut: postgres): " DB_USER
DB_USER=${DB_USER:-postgres}

read -s -p "Mot de passe PostgreSQL: " DB_PASSWORD
echo

read -p "Nom de la base de données (défaut: gestion_taches): " DB_NAME
DB_NAME=${DB_NAME:-gestion_taches}

# Créer la base de données
echo "📝 Création de la base de données '$DB_NAME'..."
createdb -U $DB_USER $DB_NAME 2>/dev/null || echo "⚠️  La base de données existe déjà ou erreur de création."

# Configuration du fichier .env
echo "⚙️  Configuration du fichier .env..."
cd backend

if [ ! -f .env ]; then
    cp ../backend/config/postgresql.env.example .env
    echo "✅ Fichier .env créé à partir du template."
else
    echo "⚠️  Le fichier .env existe déjà."
fi

# Mettre à jour les variables de base de données dans .env
sed -i.bak "s/DB_USERNAME=postgres/DB_USERNAME=$DB_USER/" .env
sed -i.bak "s/DB_PASSWORD=votre_mot_de_passe_postgres/DB_PASSWORD=$DB_PASSWORD/" .env
sed -i.bak "s/DB_DATABASE=gestion_taches/DB_DATABASE=$DB_NAME/" .env

echo "✅ Configuration de la base de données terminée."
echo ""
echo "📋 Prochaines étapes :"
echo "1. Vérifiez que PostgreSQL fonctionne : psql -U $DB_USER -d $DB_NAME"
echo "2. Installez les dépendances PHP : composer install"
echo "3. Générez la clé d'application : php artisan key:generate"
echo "4. Exécutez les migrations : php artisan migrate"
echo "5. Seedez les données : php artisan db:seed"
echo "6. Démarrez le serveur : php artisan serve"
echo ""
echo "🎉 Configuration PostgreSQL terminée !" 