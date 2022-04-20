import React, { createContext, useState, useEffect, useContext } from 'react'
import api from '../services/api'

const AuthContext = createContext({ signed: false, user: {}, signIn: () => { }, signOut: () => { }, loading: true, errorLoginMessage: '', setErrorLoginMessage: () => { } },)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [errorLoginMessage, setErrorLoginMessage] = useState('')

  useEffect(() => {
    const storagedUser = localStorage.getItem('user')
    const storagedToken = localStorage.getItem('token')
    if (storagedUser && storagedToken) {
      setUser(JSON.parse(storagedUser))
      api.defaults.headers.Authorization = `Bearer ${storagedToken}`
    }
    setLoading(false)

  }, [])

  const signIn = async (email, password) => {
    api.post('/user/login', { email, password })
      .then(res => {
        const user = {
          name: res.data.name,
          id: res.data.userId,
          user_kind: res.data.user_kind,
          email: res.data.username,
          condo_id: res.data.condo_id,
          condo: res.data.condo,
          bloco_id: res.data.bloco_id,
          number: res.data.number,
        }
        api.defaults.headers.Authorization = `Bearer ${res.data.token}`
        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('token', res.data.token)
        setUser(user)
      })
      .catch(err => {
        setErrorLoginMessage(err.response?.data?.message || 'Erro no login. Tente de novo.')
      })
  }

  const signOut = _ => {
    setUser(null)
    localStorage.clear()
  }

  return (
    <AuthContext.Provider value={{
      signed: !!user,
      user: user,
      loading,
      signIn,
      signOut,
      errorLoginMessage,
      setErrorLoginMessage,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = _ => {
  const context = useContext(AuthContext)
  return context
}