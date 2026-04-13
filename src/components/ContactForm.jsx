// ================================================================
// File: smrita/src/components/ContactForm.jsx
// UPDATED: Submits to real backend API
// ================================================================

import React, { useState } from 'react';
import { Send, Loader } from 'lucide-react';
import { contactAPI } from '../utils/api';
import toast from 'react-hot-toast';

const ContactForm = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Enter a valid email';
    if (!form.message.trim()) newErrors.message = 'Message is required';
    else if (form.message.trim().length < 10) newErrors.message = 'Message must be at least 10 characters';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const { data } = await contactAPI.submit(form);
      if (data.success) {
        toast.success("Message sent! We'll respond within 24 hours.");
        setForm({ name: '', email: '', message: '' });
        setErrors({});
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to send message. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block font-body text-xs tracking-[0.2em] text-yellow-600/70 uppercase mb-2">Your Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Devotee's name"
          className={`input-gold ${errors.name ? 'border-red-500/60' : ''}`}
        />
        {errors.name && <p className="mt-1 font-body text-xs text-red-400">{errors.name}</p>}
      </div>

      <div>
        <label className="block font-body text-xs tracking-[0.2em] text-yellow-600/70 uppercase mb-2">Email Address</label>
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
        <label className="block font-body text-xs tracking-[0.2em] text-yellow-600/70 uppercase mb-2">Your Message</label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          rows={5}
          placeholder="Share your thoughts, questions, or blessings..."
          className={`input-gold resize-none ${errors.message ? 'border-red-500/60' : ''}`}
        />
        {errors.message && <p className="mt-1 font-body text-xs text-red-400">{errors.message}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-gold w-full flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <><Loader size={16} className="animate-spin" /> Sending...</>
        ) : (
          <><Send size={16} /> Send Message</>
        )}
      </button>
    </form>
  );
};

export default ContactForm;
