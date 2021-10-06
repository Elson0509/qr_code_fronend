import React from "react";
import Routes  from "./routes";
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import {AuthProvider} from "./contexts/auth";

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
