import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Composant ProjectCard - Affiche une carte de projet avec toutes ses informations
 * 
 * @param {Object} project - L'objet projet contenant toutes les données
 * @param {Array} users - La liste des utilisateurs pour récupérer les noms
 * @returns {JSX.Element} - Le composant ProjectCard rendu
 */
const ProjectCard = ({ project, users }) => {
  /**
   * Fonction pour obtenir le nom de l'utilisateur assigné à une tâche
   * @param {number} assignedTo - L'ID de l'utilisateur assigné
   * @returns {string} - Le nom de l'utilisateur ou "Non assigné"
   */
  const getAssigneeName = (assignedTo) => {
    if (!assignedTo) return 'Non assigné';
    const user = users.find(u => u.id === assignedTo);
    return user ? user.name : 'Utilisateur inconnu';
  };

  // Calculer les statistiques du projet
  const totalTasks = project.tasks?.length || 0;                    // Nombre total de tâches
  const completedTasks = project.tasks?.filter(task => task.etat === 'terminée').length || 0;  // Tâches terminées
  const inProgressTasks = project.tasks?.filter(task => task.etat === 'en cours').length || 0; // Tâches en cours
  const pendingTasks = project.tasks?.filter(task => task.etat === 'en attente').length || 0;  // Tâches en attente
  
  // Calculer le pourcentage de progression du projet
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  /**
   * Fonction pour déterminer le statut du projet basé sur les tâches
   * @returns {string} - Le statut du projet (completed, in_progress, pending)
   */
  const getProjectStatus = () => {
    if (completedTasks === totalTasks && totalTasks > 0) return 'completed';
    if (inProgressTasks > 0) return 'in_progress';
    return 'pending';
  };

  // Obtenir le statut actuel du projet
  const projectStatus = getProjectStatus();

  return (
    // Conteneur principal de la carte avec design moderne et thème sombre
    <div className="bg-gradient-to-br from-purple-600/20 to-indigo-700/20 backdrop-blur-lg rounded-xl p-6 border border-purple-400/30 hover:border-purple-400/50 transition-all duration-300 hover:shadow-2xl">
      
      {/* En-tête du projet avec nom, description et statut */}
      <div className="flex items-start justify-between mb-4">
        {/* Informations principales du projet */}
        <div className="flex-1">
          <h3 className="text-white text-xl font-semibold mb-2">{project.name}</h3>
          <p className="text-purple-200 text-sm leading-relaxed">{project.description}</p>
        </div>
        
        {/* Badge de statut et date d'échéance */}
        <div className="flex flex-col items-end space-y-2">
          {/* Badge de statut avec couleur dynamique */}
          <span className={`text-sm px-3 py-1 rounded-full font-medium ${
            projectStatus === 'completed' ? 'bg-green-500/20 text-green-300 border border-green-400/30' :
            projectStatus === 'in_progress' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/30' :
            'bg-blue-500/20 text-blue-300 border border-blue-400/30'
          }`}>
            {projectStatus === 'completed' ? '✅ Terminé' :
             projectStatus === 'in_progress' ? '🔄 En cours' : '⏳ En attente'}
          </span>
          
          {/* Date d'échéance si disponible */}
          {project.deadline && (
            <span className="text-purple-300 text-xs">
              📅 {new Date(project.deadline).toLocaleDateString('fr-FR')}
            </span>
          )}
        </div>
      </div>

      {/* Barre de progression du projet */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white text-sm font-medium">Progression</span>
          <span className="text-purple-300 text-sm">{progressPercentage}%</span>
        </div>
        {/* Barre de progression visuelle */}
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-purple-400 to-indigo-400 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Statistiques des tâches par statut */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {/* Tâches terminées */}
        <div className="text-center">
          <div className="text-green-400 text-lg font-bold">{completedTasks}</div>
          <div className="text-gray-400 text-xs">Terminées</div>
        </div>
        
        {/* Tâches en cours */}
        <div className="text-center">
          <div className="text-yellow-400 text-lg font-bold">{inProgressTasks}</div>
          <div className="text-gray-400 text-xs">En cours</div>
        </div>
        
        {/* Tâches en attente */}
        <div className="text-center">
          <div className="text-red-400 text-lg font-bold">{pendingTasks}</div>
          <div className="text-gray-400 text-xs">En attente</div>
        </div>
      </div>

      {/* Liste des tâches récentes du projet */}
      {project.tasks && project.tasks.length > 0 && (
        <div className="mb-4">
          <h4 className="text-white text-sm font-medium mb-3">Tâches récentes</h4>
          <div className="space-y-2">
            {/* Afficher les 3 premières tâches */}
            {project.tasks.slice(0, 3).map((task) => (
              <div 
                key={task.id}
                className={`p-3 rounded-lg border-l-4 ${
                  task.etat === 'terminée' 
                    ? 'bg-green-500/10 border-green-400' 
                    : task.etat === 'en cours'
                    ? 'bg-yellow-500/10 border-yellow-400'
                    : 'bg-red-500/10 border-red-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  {/* Informations de la tâche */}
                  <div className="flex-1">
                    <h5 className="text-white font-medium text-sm">{task.titre}</h5>
                    <p className="text-gray-400 text-xs mt-1">Assigné à: {getAssigneeName(task.assigned_to)}</p>
                  </div>
                  
                  {/* Badge de statut de la tâche */}
                  <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                    task.etat === 'terminée' 
                      ? 'bg-green-500/20 text-green-300' 
                      : task.etat === 'en cours'
                      ? 'bg-yellow-500/20 text-yellow-300'
                      : 'bg-red-500/20 text-red-300'
                  }`}>
                    {task.etat}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Indicateur s'il y a plus de tâches */}
          {project.tasks.length > 3 && (
            <div className="text-center mt-3">
              <span className="text-purple-300 text-sm">
                +{project.tasks.length - 3} autres tâches
              </span>
            </div>
          )}
        </div>
      )}

      {/* Section des actions en bas de la carte */}
      <div className="flex items-center justify-between pt-4 border-t border-purple-400/20">
        {/* Lien vers les détails du projet */}
        <Link 
          to={`/projects/${project.id}`}
          className="text-purple-300 hover:text-purple-200 text-sm font-medium transition-colors hover:underline"
          onClick={() => console.log('Navigation vers le projet:', project.id, project.name)}
        >
          Voir les détails →
        </Link>
        
        {/* Informations supplémentaires */}
        <div className="flex items-center space-x-2">
          <span className="text-gray-400 text-xs">
            {totalTasks} tâches au total
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard; 