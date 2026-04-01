import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { register } from '../services/authService';

const Register = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});

  const [serverError, setServerError] = useState('');

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validate = (data) => {
    const newErrors = {};

    if (!data.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (data.username.length < 3 || data.username.length > 16) {
      newErrors.username = 'Username must be between 3 to 16 characters';
    }

    if (!data.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!data.password) {
      newErrors.password = 'Password is required';
    } else if (data.password.length < 6 || data.password.length > 16) {
      newErrors.password = 'Password must be between 6 to 16 characters';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));

    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate(form);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return; // stop submission
    }

    try {
      setLoading(true);
      const response = await register(form);

      navigate('/login');
    } catch (error) {
      console.error(error);

      const data = error.response?.data;
      // Case 1: validation errors (array)
      if (data?.errors) {
        const newErrors = {};

        data.errors.forEach((err) => {
          newErrors[err.path] = err.msg;
        });

        setErrors(newErrors);
        return;
      }

      // Case 2: general error
      if (data?.message) {
        setServerError(data.message);
      } else {
        setServerError('Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen">
        <div className="border-2 border-indigo-900 w-full max-w-md bg-gray-900 rounded-3xl shadow-xl shadow-zinc-950 flex flex-col overflow-hidden">
          <form onSubmit={handleSubmit} className="flex flex-col w-full px-8 pt-8 pb-6">
            <h1 className="text-center text-4xl font-extrabold mb-6">Register</h1>
            {serverError && typeof serverError === 'string' && (
              <p className="pl-4 bg-red-950 text-red-200 text-lg rounded-xl border border-red-400 py-2 mb-4">
                {serverError}
              </p>
            )}
            <p className="font-bold text-lg">Username:</p>
            <input
              name="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              className="pl-4 py-2 mt-2 bg-gray-800 w-full border border-indigo-500 rounded-xl outline-none focus:border-indigo-400 focus:border-2 transition"
              placeholder="Username.."
            />
            {errors.username && <p className="text-red-400 text-sm pl-2 mt-1">{errors.username}</p>}
            {serverError?.username && (
              <p className="text-red-400 text-sm pl-2 mt-1">{serverError.username}</p>
            )}

            <p className="font-bold text-lg">Email:</p>
            <input
              name="email"
              type="text"
              value={form.email}
              onChange={handleChange}
              className="pl-4 py-2 mt-2 bg-gray-800 w-full border border-indigo-500 rounded-xl outline-none focus:border-indigo-400 focus:border-2 transition"
              placeholder="Email.."
            />
            {errors.email && <p className="text-red-400 text-sm pl-2 mt-1">{errors.email}</p>}
            {serverError?.email && (
              <p className="text-red-400 text-sm pl-2 mt-1">{serverError.email}</p>
            )}

            <p className="font-bold text-lg">Password:</p>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="pl-4 py-2 mt-2 bg-gray-800 w-full border border-indigo-500 rounded-xl outline-none focus:border-indigo-400 focus:border-2 transition"
              placeholder="Password.."
            />
            {errors.password && <p className="text-red-400 text-sm pl-2 mt-1">{errors.password}</p>}
            {serverError?.password && (
              <p className="text-red-400 text-sm pl-2 mt-1">{serverError.password}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-fit px-5 py-2 mt-5 rounded-2xl transition shadow-lg ${
                loading
                  ? 'bg-indigo-400 cursor-not-allowed shadow-none'
                  : 'bg-indigo-600 cursor-pointer shadow-indigo-700/50 hover:shadow-indigo-500 hover:-translate-y-1'
              }`}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
          <div className="bg-gray-800 w-full py-3 text-center">
            <p>
              Already registered?{' '}
              <Link
                to="/login"
                className="text-blue-200 font-bold hover:text-blue-50 hover:underline"
              >
                Login Here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
