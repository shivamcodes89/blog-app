import { useState } from 'react';
import { register } from '../api';
import { useNavigate } from 'react-router-dom';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes gradientShift {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    33%       { transform: translateY(-20px) rotate(3deg); }
    66%       { transform: translateY(-10px) rotate(-2deg); }
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(30px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 0.6; }
    50%       { transform: scale(1.1); opacity: 1; }
  }

  .login-bg {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(-45deg, #0f0c29, #302b63, #24243e, #1a1a2e, #16213e, #0f3460, #533483);
    background-size: 400% 400%;
    animation: gradientShift 10s ease infinite;
    font-family: 'DM Sans', sans-serif;
    position: relative;
    overflow: hidden;
    padding: 20px;
  }

  .blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.3;
    animation: float 8s ease-in-out infinite;
  }

  .blob1 { width: 400px; height: 400px; background: #ff6fd8; top: -100px; left: -100px; animation-delay: 0s; }
  .blob2 { width: 350px; height: 350px; background: #3813c2; bottom: -80px; right: -80px; animation-delay: 2s; }
  .blob3 { width: 250px; height: 250px; background: #00d2ff; top: 50%; left: 60%; animation-delay: 4s; animation: pulse 6s ease-in-out infinite; }

  .card {
    background: rgba(255,255,255,0.06);
    backdrop-filter: blur(30px);
    -webkit-backdrop-filter: blur(30px);
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 24px;
    padding: 48px 40px;
    width: 100%;
    max-width: 420px;
    position: relative;
    z-index: 10;
    animation: fadeUp 0.8s ease forwards;
    box-shadow: 0 25px 60px rgba(0,0,0,0.4);
  }

  .logo { text-align: center; margin-bottom: 32px; }
  .logo-icon { font-size: 40px; display: block; margin-bottom: 12px; }
  .logo h1 { font-family: 'Playfair Display', serif; font-size: 32px; color: #fff; letter-spacing: -0.5px; }
  .logo p { color: rgba(255,255,255,0.5); font-size: 14px; margin-top: 4px; font-weight: 300; }

  .input-group { margin-bottom: 18px; }
  .input-group label { display: block; color: rgba(255,255,255,0.7); font-size: 13px; font-weight: 500; margin-bottom: 8px; letter-spacing: 0.5px; text-transform: uppercase; }
  .input-group input {
    width: 100%; padding: 14px 18px;
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 12px; color: #fff;
    font-size: 15px; font-family: 'DM Sans', sans-serif;
    outline: none; transition: all 0.3s ease;
  }
  .input-group input::placeholder { color: rgba(255,255,255,0.3); }
  .input-group input:focus {
    border-color: rgba(255,111,216,0.6);
    background: rgba(255,255,255,0.12);
    box-shadow: 0 0 0 3px rgba(255,111,216,0.1);
  }

  .btn-register {
    width: 100%; padding: 15px;
    background: linear-gradient(135deg, #ff6fd8, #3813c2);
    border: none; border-radius: 12px; color: #fff;
    font-size: 16px; font-weight: 500;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer; margin-top: 8px;
    transition: all 0.3s ease; letter-spacing: 0.3px;
  }
  .btn-register:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(255,111,216,0.4); }
  .btn-register:active { transform: translateY(0); }

  .success-msg {
    background: rgba(0,255,150,0.1);
    border: 1px solid rgba(0,255,150,0.3);
    color: #00ff96; padding: 12px 16px;
    border-radius: 10px; font-size: 14px;
    margin-top: 16px; text-align: center;
  }

  .error-msg {
    background: rgba(255,80,80,0.15);
    border: 1px solid rgba(255,80,80,0.3);
    color: #ff8080; padding: 12px 16px;
    border-radius: 10px; font-size: 14px;
    margin-top: 16px; text-align: center;
  }

  .divider {
    text-align: center; color: rgba(255,255,255,0.3);
    font-size: 13px; margin: 20px 0; position: relative;
  }
  .divider::before, .divider::after {
    content: ''; position: absolute; top: 50%;
    width: 35%; height: 1px; background: rgba(255,255,255,0.1);
  }
  .divider::before { left: 0; }
  .divider::after { right: 0; }

  .links { text-align: center; color: rgba(255,255,255,0.4); font-size: 14px; }

  .link-btn {
    color: #ff6fd8; cursor: pointer; font-weight: 500;
    background: none; border: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px; transition: color 0.2s;
  }
  .link-btn:hover { color: #fff; }
`;

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const res = await register({ email, password });
      setMessage(res.data.message);
      setIsSuccess(true);
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setIsSuccess(false);
      setMessage(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="login-bg">
        <div className="blob blob1" />
        <div className="blob blob2" />
        <div className="blob blob3" />

        <div className="card">
          <div className="logo">
            <span className="logo-icon">🚀</span>
            <h1>BlogSpace</h1>
            <p>Create your account today!</p>
          </div>

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="btn-register" onClick={handleRegister}>
            Create Account →
          </button>

          {message && (
            <div className={isSuccess ? 'success-msg' : 'error-msg'}>
              {message}
            </div>
          )}

          <div className="divider">or</div>

          <div className="links">
            Already have an account?{' '}
            <button className="link-btn" onClick={() => navigate('/')}>
              Sign in
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;