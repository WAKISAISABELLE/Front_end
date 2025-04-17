
// import React, { createContext, useContext, useState, useEffect } from 'react';

// const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Check for token on app load and fetch user data
//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       // Simulate fetching user data from an API
//       // In a real app, you'd make an API call to verify the token and get user data
//       const fetchUser = async () => {
//         try {
//           // Mock API call
//           const mockUser = {
//             _id: '12345',
//             name: 'Test User',
//             role: 'sales_agent',
//             branch: 'main',
//           };
//           setUser(mockUser);
//         } catch (error) {
//           console.error('Failed to fetch user:', error);
//           localStorage.removeItem('token');
//         } finally {
//           setLoading(false);
//         }
//       };
//       fetchUser();
//     } else {
//       setLoading(false);
//     }
//   }, []);

//   const login = async (email, password) => {
//     try {
//       // Simulate API call to login
//       const response = await fetch('/api/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email, password }),
//       });

//       if (!response.ok) throw new Error('Login failed');
//       const data = await response.json();
//       localStorage.setItem('token', data.token);
//       setUser(data.user);
//     } catch (error) {
//       console.error('Login error:', error);
//       throw error;
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     setUser(null);
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   return useContext(AuthContext);
// }

// import React, { createContext, useState, useEffect, useContext } from 'react';
// import axios from 'axios';

// const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   const [token, setToken] = useState(localStorage.getItem('token') || null);
//   const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

//   useEffect(() => {
//     console.log('AuthContext - token:', token, 'user:', user);
//     if (token && user) {
//       localStorage.setItem('token', token);
//       localStorage.setItem('user', JSON.stringify(user));
//       axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//       console.log('AuthContext - set axios header:', `Bearer ${token}`);
//     } else {
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//       delete axios.defaults.headers.common['Authorization'];
//       console.log('AuthContext - cleared axios header');
//     }
//   }, [token, user]);

//   const login = async (username, password) => {
//     try {
//       console.log('Attempting login:', { username });
//       const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, {
//         username,
//         password
//       });
//       const { token, user } = response.data;
//       if (!user.role || !user.branch) {
//         throw new Error('Invalid user data from server');
//       }
//       setToken(token);
//       setUser(user);
//       console.log('Login success - token:', token, 'user:', user);
//       return true;
//     } catch (error) {
//       console.error('Login failed:', error.response?.data || error.message);
//       throw error;
//     }
//   };

//   const logout = () => {
//     setToken(null);
//     setUser(null);
//     localStorage.clear();
//     console.log('Logged out and cleared local storage');
//   };

//   return (
//     <AuthContext.Provider value={{ token, user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// }

// export default AuthContext;