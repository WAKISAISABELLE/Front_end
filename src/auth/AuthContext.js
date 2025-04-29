

import { createContext, useState, useEffect, useContext } from "react"
import axios from "axios"

// Create the context
const AuthContext = createContext(null)

// AuthProvider component that wraps your app and makes auth available
export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || null)
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Set up axios defaults
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`

      // Verify token is still valid
      const verifyToken = async () => {
        try {
          // We'll use the user's own data endpoint to verify the token
          if (user && user.id) {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/users/${user.id}`)
            setUser(response.data)
          }
          setLoading(false)
        } catch (error) {
          console.error("Token verification failed:", error)
          logout()
          setLoading(false)
        }
      }

      verifyToken()
    } else {
      delete axios.defaults.headers.common["Authorization"]
      setLoading(false)
    }
  }, [token, user])

  // Save token and user to localStorage when they change
  useEffect(() => {
    if (token && user) {
      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(user))
    } else {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
    }
  }, [token, user])

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
        email,
        password,
      })

      const { token: newToken, user: userData } = response.data

      setToken(newToken)
      setUser(userData)

      return userData
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message)
      throw error
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  }

  // The value that will be available to consumers of this context
  const value = {
    token,
    user,
    login,
    logout,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export default AuthContext
