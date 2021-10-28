import React from "react"
import Routes  from "./routes"
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import {AuthProvider} from "./contexts/auth"
import 'react-toastify/dist/ReactToastify.css'
import './index.css'

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes/>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
