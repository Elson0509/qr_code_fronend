import React from "react"
import Routes  from "./routes"
import { BrowserRouter} from 'react-router-dom'
import {AuthProvider} from "./contexts/auth"
import 'react-toastify/dist/ReactToastify.css'
import "react-responsive-carousel/lib/styles/carousel.min.css";
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
