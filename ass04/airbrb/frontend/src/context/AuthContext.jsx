import React, { createContext, useState } from 'react';
import { postRequest } from '../utils/request';
const AuthContext = createContext(null);

export default AuthContext;

export function AuthProvider ({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = sessionStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const login = async (userId, password) => {
    let newUser = null;
    const handleLogin = async () => {
      try {
        const response = await postRequest('/user/auth/login', { email: userId, password });
        console.log(response.data.token);
        newUser = { token: response.data.token, userId };
        sessionStorage.setItem('user', JSON.stringify(newUser));
      } catch (error) {
        return error.response.data.error;
      }
    };
    const temp = await handleLogin();
    console.log(temp);
    if (temp) return temp;
    if (newUser) setUser(newUser);
  };

  const register = async (userId, password, name) => {
    let newUser = null;
    const handleRegistration = async () => {
      try {
        const response = await postRequest('/user/auth/register', { email: userId, password, name });
        console.log(response.data.token);
        newUser = { token: response.data.token, userId };
        sessionStorage.setItem('user', JSON.stringify(newUser));
      } catch (error) {
        return error.response.data.error;
      }
    };
    const temp = await handleRegistration();
    if (temp) return temp;
    setUser(newUser);
  };

  const logout = async () => {
    sessionStorage.removeItem('user');
    const handleLogoutUser = async (data) => {
      try {
        await postRequest('/user/auth/logout', {}, data);
      } catch (error) {
        console.error(error);
      }
    };
    await handleLogoutUser(user.token);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
    {children}
    </AuthContext.Provider>);
}
