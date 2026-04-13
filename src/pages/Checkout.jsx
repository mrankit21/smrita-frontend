// ================================================================
// File: smrita/src/pages/Checkout.jsx
// UPDATED: Creates real order via backend API
// ================================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../utils/api';
import { Sparkles, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

const Checkout = () => {
  const { items, actualTotal, regularTotal, savings, hasCombo, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'cod',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Redirect if not logged in
  React.useEffect(() => {
    if (!user) {
      toast.error('Please login to checkout');
      navigate('/login', { state: { from: '/checkout' } });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Required';
    if (!form.phone.trim()) errs.phone = 'Required';
    else if (!/^\d{10}$/.test(form.phone.replace(/\s/g, ''))) errs.phone = 'Enter valid 10-digit number';
    if (!form.address.trim()) errs.address = 'Required';
    if (!form.city.trim()) errs.city = 'Required';
    if (!form.state.trim()) errs.state = 'Required';
    if (!form.pincode.trim()) errs.pincode = 'Required';
    else if (!/^\d{6}$/.test(form.pincode)) errs.pincode = '6-digit PIN required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) { toast.error('Your cart is empty'); return; }
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); toast.error('Please fill all required fields'); return; }

    setLoading(true);
    try {
      // Format items for backend (needs product._id)
      const orderItems = items.map(item => ({
        product: item._id || item.id,   // MongoDB _id
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
      }));

      const { data } = await orderAPI.create({
        items: orderItems,
        shippingAddress: {
          name: form.name,
          phone: form.phone,
          address: form.address,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
        },
        paymentMethod: form.paymentMethod,
      });

      if (data.success) {
        clearCart();
        toast.success('Order placed successfully!');
        navigate('/order-success', { state: { order: data.order } });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to place order. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ label, name, type = 'text', placeholder, half }) => (
    <div className={half ? 'col-span-1' : 'col-span-2'}>
      <label className="block font-body text-xs tracking-[0.2em] text-yellow-600/60 uppercase mb-2">{label}</label>
      <input
        type={type}
        name={name}
        value={form[name]}
        onChange={handleChange}
        placeholder={placeholder}
        className={`input-gold ${errors[name] ? 'border-red-500/60' : ''}`}
      />
      {errors[name] && <p className="mt-1 font-body text-xs text-red-400">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="container-custom max-w-5xl">
        <div className="mb-10">
          <p className="section-subtitle mb-2">Almost There</p>
          <h1 className="section-title">Checkout</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Personal Info */}
              <div className="glass-card gold-border p-6">
                <h2 className="font-body text-xs tracking-[0.3em] text-yellow-600 uppercase mb-5 font-bold">Personal Information</h2>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Full Name" name="name" placeholder="Your full name" />
                  <Field label="Phone Number" name="phone" placeholder="10-digit mobile number" />
                </div>
              </div>

              {/* Shipping */}
              <div className="glass-card gold-border p-6">
                <h2 className="font-body text-xs tracking-[0.3em] text-yellow-600 uppercase mb-5 font-bold">Shipping Address</h2>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Full Address" name="address" placeholder="House no., Street, Area" />
                  <Field label="City" name="city" placeholder="City" half />
                  <Field label="State" name="state" placeholder="State" half />
                  <Field label="PIN Code" name="pincode" placeholder="6-digit PIN" half />
                </div>
              </div>

              {/* Payment */}
              <div className="glass-card gold-border p-6">
                <h2 className="font-body text-xs tracking-[0.3em] text-yellow-600 uppercase mb-5 font-bold">Payment Method</h2>
                <div className="space-y-3">
                  {[
                    { value: 'cod', label: 'Cash on Delivery', desc: 'Pay when your order arrives' },
                    { value: 'upi', label: 'UPI Payment', desc: 'Pay via any UPI app' },
                    { value: 'card', label: 'Credit / Debit Card', desc: 'Secure card payment' },
                  ].map(method => (
                    <label key={method.value} className={`flex items-center gap-4 p-4 border cursor-pointer transition-colors ${form.paymentMethod === method.value ? 'border-yellow-500/50 bg-yellow-900/10' : 'border-yellow-800/20 hover:border-yellow-700/40'}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.value}
                        checked={form.paymentMethod === method.value}
                        onChange={handleChange}
                        className="accent-yellow-500"
                      />
                      <div>
                        <p className="font-body text-sm text-yellow-300">{method.label}</p>
                        <p className="font-body text-xs text-yellow-700/50">{method.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Summary */}
            <div>
              <div className="glass-card gold-border p-6 sticky top-24">
                <h2 className="font-body text-xs tracking-[0.3em] text-yellow-600 uppercase mb-5 font-bold">Order Summary</h2>

                <div className="space-y-3 mb-4 max-h-48 overflow-y-auto pr-1">
                  {items.map(item => (
                    <div key={item._id || item.id} className="flex justify-between items-center">
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-xs text-yellow-300/70 truncate">{item.name}</p>
                        <p className="font-body text-[10px] text-yellow-800/50">×{item.quantity}</p>
                      </div>
                      <span className="font-body text-sm text-yellow-400 shrink-0">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-yellow-600/20 pt-4 space-y-2 mb-4">
                  <div className="flex justify-between font-body text-sm">
                    <span className="text-yellow-700/60">Subtotal</span>
                    <span className="text-yellow-400">₹{regularTotal}</span>
                  </div>
                  {hasCombo && (
                    <div className="flex justify-between font-body text-sm text-green-400/80">
                      <span className="flex items-center gap-1"><Sparkles size={11} /> Combo Discount</span>
                      <span>–₹{savings}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-body text-sm">
                    <span className="text-yellow-700/60">Shipping</span>
                    <span className="text-green-400/70 text-xs">FREE</span>
                  </div>
                </div>

                <div className="border-t border-yellow-600/20 pt-4 mb-6">
                  <div className="flex justify-between items-baseline">
                    <span className="font-body text-sm text-yellow-600 uppercase tracking-widest">Total</span>
                    <span className="font-serif text-3xl text-yellow-400">₹{actualTotal}</span>
                  </div>
                  {savings > 0 && (
                    <p className="font-body text-xs text-green-400/60 text-right mt-1">Saving ₹{savings}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-gold w-full flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    <><Lock size={14} /> Place Order</>
                  )}
                </button>

                <p className="font-body text-[10px] text-yellow-800/40 text-center mt-3 tracking-wide">
                  Secure checkout · Free returns
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
