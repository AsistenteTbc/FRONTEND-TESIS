import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // 👈 IMPORTANTE: Usamos el Contexto
import {
  Activity,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Shield,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // 👈 Extraemos la función login del contexto

  // Estados del formulario
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Estados de UI
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // 1. Usamos la función del Contexto (no el servicio directo)
      // Esto actualiza el estado global 'user' y 'isAuthenticated'
      await login(email, password);

      // 2. Si no hubo error, redirigimos al Dashboard
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Login failed", err);

      // 3. Manejo de errores
      if (err.response && err.response.status === 401) {
        setError("Correo o contraseña incorrectos.");
      } else {
        setError(
          "Error de conexión. Verifique que el servidor esté corriendo.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* --- FONDO ANIMADO --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "4s" }}
        ></div>
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "6s", animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "5s", animationDelay: "1s" }}
        ></div>
      </div>

      {/* --- ÍCONOS FLOTANTES --- */}
      <div className="absolute inset-0 pointer-events-none">
        <Shield
          className="absolute top-20 left-10 w-12 h-12 text-blue-400/20 animate-float"
          style={{ animationDelay: "0s" }}
        />
        <Activity
          className="absolute top-40 right-20 w-16 h-16 text-purple-400/20 animate-float"
          style={{ animationDelay: "1s" }}
        />
        <CheckCircle
          className="absolute bottom-32 left-1/4 w-10 h-10 text-green-400/20 animate-float"
          style={{ animationDelay: "2s" }}
        />
        <AlertCircle
          className="absolute bottom-20 right-1/3 w-14 h-14 text-red-400/20 animate-float"
          style={{ animationDelay: "3s" }}
        />
      </div>

      {/* --- TARJETA PRINCIPAL --- */}
      <div className="relative z-10 w-full max-w-md">
        {/* Header / Logo */}
        <div className="text-center mb-8 animate-fadeIn">
          <div className="inline-flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-3xl mb-4 shadow-2xl shadow-blue-500/50">
            <Activity className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
            TBC Health Portal
          </h1>
          <p className="text-blue-200/80">Sistema de Información de Salud</p>
        </div>

        {/* Formulario */}
        <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 shadow-2xl animate-slideUp">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Bienvenido</h2>
            <p className="text-gray-400 text-sm">
              Ingresa tus credenciales para acceder al sistema
            </p>
          </div>

          {/* MENSAJE DE ERROR */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-2 text-red-200 text-sm animate-fadeIn">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Input Email */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300"
              >
                Correo Electrónico
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-400 group-focus-within:text-blue-400 transition-colors duration-200" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  placeholder="admin@tbc.com"
                  required
                />
              </div>
            </div>

            {/* Input Password */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300"
              >
                Contraseña
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400 group-focus-within:text-blue-400 transition-colors duration-200" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Botón Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Iniciando sesión...</span>
                </>
              ) : (
                <>
                  <span>Iniciar Sesión</span>
                  <Activity className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Banner Info */}
        <div
          className="mt-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 backdrop-blur-sm animate-fadeIn"
          style={{ animationDelay: "0.3s" }}
        >
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <p className="text-blue-200 text-sm">
              <strong className="font-semibold">Portal Seguro:</strong> Tus
              datos están protegidos con encriptación de última generación.
            </p>
          </div>
        </div>
      </div>

      {/* --- ESTILOS INLINE (ANIMACIONES) --- */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-20px) rotate(5deg); }
          50% { transform: translateY(-10px) rotate(-5deg); }
          75% { transform: translateY(-15px) rotate(3deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float { animation: float 8s ease-in-out infinite; }
        .animate-fadeIn { animation: fadeIn 0.6s ease-out forwards; }
        .animate-slideUp { animation: slideUp 0.8s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default Login;
