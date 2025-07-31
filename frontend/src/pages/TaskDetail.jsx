import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const TaskDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [task, setTask] = useState(null);
    const [comments, setComments] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [editingTask, setEditingTask] = useState(false);
    const [editForm, setEditForm] = useState({});

    useEffect(() => {
        fetchTask();
        fetchComments();
        fetchUsers();
    }, [id]);

    const fetchTask = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/tasks/${id}`);
            setTask(response.data);
            setEditForm({
                title: response.data.title,
                description: response.data.description,
                status: response.data.status,
                deadline: response.data.deadline ? response.data.deadline.split('T')[0] : '',
                assigned_to: response.data.assigned_to || ''
            });
        } catch (error) {
            console.error('Erreur lors de la récupération de la tâche:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchComments = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/tasks/${id}/comments`);
            setComments(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des commentaires:', error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des utilisateurs:', error);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const response = await axios.post(`http://localhost:8000/api/tasks/${id}/comments`, {
                texte: newComment
            });
            setComments([response.data, ...comments]);
            setNewComment('');
        } catch (error) {
            console.error('Erreur lors de l\'ajout du commentaire:', error);
        }
    };

    const handleUpdateTask = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:8000/api/tasks/${id}`, editForm);
            setTask(response.data);
            setEditingTask(false);
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la tâche:', error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) {
            try {
                await axios.delete(`http://localhost:8000/api/comments/${commentId}`);
                setComments(comments.filter(comment => comment.id !== commentId));
            } catch (error) {
                console.error('Erreur lors de la suppression du commentaire:', error);
            }
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'in_progress':
                return 'bg-blue-100 text-blue-800';
            case 'done':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'pending':
                return 'En attente';
            case 'in_progress':
                return 'En cours';
            case 'done':
                return 'Terminé';
            default:
                return status;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    if (!task) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Tâche non trouvée</h1>
                        <Link to="/dashboard" className="text-blue-600 hover:text-blue-800">
                            Retour au tableau de bord
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center space-x-2 mb-4">
                        <Link to={`/projects/${task.project_id}`} className="text-blue-600 hover:text-blue-800">
                            ← Retour au projet
                        </Link>
                    </div>
                    
                    {editingTask ? (
                        <form onSubmit={handleUpdateTask} className="bg-white rounded-lg shadow p-6">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Titre
                                </label>
                                <input
                                    type="text"
                                    value={editForm.title}
                                    onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={editForm.description}
                                    onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows="4"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Statut
                                    </label>
                                    <select
                                        value={editForm.status}
                                        onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="pending">En attente</option>
                                        <option value="in_progress">En cours</option>
                                        <option value="done">Terminé</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Assigné à
                                    </label>
                                    <select
                                        value={editForm.assigned_to}
                                        onChange={(e) => setEditForm({...editForm, assigned_to: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Non assigné</option>
                                        {users.map((user) => (
                                            <option key={user.id} value={user.id}>
                                                {user.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Date d'échéance
                                    </label>
                                    <input
                                        type="date"
                                        value={editForm.deadline}
                                        onChange={(e) => setEditForm({...editForm, deadline: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setEditingTask(false)}
                                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors duration-200"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                                >
                                    Sauvegarder
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{task.title}</h1>
                                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                                        <span>Projet: {task.project?.name}</span>
                                        <span>•</span>
                                        <span>Créé le {new Date(task.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(task.status)}`}>
                                        {getStatusText(task.status)}
                                    </span>
                                    <button
                                        onClick={() => setEditingTask(true)}
                                        className="text-gray-600 hover:text-gray-800"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                                <p className="text-gray-700 whitespace-pre-wrap">
                                    {task.description || 'Aucune description'}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-1">Assigné à</h4>
                                    <div className="flex items-center space-x-2">
                                        {task.assigned_user ? (
                                            <>
                                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                                    <span className="text-white text-sm font-medium">
                                                        {task.assigned_user.name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <span className="text-gray-900">{task.assigned_user.name}</span>
                                            </>
                                        ) : (
                                            <span className="text-gray-500">Non assigné</span>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-1">Date d'échéance</h4>
                                    <span className="text-gray-900">
                                        {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'Non définie'}
                                    </span>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-1">Commentaires</h4>
                                    <span className="text-gray-900">{comments.length}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Commentaires */}
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6 border-b">
                        <h2 className="text-lg font-semibold text-gray-900">Commentaires</h2>
                    </div>

                    {/* Formulaire d'ajout de commentaire */}
                    <div className="p-6 border-b">
                        <form onSubmit={handleAddComment}>
                            <div className="flex space-x-3">
                                <div className="flex-1">
                                    <textarea
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Ajouter un commentaire..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        rows="3"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={!newComment.trim()}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Ajouter
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Liste des commentaires */}
                    <div className="p-6">
                        {comments.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                Aucun commentaire pour le moment
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {comments.map((comment) => (
                                    <div key={comment.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                                    <span className="text-white text-sm font-medium">
                                                        {comment.user?.name?.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <div className="flex items-center space-x-2">
                                                        <span className="font-medium text-gray-900">
                                                            {comment.user?.name}
                                                        </span>
                                                        <span className="text-sm text-gray-500">
                                                            {new Date(comment.created_at).toLocaleString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-700 mt-1">{comment.texte}</p>
                                                </div>
                                            </div>
                                            {(comment.auteur_id === user?.id || user?.role === 'admin') && (
                                                <button
                                                    onClick={() => handleDeleteComment(comment.id)}
                                                    className="text-red-600 hover:text-red-800 transition-colors duration-200"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskDetail; 