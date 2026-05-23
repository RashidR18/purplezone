import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/auth` : 'http://localhost:5000/api/auth';

const EyeOpen = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeClosed = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const RegisterLogin = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [showPwd, setShowPwd]  = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [msg, setMsg] = useState({ text: '', type: '' }); // type: 'error' | 'success'
  const [loading, setLoading]  = useState(false);
  const navigate = useNavigate();

  const switchTab = (loginMode) => {
    setIsLogin(loginMode);
    setMsg({ text: '', type: '' });
    setShowPwd(false);
    setFormData({ username: '', password: '' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMsg({ text: '', type: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ text: '', type: '' });
    setLoading(true);

    try {
      if (!isLogin) {
        // REGISTER
        await axios.post(`${API_URL}/register`, {
          username: formData.username,
          email:    formData.username,
          password: formData.password
        });
        setMsg({ text: 'Account created! Please login.', type: 'success' });
        setFormData({ username: '', password: '' });
        setIsLogin(true);
      } else {
        // LOGIN
        const res = await axios.post(`${API_URL}/login`, {
          username: formData.username,
          password: formData.password
        });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify({ fullName: res.data.fullName }));
        navigate('/test');
      }
    } catch (err) {
      setMsg({ text: err.response?.data?.message || 'Something went wrong.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Split background */}
      <div className="auth-bg">
        <div className="auth-bg-left" />
        <div className="auth-bg-right" />
      </div>

      {/* Floating white card */}
      <div className="auth-card-wrap">
        <div className="auth-card">

          {/* REGISTER | LOGIN tabs */}
          <div className="auth-tabs">
            <button
              className={`auth-tab-btn ${!isLogin ? 'active' : ''}`}
              onClick={() => switchTab(false)}
            >
              REGISTER
            </button>
            <span className="tab-pipe">|</span>
            <button
              className={`auth-tab-btn ${isLogin ? 'active' : ''}`}
              onClick={() => switchTab(true)}
            >
              LOGIN
            </button>
          </div>

          {/* Input fields */}
          <form onSubmit={handleSubmit} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div className="auth-fields">
              {/* Username */}
              <div className="auth-input-wrap">
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  autoComplete="username"
                />
              </div>

              {/* Password */}
              <div className="auth-input-wrap">
                <input
                  type={showPwd ? 'text' : 'password'}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                />
                <button type="button" className="auth-eye" onClick={() => setShowPwd(p => !p)}>
                  {showPwd ? <EyeOpen /> : <EyeClosed />}
                </button>
              </div>

              {/* Message (error or success) */}
              {msg.text && (
                <div className={msg.type === 'error' ? 'auth-msg-error' : 'auth-msg-success'}
                     style={{ marginTop: '12px' }}>
                  {msg.text}
                </div>
              )}
            </div>

            {/* Submit */}
            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? (isLogin ? 'Logging in...' : 'Creating...') : 'Submit'}
            </button>
          </form>

        </div>
      </div>
    </>
  );
};

export default RegisterLogin;
