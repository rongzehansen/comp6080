import AuthContext from '../../context/AuthContext';
import React, { useState, useContext } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

export const LoginComponent = ({ closeModal }) => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const res = await login(email, password);
    console.log(res);
    if (res) setError(res);
    else closeModal();
    console.log('Submitting:', { email, password });
  };

  return (
    <form onSubmit={handleSubmit} noValidate autoComplete="off" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <TextField
        sx={{ marginTop: '10px' }}
        error={Boolean(error)}
        required
        id="email"
        label="Email"
        type="email"
        value={email}
        helperText={error}
        onChange={handleEmailChange}
    />
    <TextField
        sx={{ marginTop: '10px' }}
        error={Boolean(error)}
        required
        id="password"
        label="Password"
        type="password"
        value={password}
        helperText={error}
        onChange={handlePasswordChange}
    />
    <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{ marginTop: '20px' }}
    >
        Submit
    </Button>
    </form>
  );
}
