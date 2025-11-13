import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon, EnvelopeIcon } from "@heroicons/react/24/outline";
import { useUI } from "../../context/UIContext";
import Button from "../common/Button";
import Input from "../common/Input";
import emailjs from "@emailjs/browser"; // ✅ EmailJS import

const ContactModal = ({ isOpen, onClose, property }) => {
  const { showToast } = useUI();

  // ---- Agents list ----
  const agents = [
    { name: "Agent 1 (Rohit)", email: "rohit.sarkar55555555@gmail.com", phone: "01615755420" },
    { name: "Agent 2 (Rohi)",  email: "rohi80059@gmail.com",            phone: "01733794685"  },
  ];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    inquiryType: "general",
    toEmail: agents[0].email, // default agent
  });

  const [loading, setLoading] = useState(false);

  // 🔑 Your EmailJS credentials (replace with your actual IDs)
  const SERVICE_ID = "service_z33th2m";
  const TEMPLATE_ID = "template_yxre99b";
  const PUBLIC_KEY = "zIh7CjrnjXKOSv22H";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const selectedAgent = agents.find(a => a.email === formData.toEmail);

    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      phone: formData.phone,
      message: formData.message,
      inquiry_type: formData.inquiryType,
      property_title: property?.title || "N/A",
      property_address: `${property?.location?.address || ""}${
        property?.location?.city ? ", " + property.location.city : ""
      }`,
      agent_name: selectedAgent?.name,
      agent_email: selectedAgent?.email,
    };

    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
      showToast("✅ Message sent successfully! Agent will contact you soon.", "success");
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
        inquiryType: "general",
        toEmail: agents[0].email,
      });
      onClose();
    } catch (error) {
      console.error("EmailJS Error:", error);
      showToast("❌ Failed to send message. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gray-900/50"
              onClick={onClose}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
            >
              <button
                onClick={onClose}
                className="absolute p-2 text-gray-400 bg-white rounded-md right-3 top-3 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>

              <div className="sm:flex sm:items-start">
                <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto rounded-full bg-emerald-100 sm:mx-0 sm:h-10 sm:w-10">
                  <EnvelopeIcon className="w-6 h-6 text-emerald-600" />
                </div>

                <div className="w-full mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="mb-4 text-lg font-medium leading-6 text-gray-900">
                    Contact Agent
                  </h3>

                  {/* Property info */}
                  <div className="p-3 mb-4 rounded-lg bg-gray-50">
                    <h4 className="font-medium text-gray-900">{property?.title}</h4>
                    <p className="text-sm text-gray-600">
                      {property?.location?.address}
                      {property?.location?.city ? `, ${property.location.city}` : ""}
                    </p>
                  </div>

                  {/* Agent selection */}
                  <div className="p-3 mb-4 rounded-lg bg-gray-50">
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Send To (Agent)
                    </label>
                    <select
                      value={formData.toEmail}
                      onChange={(e) => setFormData({ ...formData, toEmail: e.target.value })}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {agents.map((a) => (
                        <option key={a.email} value={a.email}>
                          {a.name} — {a.phone}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Your Name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Full name"
                      />
                      <Input
                        label="Email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="your@email.com"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="(e.g., 01615755420)"
                      />
                      <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                          Inquiry Type
                        </label>
                        <select
                          value={formData.inquiryType}
                          onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="general">General Inquiry</option>
                          <option value="pricing">Pricing Information</option>
                          <option value="viewing">Schedule Viewing</option>
                          <option value="financing">Financing Options</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">
                        Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="I'm interested in this property..."
                      />
                    </div>

                    <div className="flex justify-end pt-4 space-x-3">
                      <Button type="button" variant="secondary" onClick={onClose}>
                        Cancel
                      </Button>
                      <Button type="submit" loading={loading}>
                        Send Message
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ContactModal;
