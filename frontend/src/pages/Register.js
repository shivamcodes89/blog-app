import { useState } from 'react';
import { register } from '../api';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const res = await register({ email, password });
      setMessage(res.data.message);

      // Go to login page after success
      setTimeout(() => navigate('/'), 1500);

    } catch (err) {
      setMessage(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Register</h2>

      <input
        style={styles.input}
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        style={styles.input}
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button style={styles.button} onClick={handleRegister}>
        Register
      </button>

      {message && <p style={styles.message}>{message}</p>}

      <p>
        Already have an account?{' '}
        <span style={styles.link} onClick={() => navigate('/')}>
          Login
        </span>
      </p>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '400px',
    margin: '100px auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    padding: '24px',
    border: '1px solid #ddd',
    borderRadius: '8px'
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc'
  },
  button: {
    padding: '10px',
    fontSize: '16px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  message: {
    color: 'green'
  },
  link: {
    color: 'blue',
    cursor: 'pointer'
  }
};

export default Register;