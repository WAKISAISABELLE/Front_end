
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