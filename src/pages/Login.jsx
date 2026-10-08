import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import logo from "../assets/logo.png";

function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/admin");
    } catch (err) {
      setError("Invalid Email or Password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050505] px-4 py-10">

      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#19c77a]/5 blur-[120px]" />

      {/* Top accent */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#19c77a]/70 to-transparent" />

      <div className="relative w-full max-w-md">

        {/* Login Card */}
        <div className="border border-white/10 bg-[#090909]/95 p-6 shadow-2xl backdrop-blur-xl sm:p-8">

          {/* Header */}
          <div className="mb-8 text-center">

            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center">
              <img
                src={logo}
                alt="SOUL Esports"
                className="h-full w-full object-contain"
              />
            </div>

            <div className="flex items-center justify-center gap-2">
              <h1 className="text-3xl font-black tracking-[0.2em] text-white">
                SOUL
              </h1>

              <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#19c77a]">
                Esports
              </span>
            </div>

            <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.28em] text-gray-600">
              Admin Access
            </p>
          </div>

          {/* Divider */}
          <div className="mb-7 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <form onSubmit={handleLogin} className="space-y-5">

            {/* Email */}
            <div>
              <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                Email
              </label>

              <input
                type="email"
                placeholder="Enter admin email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm text-white outline-none transition-all duration-300 placeholder:text-gray-700 focus:border-[#19c77a]/50 focus:bg-[#19c77a]/[0.03] focus:ring-1 focus:ring-[#19c77a]/20"
              />
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                Password
              </label>

              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm text-white outline-none transition-all duration-300 placeholder:text-gray-700 focus:border-[#19c77a]/50 focus:bg-[#19c77a]/[0.03] focus:ring-1 focus:ring-[#19c77a]/20"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="border border-red-500/20 bg-red-500/5 px-4 py-3 text-center text-xs font-medium text-red-400">
                {error}
              </div>
            )}

            {/* Login */}
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full overflow-hidden bg-[#19c77a] px-4 py-3.5 text-xs font-black uppercase tracking-[0.2em] text-black transition-all duration-300 hover:bg-[#20dc89] hover:shadow-[0_0_30px_rgba(25,199,122,0.18)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="relative z-10">
                {loading ? "Authenticating..." : "Admin Login"}
              </span>

              {!loading && (
                <span className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-500 group-hover:translate-x-full" />
              )}
            </button>
          </form>

          {/* Back */}
          <button
            onClick={() => navigate("/")}
            className="mt-6 w-full text-center text-[10px] font-bold uppercase tracking-[0.18em] text-gray-600 transition-colors duration-300 hover:text-[#19c77a]"
          >
            ← Back to Website
          </button>
        </div>

        {/* Bottom status */}
        <div className="mt-5 flex items-center justify-center gap-2">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#19c77a] opacity-50" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#19c77a]" />
          </span>

          <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-gray-700">
            Secure Admin Portal
          </span>
        </div>

      </div>
    </div>
  );
}

export default Login;