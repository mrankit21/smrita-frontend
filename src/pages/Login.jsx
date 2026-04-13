// ================================================================
// File: smrita/src/pages/Login.jsx
// UPDATED: Real API login with proper error handling
// ================================================================

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || '/';

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Minimum 6 characters';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Login failed. Please try again.';
      toast.error(msg);
      // Highlight fields on auth error
      if (msg.toLowerCase().includes('password')) {
        setErrors({ password: 'Incorrect password' });
      } else if (msg.toLowerCase().includes('email')) {
        setErrors({ email: 'Email not found' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  return (
    <div className="pt-24 pb-20 min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="font-serif text-5xl gold-shimmer-text tracking-[0.2em] mb-1">SMRITA</h1>
          <p className="font-body text-xs tracking-[0.4em] text-yellow-700/50 uppercase">Made with Devotion</p>
        </div>

        <div className="glass-card gold-border p-8">
          <h2 className="font-serif text-2xl text-yellow-400 mb-1">Welcome Back</h2>
          <p className="font-body text-sm text-yellow-700/50 mb-7">Sign in to continue your sacred journey</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-body text-xs tracking-[0.2em] text-yellow-600/60 uppercase mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className={`input-gold ${errors.email ? 'border-red-500/60' : ''}`}
              />
              {errors.email && <p className="mt-1 font-body text-xs text-red-400">{errors.email}</p>}
            </div>

            <div>
              <label className="block font-body text-xs tracking-[0.2em] text-yellow-600/60 uppercase mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
                  className={`input-gold pr-10 ${errors.password ? 'border-red-500/60' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-yellow-700/50 hover:text-yellow-500"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 font-body text-xs text-red-400">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <><LogIn size={15} /> Sign In</>
              )}
            </button>
          </form>

          <p className="font-body text-sm text-center text-yellow-700/50 mt-6">
            New to SMRITA?{' '}
            <Link to="/signup" className="text-yellow-400 hover:text-yellow-300 transition-colors">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
