import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import API from "../services/api";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await API.post("/users", form);
      setMessage("Account created. Redirecting to login...");
    } catch (err) {
      setMessage(err?.response?.data?.detail || "Unable to create account. Please verify the backend connection.");
      setLoading(false);
      return;
    } finally {
      setLoading(false);
    }

    setTimeout(() => navigate("/login"), 700);
  };

  return (
    <main className="grid min-h-[calc(100vh-80px)] place-items-center bg-gradient-to-br from-emerald-50 via-white to-blue-50 px-4 py-12">
      <Motion.form
        onSubmit={submit}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft"
      >
        <p className="text-sm font-black uppercase tracking-[0.22em] text-emerald-600">Join as donor</p>
        <h1 className="display-font mt-3 text-4xl font-black text-slate-950">Create account</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Public registration always creates a donor account. Admin accounts must be created manually or by an existing admin.
        </p>
        {message ? <p className="mt-5 rounded-2xl bg-emerald-50 p-3 text-sm font-bold text-emerald-700">{message}</p> : null}

        {["name", "email", "password"].map((field) => (
          <label key={field} className="mt-5 block text-sm font-bold capitalize text-slate-700">
            {field}
            <input
              type={field === "password" ? "password" : field === "email" ? "email" : "text"}
              value={form[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
              required
            />
          </label>
        ))}
        <button disabled={loading} className="mt-6 w-full rounded-full bg-slate-950 px-6 py-3 font-black text-white shadow-lg shadow-slate-200 disabled:opacity-70">
          {loading ? "Creating..." : "Register"}
        </button>
        <p className="mt-5 text-center text-sm font-semibold text-slate-600">
          Already registered? <Link to="/login" className="font-black text-blue-700">Login</Link>
        </p>
      </Motion.form>
    </main>
  );
}
