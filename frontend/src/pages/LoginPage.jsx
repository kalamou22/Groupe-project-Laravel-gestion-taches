import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-violet-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        {/* Bulles animées */}
        <div className="bubble w-24 h-24 bg-emerald-400 left-10 bottom-0" style={{animationDelay: '0s'}}></div>
        <div className="bubble w-16 h-16 bg-cyan-400 right-20 bottom-10" style={{animationDelay: '2s'}}></div>
        <div className="bubble w-20 h-20 bg-purple-400 left-1/2 bottom-20" style={{animationDelay: '4s'}}></div>
        <div className="bubble w-12 h-12 bg-pink-400 right-1/3 bottom-32" style={{animationDelay: '6s'}}></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTAgMUg0MFYwSDFWNDBIMFYxWiIgZmlsbD0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjAzKSIvPgo8L3N2Zz4K')] opacity-40"></div>

      <div className="relative z-10 w-full max-w-6xl mx-auto flex items-center justify-center">
        <div className="flex w-full max-w-5xl bg-white/5 backdrop-blur-2xl rounded-[3rem] shadow-2xl border-4 border-transparent bg-clip-padding overflow-hidden transition-transform duration-300 hover:scale-105 group relative before:absolute before:inset-0 before:rounded-[3rem] before:bg-gradient-to-r before:from-emerald-400/40 before:via-cyan-400/30 before:to-purple-400/40 before:blur-2xl before:opacity-60 before:animate-glow z-10">
          
          {/* Left Panel - Branding */}
          <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 p-12 flex-col justify-center relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-8 right-8 w-20 h-20 border border-white/20 rounded-full"></div>
            <div className="absolute bottom-8 left-8 w-16 h-16 border border-white/20 rounded-xl rotate-45"></div>
            
            <div className="relative z-10">
              {/* Logo */}
              <div className="flex items-center mb-8">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mr-4 border border-white/30">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">GESTION DE TACHES</h1>
                  <p className="text-emerald-100 text-sm tracking-widest">PLATFORM</p>
                </div>
              </div>

              {/* Headline */}
              <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
                Accélérez votre
                <span className="block text-emerald-200">productivité</span>
              </h2>
              
              <p className="text-emerald-100 text-lg mb-10 leading-relaxed">
                La plateforme tout-en-un qui transforme votre façon de gérer les projets avec des outils intelligents et une interface intuitive.
              </p>

              {/* Features */}
              <div className="space-y-4">
                <div className="flex items-center text-white/90">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mr-4">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <span className="font-medium">Sécurité de niveau entreprise</span>
                </div>
                <div className="flex items-center text-white/90">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mr-4">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                  <span className="font-medium">Collaboration sans limites</span>
                </div>
                <div className="flex items-center text-white/90">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mr-4">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <span className="font-medium">Performance optimisée</span>
                </div>
              </div>
            </div>
        </div>

          {/* Right Panel - Login Form */}
          <div className="w-full lg:w-1/2 p-12 flex flex-col justify-center">
            {/* Mobile logo */}
            <div className="lg:hidden flex items-center justify-center mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">GESTION DE TACHES</h1>
                <p className="text-gray-400 text-xs tracking-widest">PLATFORM</p>
              </div>
            </div>

            {/* Form header */}
            <div className="text-center lg:text-left mb-8">
              <h2 className="text-3xl font-bold text-white mb-3">Connexion</h2>
              <p className="text-gray-400 text-lg">Accédez à votre dashboard</p>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start backdrop-blur-sm">
                <svg className="w-5 h-5 text-red-400 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm text-red-400 font-medium">Erreur d'authentification</p>
                  <p className="text-sm text-red-300">{error}</p>
                </div>
            </div>
          )}

            {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
              {/* Email field */}
            <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                Adresse email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-500 group-focus-within:text-emerald-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  type="email"
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 text-white placeholder-gray-500 backdrop-blur-sm hover:bg-white/10 rounded-2xl shadow-inner focus:ring-2 focus:ring-emerald-400 transition-all duration-300"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

              {/* Password field */}
            <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                Mot de passe
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-500 group-focus-within:text-emerald-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  required
                  onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 text-white placeholder-gray-500 backdrop-blur-sm hover:bg-white/10 rounded-2xl shadow-inner focus:ring-2 focus:ring-emerald-400 transition-all duration-300"
                  placeholder="Votre mot de passe"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-emerald-400 transition-colors duration-300"
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

              {/* Additional options */}
              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-emerald-500 border-gray-600 rounded focus:ring-emerald-500 focus:ring-2 bg-transparent"
                  />
                  <span className="ml-2 text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                    Se souvenir de moi
                  </span>
                </label>
                <button
                  type="button"
                  className="text-sm text-emerald-400 hover:text-emerald-300 font-medium transition-colors duration-300"
                >
                  Mot de passe oublié ?
                </button>
              </div>

              {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-[0.98] hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center group shadow-xl rounded-2xl shadow-lg bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 focus:ring-4 focus:ring-emerald-300/40 transition-all duration-300 scale-100 hover:scale-105 active:scale-95"
            >
              {loading ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-2 border-emerald-300 border-t-white rounded-full animate-spin mr-3"></div>
                    <span className="font-medium">Connexion...</span>
                </div>
              ) : (
                  <>
                    <span className="font-medium">Se connecter</span>
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
              )}
            </button>
          </form>

            {/* Sign up link */}
          <div className="mt-8 text-center">
              <p className="text-gray-400 text-sm">
                Nouveau sur GESTION DE TACHES ?{" "}
                <Link to="/register" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors duration-300">
                Créer un compte
              </Link>
            </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
