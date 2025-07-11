import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import type { PassUserInformation } from "../components/types";

const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

const isIOS = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

const baseUrl = import.meta.env.VITE_DEV_API_URL || "https://api.hackthe6ix.com";

const downloadIOSPass = async (user: PassUserInformation) => {
  const { userId, userType, userName } = user;
  try {
    const response = await fetch(`${baseUrl}/passes/apple/hackathon.pkpass?userId=${userId}&userType=${userType}&userName=${userName}`, { 
      method: 'GET',
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch iOS pass');
    }
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(new Blob([blob], {
      type: 'application/vnd.apple.pkpass'
    }));
    
    window.location.href = url;
    
    setTimeout(() => window.URL.revokeObjectURL(url), 5000);
  } catch (error) {
    console.error('Failed to download iOS pass:', error);
    throw error;
  }
};

const downloadGooglePass = async (user: PassUserInformation) => {
  const { userId, userType, userName } = user;
  try {
    const response = await fetch(`${baseUrl}/passes/google/hackathon.pkpass?userId=${userId}&userType=${userType}&userName=${userName}`, { 
      method: 'GET',
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch Android pass');
    }
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'hackathon.pkpass';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => window.URL.revokeObjectURL(url), 5000);
  } catch (error) {
    console.error('Failed to download Android pass:', error);
    throw error;
  }
};

export default function DownloadPass() {
  const navigate = useNavigate();

  const {userId, userType, userName} = useParams();

  useEffect(() => {
    const handleDeviceDetection = async () => {

        // return home if not mobile
      if (!isMobile()) {
        navigate('/');
        return;
      }
      
      if (!userId) {
        navigate('/');
        console.error("No userId");
        return;
      }

      const user = {
        userId: userId,
        userType: userType || 'User',
        userName: userName || ''
      }

      try {
        if (isIOS()) {
          await downloadIOSPass(user);
        } else {
          await downloadGooglePass(user);
        }
      } catch (error) {
        console.error('Error downloading pass:', error);
        navigate('/');
      }
    };

    handleDeviceDetection();
  }, [navigate]);

  return null;
}
