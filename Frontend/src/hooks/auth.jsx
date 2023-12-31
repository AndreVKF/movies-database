import { createContext, useContext, useEffect, useState } from "react"

import { ROUTES } from "../utils/constants"
import { api } from "../services/api"

const AuthContext = createContext({})

function AuthProvider({ children }) {
  const [userData, setUserData] = useState(null)

  const signUp = async ({ email, password }) => {
    try {
      const response = await api.post("/authenticate", {
        email,
        password,
      })
      const { user, token } = response.data
      user.avatar = user.avatar
        ? `${api.defaults.baseURL}/files/${user.avatar}`
        : "/images/default_avatar.png"

      localStorage.setItem("@lupetmovies:user", JSON.stringify(user))
      localStorage.setItem("@lupetmovies:token", token)

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`

      setUserData(user)
    } catch (err) {
      if (err.response) {
        alert(err.response.data.message)
      } else {
        alert("Não foi possível logar!!")
      }
    }
  }

  const signOut = () => {
    localStorage.removeItem("@lupetmovies:user")
    localStorage.removeItem("@lupetmovies:token")

    try {
      delete api.defaults.headers.common["Authorization"]
    } finally {
      setUserData(null)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("@lupetmovies:token")
    const user = localStorage.getItem("@lupetmovies:user")

    api.defaults.headers.common["Authorization"] = `Bearer ${token}`
    if (token && user) {
      // validate token
      api
        .get(ROUTES.VALIDATE_TOKEN)
        .then(() => {
          setUserData({ ...JSON.parse(user) })
        })
        .catch((err) => {
          localStorage.removeItem("@lupetmovies:user")
          localStorage.removeItem("@lupetmovies:token")

          setUserData(null)
          if (err.response) {
            if (err.response.status !== 401) {
              alert("Erro de autenticação!!")
            }
          }
        })
    }
  }, [])

  return (
    <AuthContext.Provider value={{ userData, setUserData, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

function useAuth() {
  const context = useContext(AuthContext)

  return context
}

export { AuthProvider, useAuth }
