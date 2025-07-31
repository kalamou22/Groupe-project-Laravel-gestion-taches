import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';

const AdvancedStats = ({ tasks, projects }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [stats, setStats] = useState({});

  useEffect(() => {
    calculateStats();
  }, [tasks, projects, selectedPeriod]);

  const calculateStats = () => {
    const now = new Date();
    const periods = {
      week: 7,
      month: 30,
      quarter: 90
    };
    const daysBack = periods[selectedPeriod];

    // Calculer les dates
    const startDate = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000));
    
    // Taux d'avancement global
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.etat === 'terminée').length;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    // Productivité par jour (heatmap data)
    const productivityData = [];
    for (let i = 0; i < daysBack; i++) {
      const date = new Date(startDate.getTime() + (i * 24 * 60 * 60 * 1000));
      const dayTasks = tasks.filter(task => {
        const taskDate = new Date(task.created_at || task.updated_at || now);
        return taskDate.toDateString() === date.toDateString();
      });
      
      productivityData.push({
        date: date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
        completed: dayTasks.filter(task => task.etat === 'terminée').length,
        created: dayTasks.length,
        productivity: dayTasks.length > 0 ? (dayTasks.filter(task => task.etat === 'terminée').length / dayTasks.length) * 100 : 0
      });
    }

    // Performance par utilisateur
    const userPerformance = {};
    tasks.forEach(task => {
      if (task.assignee) {
        if (!userPerformance[task.assignee]) {
          userPerformance[task.assignee] = { total: 0, completed: 0 };
        }
        userPerformance[task.assignee].total++;
        if (task.etat === 'terminée') {
          userPerformance[task.assignee].completed++;
        }
      }
    });

    const userStats = Object.entries(userPerformance).map(([user, stats]) => ({
      user,
      total: stats.total,
      completed: stats.completed,
      rate: (stats.completed / stats.total) * 100
    }));

    // Progression des projets
    const projectProgress = projects.map(project => ({
      name: project.name,
      progress: project.tasks ? (project.tasks.filter(t => t.etat === 'terminée').length / project.tasks.length) * 100 : 0,
      budget: project.budget ? (project.spent / project.budget) * 100 : 0
    }));

    setStats({
      completionRate,
      productivityData,
      userStats,
      projectProgress,
      totalTasks,
      completedTasks
    });
  };

  const getHeatmapColor = (value) => {
    if (value === 0) return '#1f2937';
    if (value < 25) return '#dc2626';
    if (value < 50) return '#ea580c';
    if (value < 75) return '#d97706';
    return '#16a34a';
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec sélecteur de période */}
      <div className="flex items-center justify-between">
        <h3 className="text-white text-xl font-semibold">Statistiques Avancées</h3>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="bg-purple-600/30 text-white border border-purple-400/50 rounded-lg px-3 py-2 text-sm"
        >
          <option value="week">7 derniers jours</option>
          <option value="month">30 derniers jours</option>
          <option value="quarter">3 derniers mois</option>
        </select>
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="text-3xl font-bold">{stats.totalTasks || 0}</div>
          <div className="text-indigo-100 text-sm">Total Tâches</div>
        </div>
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-6 text-white">
          <div className="text-3xl font-bold">{stats.completedTasks || 0}</div>
          <div className="text-emerald-100 text-sm">Tâches Terminées</div>
        </div>
        <div className="bg-gradient-to-r from-pink-500 to-rose-600 rounded-xl p-6 text-white">
          <div className="text-3xl font-bold">{Math.round(stats.completionRate || 0)}%</div>
          <div className="text-pink-100 text-sm">Taux de Réussite</div>
        </div>
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="text-3xl font-bold">{projects.length}</div>
          <div className="text-amber-100 text-sm">Projets Actifs</div>
        </div>
      </div>

      {/* Heatmap de productivité */}
      <div className="bg-gradient-to-br from-purple-600/20 to-indigo-700/20 backdrop-blur-lg rounded-xl p-6 border border-purple-400/30">
        <h4 className="text-white text-lg font-semibold mb-4">Heatmap de Productivité</h4>
        <div className="grid grid-cols-7 gap-1">
          {stats.productivityData?.map((day, index) => (
            <div
              key={index}
              className="aspect-square rounded flex items-center justify-center text-xs text-white"
              style={{ backgroundColor: getHeatmapColor(day.productivity) }}
              title={`${day.date}: ${Math.round(day.productivity)}% productivité`}
            >
              {day.completed > 0 && <span className="text-xs">{day.completed}</span>}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center space-x-4 mt-4 text-xs text-gray-300">
          <span>Moins</span>
          <div className="flex space-x-1">
            {[0, 25, 50, 75, 100].map((value) => (
              <div
                key={value}
                className="w-4 h-4 rounded"
                style={{ backgroundColor: getHeatmapColor(value) }}
              />
            ))}
          </div>
          <span>Plus</span>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance par utilisateur */}
        <div className="bg-gradient-to-br from-purple-600/20 to-indigo-700/20 backdrop-blur-lg rounded-xl p-6 border border-purple-400/30">
          <h4 className="text-white text-lg font-semibold mb-4">Performance par Utilisateur</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.userStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="user" stroke="white" fontSize={12} />
              <YAxis stroke="white" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0,0,0,0.8)', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: 'white'
                }} 
              />
              <Bar dataKey="rate" fill="#8B5CF6" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Progression des projets */}
        <div className="bg-gradient-to-br from-purple-600/20 to-indigo-700/20 backdrop-blur-lg rounded-xl p-6 border border-purple-400/30">
          <h4 className="text-white text-lg font-semibold mb-4">Progression des Projets</h4>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={stats.projectProgress}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="name" stroke="white" fontSize={10} />
              <YAxis stroke="white" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(0,0,0,0.8)', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: 'white'
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="progress" 
                stroke="#8B5CF6" 
                fill="#8B5CF6" 
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdvancedStats; 