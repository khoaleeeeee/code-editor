import Editor from "./pages/editor";
import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Assistant from "./pages/assistant";
import Example from "./text to speech";
import LoginForm from "./pages/login";
import SignupForm from "./pages/signup";
import { onAuthStateChangeCallback } from "./auth.js";
import Home from "./pages/home";
import MenuBar from "./components/menu-bar";

function App() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChangeCallback((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="App">
      <MenuBar />
      <div className="page-container">
        <Routes>
          <Route path="/" element={<Home />} user={user} exact></Route>
          <Route path="assistant" element={<Assistant />} exact></Route>
          <Route path="code-editor" element={<Editor />} exact></Route>
          <Route path="example" element={<Example />} exact></Route>
          <Route path="login" element={<LoginForm />} exact></Route>
          <Route path="signup" element={<SignupForm />} exact></Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
