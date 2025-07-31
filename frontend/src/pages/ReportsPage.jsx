import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function ReportsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(""); // Removed unused variable
  const [selectedPeriod, setSelectedPeriod] = useState("This Month");
  const [selectedProject, setSelectedProject] = useState("All Projects");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/projects", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      } else {
        console.error("Erreur lors du chargement des projets");
      }
    } catch (err) {
      console.error("Erreur de connexion", err);
    } finally {
      setLoading(false);
    }
  };

  // Calculer les statistiques globales
  const totalProjects = projects.length;
  const completedTasks = projects.reduce((total, project) => 
    total + (project.tasks?.filter(task => task.etat === 'terminée').length || 0), 0
  );
  const pendingTasks = projects.reduce((total, project) => 
    total + (project.tasks?.filter(task => task.etat === 'en attente').length || 0), 0
  );
  const inProgressTasks = projects.reduce((total, project) => 
    total + (project.tasks?.filter(task => task.etat === 'en cours').length || 0), 0
  );
  const totalTasks = completedTasks + pendingTasks + inProgressTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Données pour les graphiques
  const taskStatusData = [
    { name: 'Terminées', value: completedTasks, color: 'bg-green-500', percentage: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0 },
    { name: 'En Cours', value: inProgressTasks, color: 'bg-blue-500', percentage: totalTasks > 0 ? Math.round((inProgressTasks / totalTasks) * 100) : 0 },
    { name: 'En Attente', value: pendingTasks, color: 'bg-yellow-500', percentage: totalTasks > 0 ? Math.round((pendingTasks / totalTasks) * 100) : 0 }
  ];

  // Données de performance par projet
  const projectPerformance = projects.map(project => {
    const projectTasks = project.tasks || [];
    const completed = projectTasks.filter(task => task.etat === 'terminée').length;
    const total = projectTasks.length;
    return {
      name: project.name,
      completed,
      total,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
      status: total > 0 ? (completed === total ? 'Terminé' : completed > 0 ? 'En cours' : 'Non commencé') : 'Aucune tâche'
    };
  });

  // Données de tendance mensuelle
  const monthlyTrends = [
    { month: 'Jan', projects: 3, tasks: 15, completed: 12 },
    { month: 'Fév', projects: 5, tasks: 22, completed: 18 },
    { month: 'Mar', projects: 4, tasks: 19, completed: 16 },
    { month: 'Avr', projects: 6, tasks: 28, completed: 24 },
    { month: 'Mai', projects: 7, tasks: 32, completed: 29 },
    { month: 'Juin', projects: 8, tasks: 35, completed: 31 },
    { month: 'Juil', projects: totalProjects, tasks: totalTasks, completed: completedTasks }
  ];

  // Données d'équipe
  const teamPerformance = [
    { name: 'John Doe', tasks: 15, completed: 13, efficiency: 87 },
    { name: 'Sarah Smith', tasks: 12, completed: 11, efficiency: 92 },
    { name: 'Mike Johnson', tasks: 18, completed: 16, efficiency: 89 },
    { name: 'Lisa Wilson', tasks: 10, completed: 9, efficiency: 90 },
    { name: 'David Brown', tasks: 14, completed: 12, efficiency: 86 }
  ];

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des rapports...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        {/* Main Content */}
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200 mr-6"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Retour au Dashboard
                </button>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Rapports & Analytics</h1>
                  <p className="text-gray-600 mt-2">Analyse détaillée de vos projets et performances</p>
                </div>
                <div className="mt-4 sm:mt-0 flex space-x-3">
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="This Week">Cette semaine</option>
                    <option value="This Month">Ce mois</option>
                    <option value="This Quarter">Ce trimestre</option>
                    <option value="This Year">Cette année</option>
                  </select>
                  <select
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="All Projects">Tous les projets</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.name}>{project.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Projets Actifs</p>
                    <p className="text-2xl font-bold text-gray-900">{totalProjects}</p>
                    <p className="text-xs text-green-600 font-medium">+15% ce mois</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Tâches Terminées</p>
                    <p className="text-2xl font-bold text-gray-900">{completedTasks}</p>
                    <p className="text-xs text-green-600 font-medium">+22% cette semaine</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Taux de Réussite</p>
                    <p className="text-2xl font-bold text-gray-900">{completionRate}%</p>
                    <p className="text-xs text-green-600 font-medium">+8% ce mois</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Temps Moyen</p>
                    <p className="text-2xl font-bold text-gray-900">2.3j</p>
                    <p className="text-xs text-green-600 font-medium">-12% ce mois</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Task Status Distribution */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Répartition des Tâches</h2>
                <div className="space-y-4">
                  {taskStatusData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full ${item.color}`}></div>
                        <span className="text-sm font-medium text-gray-700">{item.name}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${item.color}`}
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold text-gray-900 w-12 text-right">{item.value}</span>
                        <span className="text-xs text-gray-500 w-8 text-right">{item.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Monthly Trends */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Tendances Mensuelles</h2>
                <div className="space-y-4">
                  {monthlyTrends.map((trend) => (
                    <div key={trend.month} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 w-12">{trend.month}</span>
                      <div className="flex-1 mx-4">
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${trend.total > 0 ? (trend.completed / trend.total) * 100 : 0}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500 w-8 text-right">{trend.completed}/{trend.total}</span>
                        </div>
                      </div>
                      <span className="text-sm text-gray-900 w-12 text-right">{trend.projects}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Project Performance Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Performance par Projet</h2>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm">
                  Exporter PDF
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Projet
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tâches
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Terminées
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Progression
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {projectPerformance.map((project, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{project.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{project.total}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{project.completed}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full"
                                style={{ width: `${project.percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-900">{project.percentage}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            project.status === 'Terminé' ? 'bg-green-100 text-green-800' :
                            project.status === 'En cours' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {project.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Team Performance */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Performance de l'Équipe</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teamPerformance.map((member, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-gray-900">{member.name}</h3>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        member.efficiency >= 90 ? 'bg-green-100 text-green-800' :
                        member.efficiency >= 80 ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {member.efficiency}%
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Tâches assignées</span>
                        <span>{member.tasks}</span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Tâches terminées</span>
                        <span>{member.completed}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${(member.completed / member.tasks) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 