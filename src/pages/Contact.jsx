import React from 'react';
import { Phone, Mail, Clock, MapPin } from 'lucide-react';
import ContactForm from '../components/ContactForm';

const Contact = () => {
  const contactDetails = [
    {
      icon: <Phone size={20} />,
      label: 'Phone',
      value: '+91 89702 02304',
      href: 'tel:+918970202304',
      desc: 'Mon–Sat, 9am–6pm IST',
    },
    {
      icon: <Mail size={20} />,
      label: 'Email',
      value: 'smritasacred@gmail.com',
      href: 'mailto:smritasacred@gmail.com',
      desc: 'We reply within 24 hours',
    },
    {
      icon: <Clock size={20} />,
      label: 'Business Hours',
      value: 'Mon–Sat: 9am–6pm',
      href: null,
      desc: 'Sunday closed',
    },
    {
      icon: <MapPin size={20} />,
      label: 'Made in India',
      value: 'Handcrafted with Devotion',
      href: null,
      desc: 'Shipped PAN India',
    },
  ];

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="container-custom max-w-5xl">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="section-subtitle mb-3">Reach Out</p>
          <h1 className="section-title">Contact Us</h1>
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-yellow-700/40" />
            <span className="text-yellow-700/40">✦</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-yellow-700/40" />
          </div>
          <p className="font-body text-sm text-yellow-200/30 mt-6 max-w-md mx-auto leading-relaxed">
            Have a question about our fragrances, an order, or just want to share your experience? We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Contact Info */}
          <div>
            <h2 className="font-serif text-2xl text-yellow-400 mb-6">Get in Touch</h2>
            <div className="space-y-4 mb-10">
              {contactDetails.map((item, i) => (
                <div key={i} className="glass-card gold-border p-5 flex items-start gap-4 group">
                  <div className="w-11 h-11 rounded-full gold-border flex items-center justify-center text-yellow-600 group-hover:text-yellow-400 group-hover:border-yellow-400 transition-colors shrink-0">
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-[10px] tracking-[0.2em] text-yellow-700/50 uppercase mb-1">{item.label}</p>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="font-body text-base text-yellow-300 hover:text-yellow-400 transition-colors break-all"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="font-body text-base text-yellow-300">{item.value}</p>
                    )}
                    <p className="font-body text-xs text-yellow-700/40 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="tel:+918970202304"
                className="btn-gold flex-1 flex items-center justify-center gap-2"
              >
                <Phone size={14} /> Call Now
              </a>
              <a
                href="mailto:smritasacred@gmail.com"
                className="btn-outline-gold flex-1 flex items-center justify-center gap-2"
              >
                <Mail size={14} /> Send Email
              </a>
            </div>

            {/* Decorative quote */}
            <div className="mt-8 border border-yellow-800/20 bg-yellow-900/5 p-5">
              <p className="text-2xl mb-2 text-center">🪔</p>
              <p className="font-sans text-yellow-200/30 italic text-sm text-center leading-relaxed">
                "Every question is a prayer. We are always listening."
              </p>
              <p className="font-body text-xs text-yellow-800/30 text-center mt-2 tracking-widest">— Team SMRITA</p>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="font-serif text-2xl text-yellow-400 mb-6">Send a Message</h2>
            <div className="glass-card gold-border p-6 md:p-8">
              <ContactForm />
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl text-yellow-400">Frequently Asked</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { q: 'How long does delivery take?', a: 'Orders are typically delivered within 3–5 business days across India. Express shipping available in select cities.' },
              { q: 'Are the incense sticks 100% natural?', a: 'Yes. All our incense sticks are made with pure natural ingredients — no synthetic fragrances, chemicals, or artificial binders.' },
              { q: 'How does the combo deal work?', a: 'Add any 3 products to your cart and the price automatically changes to ₹250 (saving you ₹50). No coupon needed.' },
              { q: 'Can I return or exchange my order?', a: 'We accept returns within 7 days of delivery for unopened items. Contact us at smritasacred@gmail.com to initiate a return.' },
            ].map((faq, i) => (
              <div key={i} className="glass-card gold-border p-5">
                <h3 className="font-body text-sm font-bold text-yellow-400 mb-2">{faq.q}</h3>
                <p className="font-body text-sm text-yellow-200/40 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
