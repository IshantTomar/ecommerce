import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { register } from '../services/authService';

const Register = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate(form);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return; // stop submission
    }

    console.log(form);
    // API call goes here
    const response = await register(form);
    console.log(register);
  };

  return (
    <>
      <div>
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
          <p>Username:</p>
          <input
            name="username"
            type="text"
            value={form.username}
            onChange={handleChange}
            placeholder="Username.."
          />
          {errors.username && <p>{errors.username}</p>}
          <br />

          <p>Email:</p>
          <input
            name="email"
            type="text"
            value={form.email}
            onChange={handleChange}
            placeholder="Email.."
          />
          {errors.email && <p>{errors.email}</p>}
          <br />

          <p>Passoword:</p>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password.."
          />
          {errors.password && <p>{errors.password}</p>}
          <br />
          <button type="submit">Register</button>
          <p>
            Already registered? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default Register;
