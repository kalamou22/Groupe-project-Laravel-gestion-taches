import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function MessagesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // Données de test pour les messages
  const mockMessages = [
    {
      id: 1,
      sender: {
        id: 2,
        name: "Test User",
        email: "test@api.com"
      },
      receiver: {
        id: 1,
        name: "Admin User",
        email: "admin@gestion.com"
      },
      content: "Bonjour ! J'ai terminé la tâche de développement frontend. Pouvez-vous la vérifier ?",
      created_at: "2025-07-28T10:30:00.000000Z",
      read: false
    },
    {
      id: 2,
      sender: {
        id: 1,
        name: "Admin User",
        email: "admin@gestion.com"
      },
      receiver: {
        id: 2,
        name: "Test User",
        email: "test@api.com"
      },
      content: "Parfait ! Je vais examiner le code et vous donner un retour rapidement.",
      created_at: "2025-07-28T11:15:00.000000Z",
      read: true
    },
    {
      id: 3,
      sender: {
        id: 3,
        name: "Test User",
        email: "test@example.com"
      },
      receiver: {
        id: 1,
        name: "Admin User",
        email: "admin@gestion.com"
      },
      content: "Salut ! Quand est-ce que nous allons faire la réunion de projet ?",
      created_at: "2025-07-28T14:20:00.000000Z",
      read: false
    }
  ];

  const mockUsers = [
    {
      id: 1,
      name: "Admin User",
      email: "admin@gestion.com",
      role: "admin",
      online: true
    },
    {
      id: 2,
      name: "Test User",
      email: "test@api.com",
      role: "user",
      online: true
    },
    {
      id: 3,
      name: "Test User",
      email: "test@example.com",
      role: "user",
      online: false
    }
  ];

  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => {
      setMessages(mockMessages);
      setLoading(false);
    }, 1000);
  }, [mockMessages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedUser) return;

    const message = {
      id: Date.now(),
      sender: user,
      receiver: selectedUser,
      content: newMessage,
      created_at: new Date().toISOString(),
      read: false
    };

    setMessages([...messages, message]);
    setNewMessage("");
  };

  const getConversationMessages = (userId) => {
    return messages.filter(
      msg => 
        (msg.sender.id === user.id && msg.receiver.id === userId) ||
        (msg.sender.id === userId && msg.receiver.id === user.id)
    ).sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  };

  const getUnreadCount = (userId) => {
    return messages.filter(
      msg => msg.sender.id === userId && msg.receiver.id === user.id && !msg.read
    ).length;
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des messages...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
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
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="mt-2 text-gray-600">
            Communiquez avec les membres de votre équipe
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex h-[600px]">
            {/* Sidebar - Liste des utilisateurs */}
            <div className="w-1/3 border-r border-gray-200 bg-gray-50">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Conversations</h3>
              </div>
              
              <div className="overflow-y-auto h-full">
                {mockUsers
                  .filter(u => u.id !== user.id)
                  .map((userItem) => {
                    const unreadCount = getUnreadCount(userItem.id);
                    const lastMessage = getConversationMessages(userItem.id).slice(-1)[0];
                    
                    return (
                      <div
                        key={userItem.id}
                        onClick={() => setSelectedUser(userItem)}
                        className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors duration-200 ${
                          selectedUser?.id === userItem.id ? "bg-blue-50 border-blue-200" : ""
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-sm font-semibold">
                                {userItem.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            {userItem.online && (
                              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-medium text-gray-900 truncate">
                                {userItem.name}
                              </h4>
                              {unreadCount > 0 && (
                                <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                  {unreadCount}
                                </span>
                              )}
                            </div>
                            
                            {lastMessage && (
                              <div className="flex items-center justify-between mt-1">
                                <p className="text-xs text-gray-500 truncate">
                                  {lastMessage.sender.id === user.id ? "Vous: " : ""}
                                  {lastMessage.content}
                                </p>
                                <span className="text-xs text-gray-400 ml-2">
                                  {formatTime(lastMessage.created_at)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
              {selectedUser ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 bg-white">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-semibold">
                            {selectedUser.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        {selectedUser.online && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{selectedUser.name}</h3>
                        <p className="text-sm text-gray-500">
                          {selectedUser.online ? "En ligne" : "Hors ligne"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {getConversationMessages(selectedUser.id).map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender.id === user.id ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.sender.id === user.id
                              ? "bg-blue-600 text-white"
                              : "bg-gray-200 text-gray-900"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.sender.id === user.id ? "text-blue-100" : "text-gray-500"
                          }`}>
                            {formatTime(message.created_at)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200 bg-white">
                    <div className="flex space-x-4">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                        placeholder="Tapez votre message..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                      >
                        Envoyer
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                /* Empty State */
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Sélectionnez une conversation</h3>
                    <p className="text-gray-500">
                      Choisissez un membre de l'équipe pour commencer à discuter
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
} 