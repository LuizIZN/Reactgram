import "./App.css";

import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

// pages
import Home from "./pages/home/Home";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";

// components
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { useAuth } from "./hooks/useAuth";
import Profile from "./pages/profile/Profile";
import EditProfile from "./pages/profile/EditProfile";
import Followers from "./pages/profile/Follow/Followers";
import Following from "./pages/profile/follow/Following";
import { useSelector } from "react-redux";

function App() {
  const { loading, auth } = useAuth();

  const { user, loading: loadingUser } = useSelector((state) => state.user)

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <div className="container">
          <Routes>
            <Route
              path="/"
              element={auth ? <Home /> : <Navigate to="/login" />}
            />
            <Route
              path="/profile/followers"
              element={auth ? <Followers user={user} /> : <Navigate to="/login" />}
            />
            <Route
              path="/profile/following"
              element={auth ? <Following user={user} /> : <Navigate to="/login" />}
            />
            <Route
              path="/profile"
              element={auth ? <EditProfile /> : <Navigate to="/login" />}
            />
            <Route
              path="/users/:id"
              element={auth ? <Profile /> : <Navigate to="/login" />}
            />
            <Route
              path="/register"
              element={!auth ? <Register /> : <Navigate to="/" />}
            />
            <Route
              path="/login"
              element={!auth ? <Login /> : <Navigate to="/" />}
            />
          </Routes>
        </div>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
