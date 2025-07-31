import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';

const TaskBoard = ({ tasks, onTaskUpdate }) => {
  const { showSuccess, showError } = useNotifications();
  const [columns, setColumns] = useState({
    'en attente': [],
    'en cours': [],
    'terminée': []
  });

  useEffect(() => {
    // Organiser les tâches par statut
    const organizedTasks = {
      'en attente': tasks.filter(task => task.etat === 'en attente'),
      'en cours': tasks.filter(task => task.etat === 'en cours'),
      'terminée': tasks.filter(task => task.etat === 'terminée')
    };
    
    setColumns(organizedTasks);
  }, [tasks]);

  const handleDragStart = (e, taskId, sourceColumn) => {
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.setData('sourceColumn', sourceColumn);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('bg-opacity-30');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-opacity-30');
  };

  const handleDrop = async (e, targetColumn) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-opacity-30');
    
    const taskId = parseInt(e.dataTransfer.getData('taskId'));
    const sourceColumn = e.dataTransfer.getData('sourceColumn');

    if (sourceColumn === targetColumn) {
      return;
    }

    try {
      // Mettre à jour les colonnes localement pour une réponse immédiate
      const updatedColumns = { ...columns };
      const task = updatedColumns[sourceColumn].find(t => t.id === taskId);
      
      if (task) {
        updatedColumns[sourceColumn] = updatedColumns[sourceColumn].filter(t => t.id !== taskId);
        updatedColumns[targetColumn] = [...updatedColumns[targetColumn], { ...task, etat: targetColumn }];
        setColumns(updatedColumns);

        // Appeler l'API pour mettre à jour le statut
        if (onTaskUpdate) {
          await onTaskUpdate(taskId, targetColumn);
        }

        showSuccess(`Tâche "${task.titre}" déplacée vers ${targetColumn}`);
      } else {
        console.error('Task not found in source column');
        showError('Tâche non trouvée');
      }
    } catch (error) {
      console.error('Error in handleDrop:', error);
      showError('Erreur lors du déplacement de la tâche');
      // Recharger les colonnes en cas d'erreur
      const organizedTasks = {
        'en attente': tasks.filter(task => task.etat === 'en attente'),
        'en cours': tasks.filter(task => task.etat === 'en cours'),
        'terminée': tasks.filter(task => task.etat === 'terminée')
      };
      setColumns(organizedTasks);
    }
  };

  const getColumnColor = (columnName) => {
    switch (columnName) {
      case 'en attente':
        return 'bg-yellow-50 border-yellow-200';
      case 'en cours':
        return 'bg-blue-50 border-blue-200';
      case 'terminée':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getColumnTitle = (columnName) => {
    switch (columnName) {
      case 'en attente':
        return '🕐 En Attente';
      case 'en cours':
        return '🔄 En Cours';
      case 'terminée':
        return '✅ Terminée';
      default:
        return columnName;
    }
  };

  // Debug: Afficher les données reçues
  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Aucune tâche disponible</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {Object.entries(columns).map(([columnName, columnTasks]) => (
        <div
          key={columnName}
          className={`${getColumnColor(columnName)} rounded-xl p-4 border-2 min-h-96 transition-all duration-200`}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, columnName)}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            {getColumnTitle(columnName)}
            <span className="ml-2 bg-white text-gray-700 px-2 py-1 rounded-full text-sm font-medium shadow-sm">
              {columnTasks.length}
            </span>
          </h3>
          
          <div className="space-y-3">
            {columnTasks.map((task) => {
              return (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id, columnName)}
                  className="bg-white rounded-lg p-4 border border-gray-200 cursor-move hover:shadow-md transition-all duration-200 transform hover:scale-105 group"
                  title="Glissez-déposez pour changer le statut"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 text-sm">{task.titre || 'Sans titre'}</h4>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                      </svg>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-xs mb-3 line-clamp-2">{task.description || 'Aucune description'}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {task.assigned_user?.name?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <span className="text-gray-600 text-xs">{task.assigned_user?.name || 'Non assigné'}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {task.deadline && (
                        <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-700">
                          📅 {new Date(task.deadline).toLocaleDateString('fr-FR')}
                        </span>
                      )}
                      
                      <Link
                        to={`/tasks/${task.id}`}
                        className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors duration-200 font-medium"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Détail
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {columnTasks.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-sm">Aucune tâche</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskBoard; 