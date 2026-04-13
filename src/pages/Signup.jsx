// ================================================================
// File: smrita/src/pages/Signup.jsx
// UPDATED: Real API signup with proper error handling
// ================================================================

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Minimum 6 characters';
    if (form.password !== form.confirm) errs.confirm = 'Passwords do not match';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const user = await signup(form.name, form.email, form.password);
      toast.success(`Welcome to SMRITA, ${user.name}!`);
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Signup failed. Please try again.';
      toast.error(msg);
      if (msg.toLowerCase().includes('email already')) {
        setErrors({ email: 'This email is already registered' });
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
        <div className="text-center mb-10">
          <h1 className="font-serif text-5xl gold-shimmer-text tracking-[0.2em] mb-1">SMRITA</h1>
          <p className="font-body text-xs tracking-[0.4em] text-yellow-700/50 uppercase">Made with Devotion</p>
        </div>

        <div className="glass-card gold-border p-8">
          <h2 className="font-serif text-2xl text-yellow-400 mb-1">Create Account</h2>
          <p className="font-body text-sm text-yellow-700/50 mb-7">Begin your sacred journey with SMRITA</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {[
              { label: 'Full Name', name: 'name', type: 'text', placeholder: 'Your full name' },
              { label: 'Email', name: 'email', type: 'email', placeholder: 'your@email.com' },
            ].map(field => (
              <div key={field.name}>
                <label className="block font-body text-xs tracking-[0.2em] text-yellow-600/60 uppercase mb-2">{field.label}</label>
                <input
                  type={field.type}
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className={`input-gold ${errors[field.name] ? 'border-red-500/60' : ''}`}
                />
                {errors[field.name] && <p className="mt-1 font-body text-xs text-red-400">{errors[field.name]}</p>}
              </div>
            ))}

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
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-yellow-700/50 hover:text-yellow-500">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 font-body text-xs text-red-400">{errors.password}</p>}
            </div>

            <div>
              <label className="block font-body text-xs tracking-[0.2em] text-yellow-600/60 uppercase mb-2">Confirm Password</label>
              <input
                type="password"
                name="confirm"
                value={form.confirm}
                onChange={handleChange}
                placeholder="Repeat your password"
                className={`input-gold ${errors.confirm ? 'border-red-500/60' : ''}`}
              />
              {errors.confirm && <p className="mt-1 font-body text-xs text-red-400">{errors.confirm}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-gold w-full flex items-center justify-center gap-2 mt-2 disabled:opacity-60">
              {loading
                ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                : <><UserPlus size={15} /> Create Account</>
              }
            </button>
          </form>

          <p className="font-body text-sm text-center text-yellow-700/50 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-yellow-400 hover:text-yellow-300 transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
