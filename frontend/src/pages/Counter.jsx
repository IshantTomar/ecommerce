import { useState } from 'react';

const Counter = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
  });

  const [errors, setErrors] = useState({});

  function validate(data) {
    const newErrors = {};

    if (!data.name) {
      newErrors.name = 'Name is required';
    }

    if (!data.email) {
      newErrors.email = 'Email is required';
    } else if (!data.email.includes('@')) {
      newErrors.email = 'Invalid email';
    }

    return newErrors;
  }

  function handleChange(e) {
    const { name, value } = e.target;

    const updatedForm = {
      ...form,
      [name]: value,
    };

    setForm(updatedForm);

    const newErrors = validate(updatedForm);
    setErrors(newErrors);
  }

  function handleSubmit(e) {
    e.preventDefault();

    const newErrors = validate(form);
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    console.log('Form submitted:', form);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} />
      {errors.name && <p>{errors.name}</p>}

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
      />
      {errors.email && <p>{errors.email}</p>}

      <button type="submit">Submit</button>

      <p>Name: {form.name}</p>
      <p>Email: {form.email}</p>
    </form>
  );
};

export default Counter;
