import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { useUI } from '../context/UIContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const ContactPage = () => {
  // === Agents you asked to add ===
  const agents = [
    {
      name: 'Agent 1',
      email: 'rohit.sarkar55555555@gmail.com',
      phone: '01615755420',
    },
    {
      name: 'Agent 2',
      email: 'rohi80059@gmail.com',
      phone: '01733794685',
    },
  ];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    toEmail: agents[0].email, // default send-to
  });
  const [loading, setLoading] = useState(false);
  const { showToast } = useUI();

  const contactInfo = [
    {
      icon: MapPinIcon,
      title: 'Visit Us',
      details: ['123 Real Estate Street', 'City, State 12345']
    },
    {
      icon: PhoneIcon,
      title: 'Call Us',
      details: ['(555) 123-4567', '(555) 987-6543']
    },
    {
      icon: EnvelopeIcon,
      title: 'Email Us',
      details: ['info@realestate.com', 'support@realestate.com']
    },
    {
      icon: ClockIcon,
      title: 'Office Hours',
      details: ['Mon - Fri: 9:00 AM - 6:00 PM', 'Sat - Sun: 10:00 AM - 4:00 PM']
    }
  ];

  // Build a mailto link so the user's default email client opens with everything prefilled
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { name, email, phone, subject, message, toEmail } = formData;

      // Fallback subject if empty (but subject is required anyway)
      const subj = subject?.trim() || 'Inquiry from website';

      // Build body with a neat template
      const bodyLines = [
        `Hello,`,
        ``,
        `${message}`,
        ``,
        `---`,
        `Sender: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone || 'N/A'}`,
      ];
      const body = bodyLines.join('\n');

      const mailto = `mailto:${encodeURIComponent(toEmail)}?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(body)}`;

      // Open the user's default mail app with prefilled data
      window.location.href = mailto;

      showToast('Opening your email app…', 'success');

      // reset form (optional)
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        toEmail: agents[0].email,
      });
    } catch {
      showToast('Failed to open email client. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-20 text-white bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="mb-6 text-5xl font-bold md:text-6xl">
              Contact Us
            </h1>
            <p className="max-w-3xl mx-auto text-xl text-blue-100 md:text-2xl">
              Ready to find your dream home? Get in touch with our expert team today.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 bg-white">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full">
                  <info.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="mb-3 text-lg font-semibold text-gray-900">
                  {info.title}
                </h3>
                {info.details.map((detail, idx) => (
                  <p key={idx} className="mb-1 text-gray-600">
                    {detail}
                  </p>
                ))}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Agents (Direct Call / Email Cards) */}
      <section className="py-10 bg-gray-50">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-6 text-3xl font-bold text-gray-900"
          >
            Our Agents — Quick Contact
          </motion.h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {agents.map((a, i) => (
              <motion.div
                key={a.email}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="p-6 bg-white shadow-md rounded-2xl"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{a.name}</h3>
                    <div className="mt-2 space-y-1">
                      <a
                        href={`mailto:${a.email}`}
                        className="flex items-center gap-2 text-blue-600 hover:underline"
                      >
                        <EnvelopeIcon className="w-5 h-5" />
                        {a.email}
                      </a>
                      <a
                        href={`tel:${a.phone}`}
                        className="flex items-center gap-2 text-blue-600 hover:underline"
                      >
                        <PhoneIcon className="w-5 h-5" />
                        {a.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <a
                      href={`tel:${a.phone}`}
                      className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                      Call
                    </a>
                    <a
                      href={`mailto:${encodeURIComponent(a.email)}?subject=${encodeURIComponent('Property Inquiry')}&body=${encodeURIComponent('Hello,\n\nI would like to know more about your listings.\n\nThanks,')}`}
                      className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200"
                    >
                      Email
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl px-4 mx-auto sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-4xl font-bold text-gray-900">
              Send Us a Message
            </h2>
            <p className="text-xl text-gray-600">
              Have a question? We'd love to hear from you.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="p-8 bg-white shadow-xl rounded-2xl"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Send To (agent) */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Send To <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.toEmail}
                  onChange={(e) => setFormData({ ...formData, toEmail: e.target.value })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {agents.map((a) => (
                    <option key={a.email} value={a.email}>
                      {a.name} — {a.email}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Input
                  label="Full Name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your full name"
                />

                <Input
                  label="Email Address"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your.email@example.com"
                />

                <Input
                  label="Phone Number"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(e.g., 01615755420)"
                />

                <Input
                  label="Subject"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="block w-full px-3 py-2 transition-all duration-200 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tell us more about your real estate needs..."
                />
              </div>

              <div className="text-center">
                <Button
                  type="submit"
                  loading={loading}
                  size="lg"
                  className="px-12"
                >
                  Send Message
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-white">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-4xl font-bold text-gray-900">
              Find Our Office
            </h2>
            <p className="text-xl text-gray-600">
              Visit us at our convenient downtown location
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center bg-gray-200 rounded-2xl h-96"
          >
            <div className="text-center text-gray-600">
              <MapPinIcon className="w-16 h-16 mx-auto mb-4" />
              <p className="text-lg">Interactive Map Coming Soon</p>
              <p className="text-sm">123 Real Estate Street, City, State 12345</p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
