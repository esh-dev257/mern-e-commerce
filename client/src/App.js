import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./components/LoginPage";
import ProductList from "./components/ProductList";
import AdminDashboard from "./components/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";

const adminEmail = "eshitabhawsar@gmail.com";

function App() {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/current_user", { withCredentials: true })
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  if (user === undefined) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      {!user ? (
        // Non-logged in users
        <Routes>
          <Route path="*" element={<LoginPage />} />
        </Routes>
      ) : user.email === adminEmail ? (
        // Admin users
        <>
          <Header user={user} setUser={setUser} />
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/admin/*" element={<AdminDashboard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </>
      ) : (
        // Regular users
        <>
          <Header user={user} setUser={setUser} />
          <Routes>
            <Route path="/" element={<ProductList user={user} />} />
            <Route path="/shop" element={<ProductList user={user} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </>
      )}
    </Router>
  );
}

export default App;
