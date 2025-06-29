import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { AuthProvider } from "./contexts/AuthContext";
import { useEffect } from "react";
import { checkAuth } from "./auth/middleware";
import { useAuth } from "./contexts/AuthContext";
import Callback from "./pages/Callback";

function AppContent() {
  const { setProfile } = useAuth();

  useEffect(() => {
    const authenticate = async () => {
      const profile = await checkAuth();
      setProfile(profile);
      console.log(profile);
    };
    authenticate();
  }, [setProfile]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/callback" element={<Callback />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
