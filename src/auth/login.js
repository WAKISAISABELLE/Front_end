import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import './login.css';

export default function Login() {
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm();
  
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onSubmit = (data) => {
    const { email, password } = data;
    
    // Mock authentication logic
    if (email === 'ceo@example.com' && password === 'ceo123') {
      navigate('/ceo-dashboard');
    } else if (email === 'manager@example.com' && password === 'manager123') {
      navigate('/manager-dashboard');
    } else if (email === 'agent@example.com' && password === 'agent123') {
      navigate('/agent-dashboard');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="login-page-container">
      {/* Image Section with Text Card */}
      <div className="login-image-container">
        <div className="image-text-card">
          <h3>Welcome to GCDL</h3>
          <p>
            Join thousands of professionals who trust our platform for their daily operations.
            Experience seamless integration and powerful features.
          </p>
          <div className="card-features">
            <div className="feature-item">
              <span>✓</span> Secure authentication
            </div>
            <div className="feature-item">
              <span>✓</span> Real-time analytics
            </div>
            <div className="feature-item">
              <span>✓</span> 24/7 Support
            </div>
          </div>
        </div>
      </div>

      {/* Login Form Section */}
      <div className="login-container">
        <div className="login-form">
          <div className="login-header">
            <h2>Welcome Back</h2>
            <p className="login-subheader">
              Continue with GCDL
            </p>
          </div>

          {error && <p className="error">{error}</p>}
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                placeholder="Enter your Email here"
                className="input-field"
              />
              {errors.email && <span className="error">{errors.email.message}</span>}
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                {...register('password', { 
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
                placeholder="Enter your Password here"
                className="input-field"
              />
              {errors.password && <span className="error">{errors.password.message}</span>}
            </div>

            <button type="submit" className="login-button">Login</button>
            
            <div className="social-login">
              <p>Or continue with</p>
              <div className="social-buttons">
                <button type="button" className="social-button google">
                  Google Account
                </button>
              </div>
            </div>

            <div className="register-link">
              Don't have an account? <Link to="/register">Register</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}