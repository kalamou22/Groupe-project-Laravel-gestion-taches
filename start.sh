#!/bin/bash

echo "🚀 Démarrage de Gestion de tâches..."
echo "================================"

# Vérifier si les dossiers existent
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Erreur: Les dossiers backend et frontend doivent exister"
    exit 1
fi

# Démarrer le backend Laravel
echo "📦 Démarrage du backend Laravel..."
cd backend

# Vérifier si .env existe
if [ ! -f ".env" ]; then
    echo "⚠️  Fichier .env non trouvé. Copie depuis .env.example..."
    cp .env.example .env
    echo "🔑 Génération de la clé d'application..."
    php artisan key:generate
fi

# Vérifier si les migrations ont été exécutées
if [ ! -f ".migrated" ]; then
    echo "🗄️  Exécution des migrations..."
    php artisan migrate --force
    touch .migrated
fi

# Démarrer le serveur Laravel en arrière-plan
echo "🌐 Démarrage du serveur Laravel sur http://localhost:8000"
php artisan serve --host=0.0.0.0 --port=8000 > ../laravel.log 2>&1 &
LARAVEL_PID=$!

cd ..

# Démarrer le frontend React
echo "⚛️  Démarrage du frontend React..."
cd frontend

# Vérifier si node_modules existe
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances npm..."
    npm install
fi

# Démarrer le serveur React en arrière-plan
echo "🌐 Démarrage du serveur React sur http://localhost:3000"
npm start > ../react.log 2>&1 &
REACT_PID=$!

cd ..

echo ""
echo "✅ Gestion de tâches est en cours de démarrage..."
echo "📊 Backend Laravel: http://localhost:8000"
echo "🎨 Frontend React: http://localhost:3000"
echo ""
echo "📝 Logs:"
echo "   Backend: tail -f laravel.log"
echo "   Frontend: tail -f react.log"
echo ""
echo "🛑 Pour arrêter: ./stop.sh"
echo ""

# Fonction pour arrêter proprement les processus
cleanup() {
    echo ""
    echo "🛑 Arrêt de Gestion de tâches..."
    kill $LARAVEL_PID 2>/dev/null
    kill $REACT_PID 2>/dev/null
    echo "✅ Arrêt terminé"
    exit 0
}

# Capturer Ctrl+C
trap cleanup SIGINT

# Attendre que les processus se terminent
wait 