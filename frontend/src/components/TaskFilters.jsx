import React, { useState } from 'react';
import { useUsers } from '../hooks/useUsers';

const TaskFilters = ({ tasks, onFilterChange }) => {
  const { users, loading } = useUsers();
  const [filters, setFilters] = useState({
    status: 'all',
    assignee: 'all',
    priority: 'all',
    search: ''
  });

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const getUniqueValues = (field) => {
    return ['all', ...new Set(tasks.map(task => task[field]).filter(Boolean))];
  };

  const getStatusCount = (status) => {
    return tasks.filter(task => status === 'all' || task.etat === status).length;
  };

  const getAssigneeCount = (assignee) => {
    return tasks.filter(task => assignee === 'all' || task.assignee === assignee).length;
  };

  const getPriorityCount = (priority) => {
    return tasks.filter(task => priority === 'all' || task.priority === priority).length;
  };

  return (
    <div className="bg-gradient-to-br from-purple-600/20 to-indigo-700/20 backdrop-blur-lg rounded-xl p-6 border border-purple-400/30 mb-6">
      <h3 className="text-white text-lg font-semibold mb-4">Filtres et Recherche</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Recherche */}
        <div className="lg:col-span-2">
          <label className="block text-white text-sm font-medium mb-2">Recherche</label>
          <input
            type="text"
            placeholder="Rechercher une tâche..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full bg-white/10 border border-purple-400/50 rounded-lg px-3 py-2 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        {/* Filtre par statut */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">Statut</label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full bg-white/10 border border-purple-400/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            <option value="all">Tous ({tasks.length})</option>
            <option value="en attente">En attente ({getStatusCount('en attente')})</option>
            <option value="en cours">En cours ({getStatusCount('en cours')})</option>
            <option value="terminée">Terminée ({getStatusCount('terminée')})</option>
          </select>
        </div>

        {/* Filtre par assigné */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">Assigné à</label>
          <select
            value={filters.assignee}
            onChange={(e) => handleFilterChange('assignee', e.target.value)}
            className="w-full bg-white/10 border border-purple-400/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
            disabled={loading}
          >
            <option value="all">Tous ({tasks.length})</option>
            {loading ? (
              <option value="">Chargement...</option>
            ) : (
              users.map(user => (
                <option key={user.id} value={user.name}>
                  {user.name} ({getAssigneeCount(user.name)})
                </option>
              ))
            )}
          </select>
        </div>

        {/* Filtre par priorité */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">Priorité</label>
          <select
            value={filters.priority}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
            className="w-full bg-white/10 border border-purple-400/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            <option value="all">Toutes ({tasks.length})</option>
            <option value="high">Haute ({getPriorityCount('high')})</option>
            <option value="medium">Moyenne ({getPriorityCount('medium')})</option>
            <option value="low">Basse ({getPriorityCount('low')})</option>
          </select>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/10 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-white">{tasks.length}</div>
          <div className="text-xs text-gray-300">Total</div>
        </div>
        <div className="bg-amber-500/20 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-amber-300">{getStatusCount('en attente')}</div>
          <div className="text-xs text-amber-200">En attente</div>
        </div>
        <div className="bg-blue-500/20 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-blue-300">{getStatusCount('en cours')}</div>
          <div className="text-xs text-blue-200">En cours</div>
        </div>
        <div className="bg-emerald-500/20 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-emerald-300">{getStatusCount('terminée')}</div>
          <div className="text-xs text-emerald-200">Terminées</div>
        </div>
      </div>
    </div>
  );
};

export default TaskFilters; 