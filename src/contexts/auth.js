import React, { createContext, useState, useEffect, useContext } from 'react'
import * as auth from '../services/auth'
import api from '../services/api'

const AuthContext = createContext({signed : false, user: {}, signIn: ()=>{}, signOut: ()=>{}, loading: true })

export const AuthProvider = ({children})=> {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        const storagedUser = localStorage.getItem('user')
        const storagedToken = localStorage.getItem('token')
        if(storagedUser && storagedToken){
            setUser(JSON.parse(storagedUser))
            api.defaults.headers.Authorization = `Bearer ${storagedToken}`
        }
        setLoading(false)

    }, [])

    const signIn = async _ => {
        auth.signIn().then(res=> {
            setUser(res.user)
            api.defaults.headers.Authorization = `Bearer ${res.token}`
            localStorage.setItem('user', JSON.stringify(res.user))
            localStorage.setItem('token', JSON.stringify(res.token))
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
            signOut
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = _ => {
    const context = useContext(AuthContext)
    return context
}