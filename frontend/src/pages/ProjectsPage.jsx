import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

export default function ProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedClient, setSelectedClient] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("Ongoing");
  const [myProjectsOnly, setMyProjectsOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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
        setError("Erreur lors du chargement des projets");
      }
    } catch (err) {
      setError("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  // Générer des projets de test pour simuler l'image
  const generateTestProjects = () => {
    const testProjects = [
      {
        id: 1,
        name: "3 Storey",
        progress: 100,
        status: "ONGOING",
        pendingTasks: 0,
        client: "Tony Seth",
        assignedUsers: ["AD", "AB", "GB"],
        color: "pink"
      },
      {
        id: 2,
        name: "585258",
        progress: 100,
        status: "ONGOING",
        pendingTasks: 0,
        client: "ADC123",
        assignedUsers: ["AS", "A1"],
        color: "yellow"
      },
      {
        id: 3,
        name: "6-STORIED BUILDING",
        progress: 100,
        status: "ONGOING",
        pendingTasks: 0,
        client: "sagar",
        assignedUsers: ["IA", "MM"],
        color: "blue"
      },
      {
        id: 4,
        name: "aaa bbb",
        progress: 95.83,
        status: "ONGOING",
        pendingTasks: 1,
        client: "Tony Seth",
        assignedUsers: ["DU", "DG"],
        color: "purple"
      },
      {
        id: 5,
        name: "aaaaaaaeee",
        progress: 100,
        status: "ONGOING",
        pendingTasks: 0,
        client: "ADC123",
        assignedUsers: ["AD", "AB", "GB"],
        color: "green"
      },
      {
        id: 6,
        name: "AAAAAsdfs",
        progress: 100,
        status: "ONGOING",
        pendingTasks: 0,
        client: "sagar",
        assignedUsers: ["AS", "A1", "IA"],
        color: "indigo"
      }
    ];
    return testProjects;
  };

  const testProjects = generateTestProjects();

  const getProgressColor = (color) => {
    const colors = {
      pink: "bg-pink-500",
      yellow: "bg-yellow-500",
      blue: "bg-blue-500",
      purple: "bg-purple-500",
      green: "bg-green-500",
      indigo: "bg-indigo-500"
    };
    return colors[color] || "bg-blue-500";
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement...</p>
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
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
            </div>

            {/* Filters and Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                {/* Left side filters */}
                <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                  {/* My Projects checkbox */}
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={myProjectsOnly}
                      onChange={(e) => setMyProjectsOnly(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">My Projects</span>
                  </label>

                  {/* Status filter */}
                  <div className="flex items-center space-x-2">
                    <label className="text-sm text-gray-700">Status:</label>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="Ongoing">Ongoing</option>
                      <option value="Completed">Completed</option>
                      <option value="On Hold">On Hold</option>
                    </select>
                  </div>
                </div>

                {/* Right side actions */}
                <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                  {/* Client filter */}
                  <div className="flex items-center space-x-2">
                    <label className="text-sm text-gray-700">Client:</label>
                    <select
                      value={selectedClient}
                      onChange={(e) => setSelectedClient(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="All">All</option>
                      <option value="Tony Seth">Tony Seth</option>
                      <option value="ADC123">ADC123</option>
                      <option value="sagar">sagar</option>
                    </select>
                  </div>

                  {/* Search */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Rechercher des projets..."
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors duration-200 text-sm">
                      Rechercher
                    </button>
                  </div>

                  {/* New Project button */}
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm font-medium flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Nouveau Projet +</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testProjects.map((project) => (
                <div key={project.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  {/* Progress Bar */}
                  <div className={`h-2 ${getProgressColor(project.color)}`}></div>
                  
                  {/* Project Content */}
                  <div className="p-6">
                    {/* Project Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{project.name}</h3>
                        <div className="flex items-center space-x-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {project.status}
                          </span>
                          <span className="text-sm text-gray-500">
                            {project.pendingTasks} Tâche{project.pendingTasks !== 1 ? 's' : ''} en attente
                          </span>
                        </div>
                      </div>
                      
                      {/* More options */}
                      <div className="flex items-center space-x-2">
                        <Link 
                          to={`/projects/${project.id}`}
                          className="px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium"
                        >
                          Voir projet
                        </Link>
                        <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Client Info */}
                    <div className="mb-4">
                      <p className="text-sm text-gray-600">Client: {project.client}</p>
                    </div>

                    {/* Assigned Users */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {project.assignedUsers.slice(0, 3).map((user, index) => (
                          <div
                            key={index}
                            className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium text-gray-700"
                          >
                            {user}
                          </div>
                        ))}
                        {project.assignedUsers.length > 3 && (
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-500">
                            +{project.assignedUsers.length - 3}
                          </div>
                        )}
                      </div>
                      
                      {/* Progress percentage */}
                      <div className="text-sm font-medium text-gray-900">
                        {project.progress.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* No projects message */}
            {testProjects.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
                <p className="text-gray-500 mb-6">Get started by creating your first project</p>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200">
                  Create Project
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
} 