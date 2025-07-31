import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { useUsers } from '../hooks/useUsers';
import Navbar from '../components/Navbar';

const ProjectDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { showSuccess, showError } = useNotifications();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newTask, setNewTask] = useState({
        titre: '',
        description: '',
        etat: 'en attente',
        deadline: '',
        assigned_to: user?.id || ''
    });
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [commentLoading, setCommentLoading] = useState(false);

    useEffect(() => {
        fetchProject();
        fetchComments();
    }, [id]);

    const fetchProject = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            if (!token) {
                showError("Token d'authentification manquant");
                navigate("/login");
                return;
            }

            const response = await axios.get(`http://127.0.0.1:8000/api/projects/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProject(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération du projet:', error);
            if (error.response?.status === 404) {
                showError("Projet non trouvé");
                navigate("/dashboard");
            } else if (error.response?.status === 401) {
                showError("Session expirée");
                navigate("/login");
            } else {
                showError("Erreur lors du chargement du projet");
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchComments = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`http://127.0.0.1:8000/api/projects/${id}/comments`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setComments(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des commentaires:', error);
            setComments([]);
        }
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            // Préparer les données avec le bon format de date
            const taskData = {
                ...newTask,
                project_id: id,
                deadline: newTask.deadline ? new Date(newTask.deadline).toISOString().slice(0, 10) : null,
                assigned_to: newTask.assigned_to || user?.id || null
            };

            console.log('Envoi des données:', taskData);

            const response = await axios.post('http://127.0.0.1:8000/api/tasks', taskData, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });

            console.log('Réponse du serveur:', response.data);
            
            setNewTask({
                titre: '',
                description: '',
                etat: 'en attente',
                deadline: '',
                assigned_to: user?.id || ''
            });
            setShowCreateModal(false);
            fetchProject(); // Recharge le projet avec ses tâches à jour
        } catch (error) {
            console.error('Erreur lors de la création de la tâche:', error);
            if (error.response) {
                console.error('Détails de l\'erreur:', error.response.data);
                alert(`Erreur: ${error.response.data.message || 'Erreur lors de la création de la tâche'}`);
            } else {
                alert('Erreur de connexion au serveur');
            }
        }
    };

    const handleStatusChange = async (taskId, newEtat) => {
        try {
            await axios.put(`http://127.0.0.1:8000/api/tasks/${taskId}`, {
                etat: newEtat
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            
            // Mettre à jour la tâche dans le projet
            setProject({
                ...project,
                tasks: project.tasks.map(task => 
                    task.id === taskId ? { ...task, etat: newEtat } : task
                )
            });
        } catch (error) {
            console.error('Erreur lors de la mise à jour du statut:', error);
        }
    };

    const handleDeleteTask = async (taskId) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
            try {
                await axios.delete(`http://127.0.0.1:8000/api/tasks/${taskId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                });
                setProject({
                    ...project,
                    tasks: project.tasks.filter(task => task.id !== taskId)
                });
            } catch (error) {
                console.error('Erreur lors de la suppression de la tâche:', error);
            }
        }
    };

    const handleDeleteProject = async () => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) {
            try {
                await axios.delete(`http://127.0.0.1:8000/api/projects/${project.id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                });
                navigate('/dashboard');
            } catch (error) {
                alert("Erreur lors de la suppression du projet !");
            }
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        setCommentLoading(true);
        try {
            await axios.post(`http://127.0.0.1:8000/api/tasks/${id}/comments`, {
                content: newComment
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            setNewComment("");
            fetchComments();
        } catch (error) {
            alert("Erreur lors de l'ajout du commentaire");
        } finally {
            setCommentLoading(false);
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-6"></div>
                        <p className="text-gray-600 text-lg font-medium">Chargement en cours...</p>
                    </div>
                </div>
            </>
        );
    }

    if (!project) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Projet non trouvé</h1>
                        <Link to="/dashboard" className="text-blue-600 hover:text-blue-800">
                            Retour au tableau de bord
                        </Link>
                    </div>
                </div>
            </>
        );
    }

    const tasksByStatus = {
        'en attente': project.tasks?.filter(task => task.etat === 'en attente') || [],
        'en cours': project.tasks?.filter(task => task.etat === 'en cours') || [],
        'terminée': project.tasks?.filter(task => task.etat === 'terminée') || []
    };

    const totalTasks = project.tasks?.length || 0;
    const completedTasks = tasksByStatus['terminée'].length;
    const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
                {/* Header */}
                <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200/50 sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-4">
                            <div className="flex items-center">
                                <Link 
                                    to="/dashboard"
                                    className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200 mr-6"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Retour
                                </Link>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
                                    <p className="text-sm text-gray-500">Gestion des tâches</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={handleDeleteProject}
                                    className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200 font-semibold shadow-md"
                                >
                                    Supprimer le projet
                                </button>
                                <button
                                    onClick={() => setShowCreateModal(true)}
                                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    <span>Nouvelle tâche</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Project Info */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6 mb-8">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <h2 className="text-3xl font-bold text-gray-900 mb-3">{project.name}</h2>
                                <p className="text-lg text-gray-600 mb-4">{project.description}</p>
                                <div className="flex items-center space-x-6 text-sm text-gray-500">
                                    <span>Créé le {new Date(project.created_at).toLocaleDateString('fr-FR')}</span>
                                    <span>•</span>
                                    <span>{totalTasks} tâches</span>
                                    <span>•</span>
                                    <span>{progressPercentage}% terminé</span>
                                </div>
                            </div>
                            <div className="ml-6">
                                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Statistiques du projet */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6 hover:shadow-md transition-all duration-200">
                            <div className="flex items-center">
                                <div className="p-3 bg-gradient-to-r from-gray-500 to-gray-600 rounded-xl shadow-lg">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Total</p>
                                    <p className="text-3xl font-bold text-gray-900">{totalTasks}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6 hover:shadow-md transition-all duration-200">
                            <div className="flex items-center">
                                <div className="p-3 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl shadow-lg">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">En attente</p>
                                    <p className="text-3xl font-bold text-gray-900">{tasksByStatus['en attente'].length}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6 hover:shadow-md transition-all duration-200">
                            <div className="flex items-center">
                                <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">En cours</p>
                                    <p className="text-3xl font-bold text-gray-900">{tasksByStatus['en cours'].length}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6 hover:shadow-md transition-all duration-200">
                            <div className="flex items-center">
                                <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Terminées</p>
                                    <p className="text-3xl font-bold text-gray-900">{completedTasks}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    {totalTasks > 0 && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6 mb-8">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Progression du projet</h3>
                                <span className="text-lg font-bold text-gray-900">{progressPercentage}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                                <div
                                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-4 rounded-full transition-all duration-500 ease-out"
                                    style={{ width: `${progressPercentage}%` }}
                                ></div>
                            </div>
                        </div>
                    )}

                    {/* Colonnes Kanban */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* En attente */}
                        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                            <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                                    <span className="w-2 h-2 bg-gray-500 rounded-full mr-2"></span>
                                    En attente
                                    <span className="ml-auto bg-gray-200 text-gray-700 text-sm font-medium px-2 py-1 rounded">
                                        {tasksByStatus['en attente'].length}
                                    </span>
                                </h3>
                            </div>
                            <div className="p-4 space-y-3">
                                {tasksByStatus['en attente'].map((task) => (
                                    <TaskCard
                                        key={task.id}
                                        task={task}
                                        onStatusChange={handleStatusChange}
                                        onDelete={handleDeleteTask}
                                    />
                                ))}
                                {tasksByStatus['en attente'].length === 0 && (
                                    <div className="text-center py-6 text-gray-500">
                                        <svg className="w-8 h-8 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                        <p className="text-sm">Aucune tâche en attente</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* En cours */}
                        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                            <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                                    <span className="w-2 h-2 bg-gray-500 rounded-full mr-2"></span>
                                    En cours
                                    <span className="ml-auto bg-gray-200 text-gray-700 text-sm font-medium px-2 py-1 rounded">
                                        {tasksByStatus['en cours'].length}
                                    </span>
                                </h3>
                            </div>
                            <div className="p-4 space-y-3">
                                {tasksByStatus['en cours'].map((task) => (
                                    <TaskCard
                                        key={task.id}
                                        task={task}
                                        onStatusChange={handleStatusChange}
                                        onDelete={handleDeleteTask}
                                    />
                                ))}
                                {tasksByStatus['en cours'].length === 0 && (
                                    <div className="text-center py-6 text-gray-500">
                                        <svg className="w-8 h-8 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                        <p className="text-sm">Aucune tâche en cours</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Terminées */}
                        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                            <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                                    <span className="w-2 h-2 bg-gray-500 rounded-full mr-2"></span>
                                    Terminées
                                    <span className="ml-auto bg-gray-200 text-gray-700 text-sm font-medium px-2 py-1 rounded">
                                        {completedTasks}
                                    </span>
                                </h3>
                            </div>
                            <div className="p-4 space-y-3">
                                {tasksByStatus['terminée'].map((task) => (
                                    <TaskCard
                                        key={task.id}
                                        task={task}
                                        onStatusChange={handleStatusChange}
                                        onDelete={handleDeleteTask}
                                    />
                                ))}
                                {tasksByStatus['terminée'].length === 0 && (
                                    <div className="text-center py-6 text-gray-500">
                                        <svg className="w-8 h-8 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className="text-sm">Aucune tâche terminée</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal de création de tâche */}
                {showCreateModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
                        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold text-gray-900">Créer une nouvelle tâche</h3>
                                    <button
                                        onClick={() => setShowCreateModal(false)}
                                        className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                <form onSubmit={handleCreateTask} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Titre de la tâche
                                        </label>
                                        <input
                                            type="text"
                                            value={newTask.titre}
                                            onChange={(e) => setNewTask({...newTask, titre: e.target.value})}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            placeholder="Ex: Développer l'interface utilisateur"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Description
                                        </label>
                                        <textarea
                                            value={newTask.description}
                                            onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            rows="3"
                                            placeholder="Description détaillée de la tâche..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Statut initial
                                        </label>
                                        <select
                                            value={newTask.etat}
                                            onChange={(e) => setNewTask({...newTask, etat: e.target.value})}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        >
                                            <option value="en attente">En attente</option>
                                            <option value="en cours">En cours</option>
                                            <option value="terminée">Terminée</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Date d'échéance
                                        </label>
                                        <input
                                            type="date"
                                            value={newTask.deadline}
                                            onChange={(e) => setNewTask({...newTask, deadline: e.target.value})}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        />
                                    </div>
                                    <div className="flex justify-end space-x-4 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setShowCreateModal(false)}
                                            className="px-6 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all duration-200 font-medium"
                                        >
                                            Annuler
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold shadow-md hover:shadow-lg"
                                        >
                                            Créer la tâche
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* Section Commentaires */}
                <div className="max-w-2xl mx-auto mt-12 mb-8 bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Commentaires</h3>
                    <form onSubmit={handleAddComment} className="flex items-center space-x-4 mb-6">
                        <input
                            type="text"
                            value={newComment}
                            onChange={e => setNewComment(e.target.value)}
                            placeholder="Ajouter un commentaire..."
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            disabled={commentLoading}
                        />
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-semibold shadow-md"
                            disabled={commentLoading}
                        >
                            {commentLoading ? "Envoi..." : "Envoyer"}
                        </button>
                    </form>
                    <div className="space-y-4">
                        {comments.length === 0 ? (
                            <div className="text-gray-500 text-sm">Aucun commentaire pour ce projet.</div>
                        ) : (
                            comments.map((comment) => (
                                <div key={comment.id} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                                    <div className="flex items-center mb-1">
                                        <span className="font-semibold text-gray-800 text-sm mr-2">{comment.user?.name || "Utilisateur"}</span>
                                        <span className="text-xs text-gray-400">{new Date(comment.created_at).toLocaleString('fr-FR')}</span>
                                    </div>
                                    <div className="text-gray-700 text-sm">{comment.content}</div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

// Composant TaskCard simplifié
const TaskCard = ({ task, onStatusChange, onDelete }) => {
    const getStatusColor = (etat) => {
        switch (etat) {
            case "terminée":
                return "bg-green-100 text-green-800 border-green-200";
            case "en cours":
                return "bg-blue-100 text-blue-800 border-blue-200";
            case "en attente":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const getNextStatus = (currentStatus) => {
        switch (currentStatus) {
            case "en attente":
                return "en cours";
            case "en cours":
                return "terminée";
            default:
                return currentStatus;
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200/50 p-4 hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-sm leading-tight mb-2">{task.titre}</h4>
                    
                    {/* Affichage de l'utilisateur assigné */}
                    <div className="flex items-center space-x-2 mb-2">
                        <div className="w-5 h-5 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                                {task.assigned_user?.name?.charAt(0) || 'U'}
                            </span>
                        </div>
                        <span className="text-xs text-gray-600">
                            {task.assigned_user?.name || 'Non assigné'}
                        </span>
                    </div>
                </div>
                
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => onDelete(task.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors duration-200"
                        title="Supprimer"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>
            
            {task.description && (
                <p className="text-xs text-gray-600 mb-3 line-clamp-2">{task.description}</p>
            )}
            
            <div className="flex items-center justify-between">
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(task.etat)}`}>
                    {task.etat}
                </span>
                
                <div className="flex items-center space-x-2">
                    <Link
                        to={`/tasks/${task.id}`}
                        className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors duration-200 font-medium"
                    >
                        Détail
                    </Link>
                    
                    {task.etat !== "terminée" && (
                        <button
                            onClick={() => onStatusChange(task.id, getNextStatus(task.etat))}
                            className="text-xs text-slate-700 hover:text-slate-900 font-medium transition-colors duration-200"
                        >
                            Marquer comme {getNextStatus(task.etat)}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectDetail; 