import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";
import { useUsers } from "../hooks/useUsers";
import { useProjects } from "../hooks/useProjects";
import Navbar from "../components/Navbar";
import TaskBoard from "../components/TaskBoard";
import TaskFilters from "../components/TaskFilters";
import AdvancedStats from "../components/AdvancedStats";
import ProjectCard from "../components/ProjectCard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

/**
 * Composant Dashboard - Tableau de bord principal de l'application
 * Affiche les statistiques, projets et graphiques de l'application
 */
export default function Dashboard() {
  // Hooks pour récupérer les données et fonctionnalités
  const { user } = useAuth();                    // Données de l'utilisateur connecté
  const { showSuccess, showError } = useNotifications();  // Fonctions de notification
  const { users } = useUsers();                  // Liste des utilisateurs
  const { projects, loading: projectsLoading } = useProjects();  // Liste des projets
  const navigate = useNavigate();                // Navigation programmatique

  // États locaux du composant
  const [loading, setLoading] = useState(true);  // État de chargement initial
  const [selectedTimeRange, setSelectedTimeRange] = useState("7d");  // Période sélectionnée pour les stats
  const [selectedView, setSelectedView] = useState("overview");  // Vue actuellement sélectionnée
  
  // État pour les statistiques animées
  const [animatedStats, setAnimatedStats] = useState({
    totalProjects: 0,      // Nombre total de projets
    completedTasks: 0,     // Nombre de tâches terminées
    pendingTasks: 0,       // Nombre de tâches en attente
    inProgressTasks: 0     // Nombre de tâches en cours
  });

  /**
   * Effet pour simuler le chargement initial
   * Affiche un loader pendant 1.5 secondes pour une meilleure UX
   */
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  /**
   * Effet pour calculer et animer les statistiques
   * Se déclenche quand les projets sont chargés
   */
  useEffect(() => {
    if (!loading && !projectsLoading) {
      // Calculer les statistiques à partir des projets
      const totalProjects = projects.length;
      const allTasks = projects.flatMap(project => project.tasks || []);
      const completedTasks = allTasks.filter(task => task.etat === 'terminée').length;
      const pendingTasks = allTasks.filter(task => task.etat === 'en attente').length;
      const inProgressTasks = allTasks.filter(task => task.etat === 'en cours').length;

      /**
       * Fonction pour animer progressivement une valeur
       * @param {number} start - Valeur de départ
       * @param {number} end - Valeur finale
       * @param {Function} setter - Fonction pour mettre à jour l'état
       * @param {string} key - Clé de la statistique à animer
       */
      const animateValue = (start, end, setter, key) => {
        const duration = 1000;  // Durée de l'animation en ms
        const steps = 30;       // Nombre d'étapes pour l'animation
        const increment = (end - start) / steps;
        let current = start;
        
        const timer = setInterval(() => {
          current += increment;
          if (current >= end) {
            current = end;
            clearInterval(timer);
          }
          setter(prev => ({ ...prev, [key]: Math.round(current) }));
        }, duration / steps);
      };

      // Animer chaque statistique
      animateValue(0, totalProjects, setAnimatedStats, 'totalProjects');
      animateValue(0, completedTasks, setAnimatedStats, 'completedTasks');
      animateValue(0, pendingTasks, setAnimatedStats, 'pendingTasks');
      animateValue(0, inProgressTasks, setAnimatedStats, 'inProgressTasks');
    }
  }, [loading, projectsLoading, projects]);

  // Données pour les graphiques
  /**
   * Données pour le graphique en secteurs (répartition des tâches)
   */
  const taskStatusData = [
    { name: 'Terminées', value: animatedStats.completedTasks, color: '#10B981' },
    { name: 'En cours', value: animatedStats.inProgressTasks, color: '#F59E0B' },
    { name: 'En attente', value: animatedStats.pendingTasks, color: '#EF4444' }
  ];

  /**
   * Données pour le graphique en barres (progression des projets)
   */
  const projectProgressData = projects.map(project => ({
    name: project.name.split(' ').slice(0, 2).join(' '),  // Nom raccourci du projet
    progress: Math.round((project.tasks?.filter(t => t.etat === 'terminée').length / (project.tasks?.length || 1)) * 100),
    budget: project.budget ? Math.round((project.spent / project.budget) * 100) : 0
  }));

  /**
   * Données pour le graphique linéaire (productivité hebdomadaire)
   */
  const weeklyData = [
    { day: 'Lun', tasks: 12, completed: 8 },
    { day: 'Mar', tasks: 15, completed: 12 },
    { day: 'Mer', tasks: 8, completed: 6 },
    { day: 'Jeu', tasks: 18, completed: 15 },
    { day: 'Ven', tasks: 22, completed: 18 },
    { day: 'Sam', tasks: 5, completed: 4 },
    { day: 'Dim', tasks: 3, completed: 3 }
  ];

  // Calculs pour les statistiques
  const totalTasks = animatedStats.completedTasks + animatedStats.pendingTasks + animatedStats.inProgressTasks;
  const completionRate = totalTasks > 0 ? Math.round((animatedStats.completedTasks / totalTasks) * 100) : 0;

  /**
   * Fonction pour obtenir le nom de l'utilisateur assigné à une tâche
   * @param {number} assignedTo - ID de l'utilisateur assigné
   * @returns {string} - Nom de l'utilisateur ou "Non assigné"
   */
  const getAssigneeName = (assignedTo) => {
    if (!assignedTo) return 'Non assigné';
    const user = users.find(u => u.id === assignedTo);
    return user ? user.name : 'Utilisateur inconnu';
  };

  // Affichage du loader pendant le chargement
  if (loading || projectsLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center">
          <div className="text-center">
            <div className="relative">
              {/* Spinner de chargement animé */}
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-400 border-t-transparent mx-auto"></div>
              <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-4 border-purple-400 opacity-20"></div>
            </div>
            <p className="mt-4 text-white text-lg font-medium">Chargement du tableau de bord...</p>
            {/* Barre de progression animée */}
            <div className="mt-2 w-64 bg-gray-700 rounded-full h-2 mx-auto overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      {/* Conteneur principal avec fond dégradé */}
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
        
        {/* En-tête de navigation avec sélecteurs */}
        <div className="bg-gradient-to-r from-purple-600/20 to-indigo-700/20 backdrop-blur-lg border-b border-purple-500/30">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              {/* Titre et nom d'utilisateur */}
              <div>
                <h1 className="text-2xl font-bold text-white">Système de Gestion</h1>
                <p className="text-purple-200">Bienvenue, {user?.name || 'Utilisateur'}</p>
              </div>
              
              {/* Contrôles de navigation */}
              <div className="flex items-center space-x-4">
                {/* Sélecteur de période */}
                <select 
                  value={selectedTimeRange}
                  onChange={(e) => setSelectedTimeRange(e.target.value)}
                  className="bg-purple-600/30 text-white border border-purple-400/50 rounded-lg px-3 py-2 text-sm backdrop-blur-sm"
                >
                  <option value="7d">7 derniers jours</option>
                  <option value="30d">30 derniers jours</option>
                  <option value="90d">3 derniers mois</option>
                </select>
                
                {/* Boutons de navigation entre les vues */}
                <div className="flex bg-purple-600/30 rounded-lg p-1">
                  {['overview', 'projects', 'analytics', 'kanban', 'stats'].map((view) => (
                    <button
                      key={view}
                      onClick={() => setSelectedView(view)}
                      className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                        selectedView === view 
                          ? 'bg-white text-purple-900 shadow-lg' 
                          : 'text-white hover:bg-purple-500/40'
                      }`}
                    >
                      {view === 'overview' ? 'Vue d\'ensemble' : 
                       view === 'projects' ? 'Projets' : 
                       view === 'analytics' ? 'Analytics' :
                       view === 'kanban' ? 'Kanban' : 'Statistiques'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu principal du tableau de bord */}
        <div className="max-w-7xl mx-auto p-6">
          
          {/* Cartes de statistiques avec animations */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { 
                title: "Projets Actifs", 
                value: animatedStats.totalProjects, 
                icon: "📊", 
                color: "from-indigo-500 to-purple-600",
                trend: "+12%"
              },
              { 
                title: "Tâches Terminées", 
                value: animatedStats.completedTasks, 
                icon: "✅", 
                color: "from-emerald-500 to-teal-600",
                trend: "+8%"
              },
              { 
                title: "En Cours", 
                value: animatedStats.inProgressTasks, 
                icon: "🔄", 
                color: "from-amber-500 to-orange-500",
                trend: "-3%"
              },
              { 
                title: "Taux de Réussite", 
                value: `${completionRate}%`, 
                icon: "🎯", 
                color: "from-pink-500 to-rose-500",
                trend: "+15%"
              }
            ].map((stat, index) => (
              <div 
                key={stat.title}
                className={`bg-gradient-to-r ${stat.color} rounded-xl p-6 text-white shadow-2xl transform hover:scale-105 transition-all duration-300 animate-fade-in-up`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">{stat.title}</p>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        stat.trend.startsWith('+') ? 'bg-green-400/20 text-green-100' : 'bg-red-400/20 text-red-100'
                      }`}>
                        {stat.trend}
                      </span>
                    </div>
                  </div>
                  <div className="text-4xl opacity-80">{stat.icon}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Contenu principal selon la vue sélectionnée */}
          
          {/* Vue d'ensemble avec graphiques */}
          {selectedView === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Graphique en secteurs pour la répartition des tâches */}
              <div className="bg-gradient-to-br from-purple-600/20 to-indigo-700/20 backdrop-blur-lg rounded-xl p-6 border border-purple-400/30">
                <h3 className="text-white text-lg font-semibold mb-4">Répartition des Tâches</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={taskStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      dataKey="value"
                      animationBegin={0}
                      animationDuration={1000}
                    >
                      {taskStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.8)', 
                        border: 'none', 
                        borderRadius: '8px',
                        color: 'white'
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Légende du graphique */}
                <div className="flex justify-center space-x-4 mt-4">
                  {taskStatusData.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-white text-sm">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Graphique en barres pour la progression des projets */}
              <div className="lg:col-span-2 bg-gradient-to-br from-purple-600/20 to-indigo-700/20 backdrop-blur-lg rounded-xl p-6 border border-purple-400/30">
                <h3 className="text-white text-lg font-semibold mb-4">Progression des Projets</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={projectProgressData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="name" stroke="white" fontSize={12} />
                    <YAxis stroke="white" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.8)', 
                        border: 'none', 
                        borderRadius: '8px',
                        color: 'white'
                      }} 
                    />
                    <Bar dataKey="progress" fill="#8B5CF6" radius={4} animationDuration={1000} />
                    <Bar dataKey="budget" fill="#10B981" radius={4} animationDuration={1000} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Vue des projets avec grille de cartes */}
          {selectedView === 'projects' && (
            <div className="space-y-6">
              {/* En-tête de la section projets */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Tous les Projets</h2>
                  <p className="text-purple-200">Gérez et suivez tous vos projets en cours</p>
                </div>
                <button
                  onClick={() => navigate('/projects/create')}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  + Nouveau Projet
                </button>
              </div>

              {/* Grille des projets */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project, index) => (
                  <ProjectCard 
                    key={project.id} 
                    project={project} 
                    users={users}
                  />
                ))}
              </div>

              {/* Message si aucun projet */}
              {projects.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📁</div>
                  <h3 className="text-xl font-semibold text-white mb-2">Aucun projet trouvé</h3>
                  <p className="text-purple-200 mb-6">Commencez par créer votre premier projet</p>
                  <button
                    onClick={() => navigate('/projects/create')}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300"
                  >
                    Créer un projet
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Vue analytics avec graphiques détaillés */}
          {selectedView === 'analytics' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Graphique de productivité hebdomadaire */}
              <div className="bg-gradient-to-br from-purple-600/20 to-indigo-700/20 backdrop-blur-lg rounded-xl p-6 border border-purple-400/30">
                <h3 className="text-white text-lg font-semibold mb-4">Productivité Hebdomadaire</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="day" stroke="white" />
                    <YAxis stroke="white" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.8)', 
                        border: 'none', 
                        borderRadius: '8px',
                        color: 'white'
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="tasks" 
                      stroke="#8B5CF6" 
                      strokeWidth={3}
                      dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                      animationDuration={2000}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="completed" 
                      stroke="#10B981" 
                      strokeWidth={3}
                      dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                      animationDuration={2000}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Métriques clés */}
              <div className="bg-gradient-to-br from-purple-600/20 to-indigo-700/20 backdrop-blur-lg rounded-xl p-6 border border-purple-400/30">
                <h3 className="text-white text-lg font-semibold mb-4">Métriques Clés</h3>
                <div className="space-y-4">
                  {[
                    { label: "Temps moyen par tâche", value: "2.5h", trend: "↓ 15%" },
                    { label: "Taux de respect des délais", value: "89%", trend: "↑ 5%" },
                    { label: "Satisfaction client", value: "4.7/5", trend: "↑ 8%" },
                    { label: "Efficacité équipe", value: "92%", trend: "↑ 12%" }
                  ].map((metric, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div>
                        <p className="text-gray-300 text-sm">{metric.label}</p>
                        <p className="text-white text-xl font-bold">{metric.value}</p>
                      </div>
                      <span className={`text-sm px-3 py-1 rounded-full ${
                        metric.trend.startsWith('↑') 
                          ? 'bg-green-500/20 text-green-300' 
                          : 'bg-red-500/20 text-red-300'
                      }`}>
                        {metric.trend}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Vue kanban pour la gestion des tâches */}
          {selectedView === 'kanban' && (
            <div>
              <TaskFilters 
                tasks={projects.flatMap(p => p.tasks || [])}
                onFilterChange={(filters) => {
                  showSuccess(`Filtres appliqués: ${Object.values(filters).filter(f => f !== 'all' && f !== '').join(', ')}`);
                }}
              />
              <TaskBoard 
                tasks={projects.flatMap(p => p.tasks || [])}
                onTaskUpdate={(taskId, newStatus) => {
                  showSuccess(`Tâche mise à jour vers ${newStatus}`);
                }}
              />
            </div>
          )}

          {/* Vue statistiques avancées */}
          {selectedView === 'stats' && (
            <AdvancedStats 
              tasks={projects.flatMap(p => p.tasks || [])}
              projects={projects}
            />
          )}

          {/* Actions rapides flottantes */}
          <div className="fixed bottom-6 right-6 flex flex-col space-y-3">
            {[
                { 
                  icon: "➕", 
                  label: "Nouveau Projet", 
                  color: "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700",
                  action: () => navigate('/projects/create')
                },
                { 
                  icon: "📝", 
                  label: "Nouvelle Tâche", 
                  color: "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700",
                  action: () => navigate('/tasks/create')
                },
                { 
                  icon: "📊", 
                  label: "Rapport", 
                  color: "bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700",
                  action: () => navigate('/reports')
                }
            ].map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className={`${action.color} text-white p-4 rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300 group relative`}
                title={action.label}
              >
                <span className="text-xl">{action.icon}</span>
                <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-black text-white px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {action.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Styles CSS pour les animations */}
        <style jsx>{`
          @keyframes fade-in-up {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .animate-fade-in-up {
            animation: fade-in-up 0.6s ease-out forwards;
          }
        `}</style>
      </div>
    </>
  );
}