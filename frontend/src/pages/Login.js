import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submit = async e => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/auth/login', { email: form.email, password: form.password });
      sessionStorage.setItem('token', data.token);
      sessionStorage.setItem('role', data.role);
      navigate('/dashboard');
    } catch {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-box">
        <h2>Sign In</h2>
        <form onSubmit={submit}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="you@example.com" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="••••••" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} required />
          </div>
          {error && <p className="error">{error}</p>}
          <button className="btn btn-primary btn-full" style={{ marginTop: '0.5rem' }}>
            Sign In
          </button>
        </form>
        <p>No account? <Link to="/signup">Sign up</Link></p>
      </div>
    </div>
  );
}
