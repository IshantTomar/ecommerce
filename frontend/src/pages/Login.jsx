import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import { setAccessToken } from '../utils/tokenStore';
import { getMe } from '../services/userService';
import useUserStore from '../store/useUserStore';
import { useSearchParams } from 'react-router-dom';

const Login = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});

  const [serverError, setServerError] = useState('');

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const setUser = useUserStore((state) => state.setUser);

  const [searchParams] = useSearchParams();
  const isCompromised = searchParams.get('reason') === 'compromised';

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

    // optional: also clear general server error
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    setServerError('');

    if (!form.email) {
      newErrors.email = 'Email is required';
    }

    if (!form.password) {
      newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return; // stop API call
    }

    try {
      setLoading(true);
      const response = await login(form);
      const { accessToken } = response.data;
      setAccessToken(accessToken);

      const userResponse = await getMe();
      setUser(userResponse.data.user);

      navigate('/dashboard');
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

  console.log('API URL:', import.meta.env.VITE_API_URL);

  return (
    <>
      <div className="flex items-center justify-center min-h-screen">
        <div className="border-2 border-indigo-900 w-full max-w-md bg-gray-900 rounded-3xl shadow-xl shadow-zinc-950 flex flex-col overflow-hidden">
          {/* FORM */}
          <form onSubmit={handleSubmit} className="flex flex-col w-full px-8 pt-8 pb-6">
            <h1 className="text-center text-4xl font-extrabold mb-6">Login</h1>

            {isCompromised && (
              <p className="pl-4 bg-red-950 text-red-200 text-lg rounded-xl border border-red-400 py-2 mb-4">
                Session compromised. Please login again.
              </p>
            )}
            {serverError && typeof serverError === 'string' && (
              <p className="pl-4 bg-red-950 text-red-200 text-lg rounded-xl border border-red-400 py-2 mb-4">
                {serverError}
              </p>
            )}

            {/* EMAIL */}
            <p className="font-bold text-lg">Email:</p>
            <input
              value={form.email}
              name="email"
              type="text"
              placeholder="Email.."
              onChange={handleChange}
              className="pl-4 py-2 mt-2 bg-gray-800 w-full border border-indigo-500 rounded-xl outline-none focus:border-indigo-400 focus:border-2 transition"
            />
            {errors.email && <p className="text-red-400 text-sm pl-2 mt-1">{errors.email}</p>}
            {serverError?.email && (
              <p className="text-red-400 text-sm pl-2 mt-1">{serverError.email}</p>
            )}

            {/* PASSWORD */}
            <p className="font-bold text-lg mt-4">Password:</p>
            <input
              value={form.password}
              name="password"
              type="password"
              placeholder="Password.."
              onChange={handleChange}
              className="pl-4 py-2 mt-2 bg-gray-800 w-full border border-indigo-500 rounded-xl outline-none focus:border-indigo-400 focus:border-2 transition"
            />
            {errors.password && <p className="text-red-400 text-sm pl-2 mt-1">{errors.password}</p>}
            {serverError?.password && (
              <p className="text-red-400 text-sm pl-2 mt-1">{serverError.password}</p>
            )}

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className={`w-fit px-5 py-2 mt-5 rounded-2xl transition shadow-lg ${
                loading
                  ? 'bg-indigo-400 cursor-not-allowed shadow-none'
                  : 'bg-indigo-600 cursor-pointer shadow-indigo-700/50 hover:shadow-indigo-500 hover:-translate-y-1'
              }`}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* FOOTER */}
          <div className="bg-gray-800 w-full py-3 text-center">
            <p>
              Not registered?{' '}
              <Link
                to="/register"
                className="text-blue-200 font-bold hover:text-blue-50 hover:underline"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
