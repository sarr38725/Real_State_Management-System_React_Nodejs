import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useUI();
  const { login, user } = useAuth();

  // If you still want to respect "from" when user was bounced from a protected route,
  // set this to location.state?.from?.pathname || '/' and use it below.
  // But per your request, we'll always go to '/' for non-admin.
  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/', { replace: true }); // go Home if already logged in
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const result = await login(formData.email, formData.password);

    if (!result.success) {
      showToast('Login failed. Please check your credentials.', 'error');
      setLoading(false);
      return;
    }

    // Success
    if (result.user?.role === 'admin') {
      showToast('Welcome Admin!', 'success');
      setTimeout(() => navigate('/admin', { replace: true }), 100);
    } else {
      showToast('Welcome back!', 'success');
      // Always go to Home for non-admin
      setTimeout(() => navigate('/', { replace: true }), 100);
      // If you ever want to respect "from", use:
      // setTimeout(() => navigate(from, { replace: true }), 100);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-gradient-to-br from-blue-50 to-indigo-100 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8"
      >
        <div className="p-8 bg-white shadow-xl rounded-2xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
            <p className="mt-2 text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                Sign up here
              </Link>
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={errors.email}
              />

              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  error={errors.password}
                />
                <button
                  type="button"
                  className="absolute text-gray-400 right-3 top-8 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {errors.submit && (
              <div className="p-3 text-sm text-red-600 rounded-lg bg-red-50">{errors.submit}</div>
            )}

            <Button type="submit" className="w-full" loading={loading} size="lg">
              Sign In
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
