// import React, { useState } from 'react';
// import { useNavigate,} from 'react-router-dom';
// import { useForm } from 'react-hook-form';
// import './login.css';
// import axios from 'axios';

// function Login() {
//   const { 
//     register, 
//     handleSubmit, 
//     formState: { errors } 
//   } = useForm();
  
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const onSubmit = async (data) => {
//     try {
//       const response = await axios.post('/api/login', data);
//       const { role } = response.data;
    
//       if (role === 'ceo') {
//         navigate('/ceo-dashboard');
//       } else if (role === 'manager') {
//           navigate('/manager-dashboard');
//       } else if (role === 'agent') {
//           navigate('/agent-dashboard');
//       } else {
//           setError('Invalid role received');
//       }
   
//     } catch (err) {
//       setError('Failed to connect to the server');
//     }
//   };
    
//   //   // Mock authentication logic
//   //   if (email === 'ceo@example.com' && password === 'ceo123') {
//   //     navigate('/ceo-dashboard');
//   //   } else if (email === 'manager@example.com' && password === 'manager123') {
//   //     navigate('/manager-dashboard');
//   //   } else if (email === 'agent@example.com' && password === 'agent123') {
//   //     navigate('/agent-dashboard');
//   //   } else {
//   //     setError('Invalid email or password');
//   //   }
//   // };

//   return (
//     <div className="login-page-container">
//       {/* Image Section with Text Card */}
//       <div className="login-image-container">
//         <div className="image-text-card">
//           <h3>Welcome to GCDL</h3>
//           <p>
//             Join thousands of professionals who trust our platform for their daily operations.
//             Experience seamless integration and powerful features.
//           </p>
//           <div className="card-features">
//             <div className="feature-item">
//               <span>✓</span> Secure authentication
//             </div>
//             <div className="feature-item">
//               <span>✓</span> Real-time analytics
//             </div>
//             <div className="feature-item">
//               <span>✓</span> 24/7 Support
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Login Form Section */}
//       <div className="login-container">
//         <div className="login-form">
//           <div className="login-header">
//             <h2>Welcome Back</h2>
//             <p className="login-subheader">
//               Continue with GCDL
//             </p>
//           </div>

//           {error && <p className="error">{error}</p>}
          
//           <form onSubmit={handleSubmit(onSubmit)}>
//             <div className="form-group">
//               <label>Email</label>
//               <input
//                 type="email"
//                 {...register('email', { 
//                   required: 'Email is required',
//                   pattern: {
//                     value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
//                     message: 'Invalid email address'
//                   }
//                 })}
//                 placeholder="Enter your Email here"
//                 className="input-field"
//               />
//               {errors.email && <span className="error">{errors.email.message}</span>}
//             </div>

//             <div className="form-group">
//               <label>Password</label>
//               <input
//                 type="password"
//                 {...register('password', { 
//                   required: 'Password is required',
//                   minLength: {
//                     value: 6,
//                     message: 'Password must be at least 6 characters'
//                   }
//                 })}
//                 placeholder="Enter your Password here"
//                 className="input-field"
//               />
//               {errors.password && <span className="error">{errors.password.message}</span>}
//             </div>

//             <button type="submit" className="login-button">Login</button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }
// export default Login;
import React, { useState } from 'react';

import { useAuth } from '../auth/AuthContext';
import { toast } from 'react-toastify';
import './login.css';

function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      setUsername('');
      setPassword('');
      setError('');
      toast.success('Logged in successfully!');
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Invalid username or password';
      setError(errorMsg);
      toast.error(errorMsg);
      console.log('Login error:', err.response?.data);
    }
  };

  console.log('Login.js - rendering');

  return (
    <div className="login-form">
      <h2>Login to GCDL System</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;