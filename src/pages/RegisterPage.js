import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
        username,
        password,
      });
      alert('Registrering lyckades! Logga in.');
      navigate('/');
    } catch (err) {
      alert('Registrering misslyckades');
    }
  };

  return (
    <div className="register-page">
      <h2>Registrera</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Användarnamn"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Lösenord"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Skapa konto</button>
      </form>
    </div>
  );
};

export default RegisterPage;
