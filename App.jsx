import { useState, useEffect, createContext, useContext } from "react";
import Landing from "./pages/Landing";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import GroupPage from "./pages/GroupPage";
import Library from "./pages/Library";
import Profile from "./pages/Profile";
import MapPage from "./pages/MapPage";
import "./styles.css";

export const AppContext = createContext(null);

export default function App() {
  const [page, setPage] = useState("landing");
  const [user, setUser] = useState(null);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [currentProfile, setCurrentProfile] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("nc_user");
    if (saved) {
      setUser(JSON.parse(saved));
      setPage("home");
    }
  }, []);

  const navigate = (pg, data = null) => {
    if (pg === "group") setCurrentGroup(data);
    if (pg === "profile") setCurrentProfile(data);
    setPage(pg);
    window.scrollTo(0, 0);
  };

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("nc_user", JSON.stringify(userData));
    setPage("home");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("nc_user");
    setPage("landing");
  };

  const showNotif = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <AppContext.Provider value={{ user, navigate, login, logout, showNotif }}>
      <div className="app-root">
        {notification && (
          <div className={`global-notif notif-${notification.type}`}>
            {notification.msg}
          </div>
        )}
        {page === "landing" && <Landing />}
        {page === "register" && <Register />}
        {page === "login" && <Login />}
        {page === "home" && <Home />}
        {page === "group" && <GroupPage group={currentGroup} />}
        {page === "library" && <Library />}
        {page === "profile" && <Profile profileUser={currentProfile} />}
        {page === "map" && <MapPage />}
      </div>
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
