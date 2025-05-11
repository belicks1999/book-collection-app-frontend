import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import LoginPage from "./component/auth/Login";
import RegisterPage from "./component/auth/Register";
import Dashboard from "../pages/Dashboard";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BooksPage from "../pages/BooksPage";
import ProfileUpdatePage from "../pages/ProfileUpdatePage";
import ProtectedRoute from "../src/component/auth/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/profile" element={<ProfileUpdatePage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
