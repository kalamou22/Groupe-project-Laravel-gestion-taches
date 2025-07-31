#!/bin/bash

echo "🛑 Arrêt de l'application Gestion de tâches..."

# Arrêter le serveur Laravel
if pgrep -f "php artisan serve" > /dev/null; then
    echo "📡 Arrêt du serveur Laravel..."
    pkill -f "php artisan serve"
    echo "✅ Serveur Laravel arrêté"
else
    echo "⚠️  Le serveur Laravel n'était pas en cours d'exécution"
fi

# Arrêter le serveur React
if pgrep -f "react-scripts start" > /dev/null; then
echo "⚛️  Arrêt du serveur React..."
    pkill -f "react-scripts start"
    echo "✅ Serveur React arrêté"
else
    echo "⚠️  Le serveur React n'était pas en cours d'exécution"
fi

echo ""
echo "🎉 Application Gestion de tâches arrêtée avec succès !"
echo "" 