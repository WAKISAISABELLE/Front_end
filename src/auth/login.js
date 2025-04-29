

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { useAuth}  from "./AuthContext"
import "./login.css"

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate();
  const { login } = useAuth()

  const onSubmit = async (data) => {
    const { email, password } = data

    setIsLoading(true)
    setError("")

    try {
      const user = await login(email, password)

      // Redirect based on user role
      if (user.role === "ceo") {
        navigate("/ceo-dashboard")
      } else if (user.role === "manager") {
        navigate(`/manager-dashboard/${user.branch.id}`)
      } else if (user.role === "sales_agent") {
        navigate(`/sales-agent/${user.branch.id}/dashboard`)
      } else {
        setError("Unknown user role")
      }
    } catch (error) {
      setError(error.message || "Invalid email or password")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-page-container">
      {/* Image Section with Text Card */}
      <div className="login-image-container">
        <div className="image-text-card">
          <h3>Welcome to GCDL</h3>
          <p>
            Join thousands of professionals who trust our platform for their daily operations. Experience seamless
            integration and powerful features.
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
            <p className="login-subheader">Continue with GCDL</p>
          </div>

          {error && <p className="error">{error}</p>}

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                placeholder="Enter your Email here"
                className="input-field"
                disabled={isLoading}
              />
              {errors.email && <span className="error">{errors.email.message}</span>}
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                placeholder="Enter your Password here"
                className="input-field"
                disabled={isLoading}
              />
              {errors.password && <span className="error">{errors.password.message}</span>}
            </div>

            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
