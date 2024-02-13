import AuthContext from '../../context/AuthContext';
import React, { useState, useContext } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/material';

export const RegisterComponent = ({ closeModal }) => {
  const { register } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState(null);
  const [passwordFormatError, setPasswordFormatError] = useState(null);
  const [nameError, setNameError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [registerError, setRegisterError] = useState(null);
  const handleEmailChange = (event) => {
    setEmail(event.target.value.trim());
  };

  const handleNameChange = (event) => {
    setName(event.target.value.trim());
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value.trim());
  };
  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value.trim());
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    let flag = false;
    if (password !== confirmPassword) {
      setPasswordError('Password does not match.');
      flag = true;
    } else setPasswordError(null);
    if (password.length < 6) {
      setPasswordFormatError('Password length should longer than 6');
      flag = true;
    } else setPasswordFormatError(null);
    if (name.length === 0) {
      setNameError('Invalid name.');
      flag = true;
    } else setNameError(null);

    if (email.length === 0) {
      setEmailError('Email cannot be empty.');
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Invalid email format.');
    } else {
      setEmailError(null);
    }

    if (!flag) {
      const temp = await register(email, password, name);
      if (temp) setRegisterError(temp);
      else closeModal();
      console.log('Submitting:', { email, name, password });
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate autoComplete="off" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <TextField
        error = {emailError}
        sx={{ marginTop: '10px' }}
        required
        id="email"
        label="Email"
        type="email"
        value={email}
        helperText={emailError}
        onChange={handleEmailChange}
    />
    <TextField
        error = {nameError}
        sx={{ marginTop: '10px' }}
        required
        id="name"
        label="Name"
        type="text"
        value={name}
        helperText={nameError}
        onChange={handleNameChange}
    />
    <TextField
        error = {passwordFormatError}
        sx={{ marginTop: '10px' }}
        required
        id="password"
        label="Password"
        type="password"
        value={password}
        helperText={passwordFormatError}
        onChange={handlePasswordChange}
    />
    <TextField
        error={ passwordError }
        sx={{ marginTop: '10px' }}
        required
        id="confirmPassword"
        label="Confirm password"
        type="password"
        value={confirmPassword}
        helperText={passwordError}
        onChange={handleConfirmPasswordChange}
    />
    <Box sx={{ color: 'red' }}>{registerError}</Box>
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
