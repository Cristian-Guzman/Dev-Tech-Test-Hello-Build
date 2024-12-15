// src/context/AuthContext.jsx
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const signup = (userData) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Let's add some basic validation
    const userExists = users.some(user => user.email === userData.email);
    if (userExists) {
      throw new Error('User already exists');
    }

    // Add user to localStorage
    users.push(userData);
    localStorage.setItem('users', JSON.stringify(users));
    
    // For debugging
    console.log('Users in storage:', JSON.parse(localStorage.getItem('users')));
  };

  const login = (credentials) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => 
      u.email === credentials.email && 
      u.password === credentials.password
    );
    
    if (user) {
      setUser(user);
      // For debugging
      console.log('Logged in user:', user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      signup, 
      login, 
      logout, 
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);