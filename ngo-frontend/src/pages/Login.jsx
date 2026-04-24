import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import API from "../services/api";
import { useAuth } from "../state/AuthContext";
import { decodeJwt } from "../utils/jwt";

function dashboardFor(role) {
  return role === "admin" ? "/admin" : "/donor";
}

export default function Login() {
  const [form, setForm] = useState({ email: "apurva@test.com", password: "admin123" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new URLSearchParams();
      formData.append("username", form.email);
      formData.append("password", form.password);
      const res = await API.post("/login", formData);
      const decoded = decodeJwt(res.data.access_token);
      login({
        accessToken: res.data.access_token,
        profile: {
          name: decoded?.name || form.email.split("@")[0],
          email: decoded?.email || decoded?.sub || form.email,
          role: decoded?.role || "donor",
        },
      });
      navigate(location.state?.from || dashboardFor(decoded?.role || "donor"), { replace: true });
    } catch (err) {
      setError(err?.response?.data?.detail || "Unable to sign in. Check that FastAPI is running and your credentials are valid.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-[calc(100vh-80px)] place-items-center bg-gradient-to-br from-blue-50 via-white to-emerald-50 px-4 py-12">
      <Motion.form
        onSubmit={submit}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft"
      >
        <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-600">Welcome back</p>
        <h1 className="display-font mt-3 text-4xl font-black text-slate-950">Login to TraceAid</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">Sign in with a real backend account. Admin users are redirected to `/admin`, donors to `/donor`.</p>
        <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Local admin dev credentials are prefilled for testing.</p>

        {error ? <p className="mt-5 rounded-2xl bg-rose-50 p-3 text-sm font-bold text-rose-700">{error}</p> : null}

        <label className="mt-6 block text-sm font-bold text-slate-700">
          Email
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            required
          />
        </label>
        <label className="mt-4 block text-sm font-bold text-slate-700">
          Password
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            required
          />
        </label>
        <button disabled={loading} className="mt-6 w-full rounded-full bg-gradient-to-r from-blue-600 to-emerald-500 px-6 py-3 font-black text-white shadow-lg shadow-emerald-100 disabled:cursor-not-allowed disabled:opacity-70">
          {loading ? "Signing in..." : "Login"}
        </button>
        <p className="mt-5 text-center text-sm font-semibold text-slate-600">
          New donor? <Link to="/register" className="font-black text-emerald-700">Create account</Link>
        </p>
      </Motion.form>
    </main>
  );
}
