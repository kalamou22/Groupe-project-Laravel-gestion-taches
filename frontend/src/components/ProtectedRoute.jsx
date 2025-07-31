import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading, isAuthenticated } = useAuth();

  console.log('🔒 ProtectedRoute - État:', { user, loading, isAuthenticated });

  // Afficher un écran de chargement pendant la vérification de l'authentification
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
  if (!user || !isAuthenticated) {
    console.log('🔒 Redirection vers /login - Utilisateur non authentifié');
    return <Navigate to="/login" replace />;
  }

  // Rediriger vers le dashboard si l'utilisateur n'est pas admin mais essaie d'accéder à une page admin
  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  // Afficher le contenu protégé
  return children;
} 