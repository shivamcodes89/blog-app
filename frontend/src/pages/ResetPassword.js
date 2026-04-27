import { useState } from 'react';
import { resetPassword } from '../api';
import { useNavigate, useParams } from 'react-router-dom';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500&display=swap');

  @keyframes gradientShift {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-15px); }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(30px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .rp-bg {
    min-height: 100vh;
    display: flex; align-items: center; justify-content: center;
    background: linear-gradient(-45deg, #0f2027, #203a43, #2c5364, #1a1a2e, #00b4db);
    background-size: 400% 400%;
    animation: gradientShift 10s ease infinite;
    font-family: 'DM Sans', sans-serif;
    position: relative; overflow: hidden; padding: 20px;
  }

  .blob { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.25; animation: float 8s ease-in-out infinite; }
  .blob1 { width: 350px; height: 350px; background: #00b4db; top: -80px; left: -80px; }
  .blob2 { width: 300px; height: 300px; background: #0083b0; bottom: -60px; right: -60px; animation-delay: 3s; }

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
  .logo p { color: rgba(255,255,255,0.5); font-size: 14px; margin-top: 6px; font-weight: 300; }

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
    border-color: rgba(0,180,219,0.6);
    background: rgba(255,255,255,0.12);
    box-shadow: 0 0 0 3px rgba(0,180,219,0.1);
  }

  .btn-reset {
    width: 100%; padding: 15px;
    background: linear-gradient(135deg, #00b4db, #0083b0);
    border: none; border-radius: 12px; color: #fff;
    font-size: 16px; font-weight: 500;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer; margin-top: 8px;
    transition: all 0.3s ease;
  }
  .btn-reset:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(0,180,219,0.4); }

  .success-msg { background: rgba(0,255,150,0.1); border: 1px solid rgba(0,255,150,0.3); color: #00ff96; padding: 12px 16px; border-radius: 10px; font-size: 14px; margin-top: 16px; text-align: center; }
  .error-msg { background: rgba(255,80,80,0.15); border: 1px solid rgba(255,80,80,0.3); color: #ff8080; padding: 12px 16px; border-radius: 10px; font-size: 14px; margin-top: 16px; text-align: center; }
`;

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  const { token } = useParams();

  const handleReset = async () => {
    try {
      const res = await resetPassword(token, { password });
      setMessage(res.data.message);
      setIsSuccess(true);
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Token expired or invalid');
      setIsSuccess(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="rp-bg">
        <div className="blob blob1" />
        <div className="blob blob2" />
        <div className="card">
          <div className="logo">
            <span className="logo-icon">🔑</span>
            <h1>Reset Password</h1>
            <p>Enter your new password below</p>
          </div>

          <div className="input-group">
            <label>New Password</label>
            <input type="password" placeholder="Enter new password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <button className="btn-reset" onClick={handleReset}>Reset Password ✓</button>

          {message && <div className={isSuccess ? 'success-msg' : 'error-msg'}>{message}</div>}
        </div>
      </div>
    </>
  );
}

export default ResetPassword;