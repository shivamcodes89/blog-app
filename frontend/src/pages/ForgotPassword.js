import { useState } from 'react';
import { forgotPassword } from '../api';
import { useNavigate } from 'react-router-dom';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500&display=swap');

  @keyframes gradientShift {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50%       { transform: translateY(-20px) rotate(3deg); }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(30px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .fp-bg {
    min-height: 100vh;
    display: flex; align-items: center; justify-content: center;
    background: linear-gradient(-45deg, #1a1a2e, #16213e, #0f3460, #533483, #e94560);
    background-size: 400% 400%;
    animation: gradientShift 10s ease infinite;
    font-family: 'DM Sans', sans-serif;
    position: relative; overflow: hidden; padding: 20px;
  }

  .blob { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.25; animation: float 8s ease-in-out infinite; }
  .blob1 { width: 350px; height: 350px; background: #e94560; top: -80px; right: -80px; }
  .blob2 { width: 300px; height: 300px; background: #533483; bottom: -60px; left: -60px; animation-delay: 3s; }

  .card {
    background: rgba(255,255,255,0.06);
    backdrop-filter: blur(30px);
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 24px; padding: 48px 40px;
    width: 100%; max-width: 420px;
    position: relative; z-index: 10;
    animation: fadeUp 0.8s ease forwards;
    box-shadow: 0 25px 60px rgba(0,0,0,0.4);
  }

  .logo { text-align: center; margin-bottom: 32px; }
  .logo-icon { font-size: 48px; display: block; margin-bottom: 12px; animation: float 4s ease-in-out infinite; }
  .logo h1 { font-family: 'Playfair Display', serif; font-size: 28px; color: #fff; }
  .logo p { color: rgba(255,255,255,0.5); font-size: 14px; margin-top: 6px; font-weight: 300; line-height: 1.5; }

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
    border-color: rgba(233,69,96,0.6);
    background: rgba(255,255,255,0.12);
    box-shadow: 0 0 0 3px rgba(233,69,96,0.1);
  }

  .btn-send {
    width: 100%; padding: 15px;
    background: linear-gradient(135deg, #e94560, #533483);
    border: none; border-radius: 12px; color: #fff;
    font-size: 16px; font-weight: 500;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer; margin-top: 8px;
    transition: all 0.3s ease;
  }
  .btn-send:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(233,69,96,0.4); }

  .success-msg { background: rgba(0,255,150,0.1); border: 1px solid rgba(0,255,150,0.3); color: #00ff96; padding: 12px 16px; border-radius: 10px; font-size: 14px; margin-top: 16px; text-align: center; }
  .error-msg { background: rgba(255,80,80,0.15); border: 1px solid rgba(255,80,80,0.3); color: #ff8080; padding: 12px 16px; border-radius: 10px; font-size: 14px; margin-top: 16px; text-align: center; }

  .links { text-align: center; margin-top: 20px; color: rgba(255,255,255,0.4); font-size: 14px; }
  .link-btn { color: #e94560; cursor: pointer; font-weight: 500; background: none; border: none; font-family: 'DM Sans', sans-serif; font-size: 14px; transition: color 0.2s; }
  .link-btn:hover { color: #fff; }
`;

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleForgot = async () => {
    try {
      const res = await forgotPassword({ email });
      setMessage(res.data.message);
      setIsSuccess(true);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Something went wrong');
      setIsSuccess(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="fp-bg">
        <div className="blob blob1" />
        <div className="blob blob2" />
        <div className="card">
          <div className="logo">
            <span className="logo-icon">🔐</span>
            <h1>Forgot Password?</h1>
            <p>No worries! Enter your email and we'll send you a reset link.</p>
          </div>

          <div className="input-group">
            <label>Email Address</label>
            <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <button className="btn-send" onClick={handleForgot}>Send Reset Link 📧</button>

          {message && <div className={isSuccess ? 'success-msg' : 'error-msg'}>{message}</div>}

          <div className="links">
            Remember your password?{' '}
            <button className="link-btn" onClick={() => navigate('/')}>Sign in</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ForgotPassword;