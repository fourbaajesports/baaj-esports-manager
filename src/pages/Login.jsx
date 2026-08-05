import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    try {
      await login(email, password);
    } catch (err) {
      setError("Invalid Email or Password");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900">
      <div className="w-full max-w-md rounded-2xl bg-slate-800 p-8 shadow-xl">

        <h1 className="mb-8 text-center text-4xl font-bold text-yellow-400">
          🦅 4 Baaj
        </h1>

        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-lg bg-slate-700 p-3 text-white outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-lg bg-slate-700 p-3 text-white outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <p className="text-center text-red-400">
              {error}
            </p>
          )}

          <button
            className="w-full rounded-lg bg-yellow-500 p-3 font-bold text-black hover:bg-yellow-400"
          >
            Login
          </button>
        </form>

      </div>
    </div>
  );
}

export default Login;