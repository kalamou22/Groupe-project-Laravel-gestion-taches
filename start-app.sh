#!/bin/bash

echo "🚀 Démarrage de l'application Gestion de Tâches..."

# Obtenir le répertoire du script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Démarrer le backend Laravel
echo "📡 Démarrage du serveur backend (Laravel)..."
cd "$SCRIPT_DIR/backend" && php artisan serve &
BACKEND_PID=$!

# Attendre un peu que le backend démarre
sleep 3

# Démarrer le frontend React
echo "⚛️  Démarrage du serveur frontend (React)..."
cd "$SCRIPT_DIR/frontend" && npm start &
FRONTEND_PID=$!

echo "✅ Application démarrée !"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:8000"
echo ""
echo "Pour arrêter les serveurs: Ctrl+C"

# Attendre que les processus se terminent
wait $BACKEND_PID $FRONTEND_PID