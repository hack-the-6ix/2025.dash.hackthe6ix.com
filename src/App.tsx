import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home/Home";
import DownloadPass from "./pages/DownloadPass/DownloadPass";
import { AuthProvider } from "./contexts/AuthContext";
import { useEffect, useState, useRef, useCallback } from "react";
import { checkAuth, type AuthResult } from "./auth/middleware";
import { useAuth } from "./contexts/AuthContext";
import Callback from "./pages/Callback/Callback";
import Modal from "./components/Modal/Modal";
import Text from "./components/Text/Text";
import Button from "./components/Button/Button";
import Schedule from "./pages/Schedule/Schedule";
import DiscordCallback from "./pages/Discord/Callback";
import DiscordLink from "./pages/Discord/Link";

function AppContent() {
  const { setProfile } = useAuth();
  const [authError, setAuthError] = useState<AuthResult["error"] | null>(null);
  const location = useLocation();
  const previousLocation = useRef(location.pathname);

  const performAuthentication = useCallback(async () => {
    const result = await checkAuth();

    if (result.error) {
      setAuthError(result.error);
      setProfile(null);
    } else {
      setProfile(result.profile);
      setAuthError(null);
    }
  }, [setProfile]);

  // Handle navigation from callback to home page
  useEffect(() => {
    // If we just navigated from callback to home we have new tokens, so try again
    // They're in localStorage, so this isn't handled automatically by React
    if (previousLocation.current === "/callback" && location.pathname === "/") {
      performAuthentication();
    }

    previousLocation.current = location.pathname;
  }, [location.pathname, performAuthentication]);

  useEffect(() => {
    // Don't run auth check if we're on the callback page or schedule page - let those components handle it
    if (
      location.pathname === "/callback" ||
      location.pathname === "/schedule"
    ) {
      return;
    }

    performAuthentication();
  }, [location.pathname, performAuthentication]);

  const handleRetry = () => {
    // Clear any error state and redirect tracking, then reload
    setAuthError(null);
    sessionStorage.removeItem("auth_redirects");
    window.location.reload();
  };

  const handleClearData = () => {
    // Clear all auth data and redirect tracking, then reload
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    sessionStorage.removeItem("auth_redirects");
    setAuthError(null);
    window.location.reload();
  };

  return (
    <>
      <Routes>
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/" element={<Home />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/download-pass" element={<DownloadPass />} />
        <Route path="/discord">
          <Route path="callback" element={<DiscordCallback />} />
          <Route path="link" element={<DiscordLink />} />
        </Route>
      </Routes>

      <Modal open={!!authError} onClose={() => setAuthError(null)}>
        <Text
          textType="heading-md"
          className="font-bold text-[32px] !text-[#EE721D] mb-4"
        >
          {authError?.type === "redirect_loop"
            ? "Authentication Error"
            : "Connection Error"}
        </Text>
        <Text
          textType="paragraph-lg"
          textColor="primary"
          className="mb-6 font-medium leading-snug"
        >
          {authError?.message || "Something went wrong with authentication."}
        </Text>
        <div className="flex flex-col gap-4 justify-center mt-2">
          <Button onClick={handleRetry}>Try Again</Button>
          {authError?.type === "redirect_loop" && (
            <Button variant="back" onClick={handleClearData}>
              Clear Data & Retry
            </Button>
          )}
        </div>
      </Modal>
    </>
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
