import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

const isIOS = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

const isAndroid = () => {
  return /Android/.test(navigator.userAgent);
};

const downloadIOSPass = async (userId: string, userType: string) => {
  try {
    const response = await fetch(`http://localhost:3000/passes/apple/hackathon.pkpass?userId=${userId}&userType=${userType}`, { 
      method: 'GET' 
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

const downloadAndroidPass = async (userId: string, userType: string) => {
  try {
    const response = await fetch(`http://localhost:3000/passes/android/hackathon.pkpass?userId=${userId}&userType=${userType}`, { 
      method: 'GET' 
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

  const {userId, userType} = useParams();

  useEffect(() => {
    const handleDeviceDetection = async () => {

        // return home if not mobile
      if (!isMobile()) {
        navigate('/');
        return;
      }

      try {
        if (isIOS()) {
          await downloadIOSPass(userId || '', userType || '');
        } else if (isAndroid()) {
          await downloadAndroidPass(userId || '', userType || '');
        } else {
          console.log('Unsupported mobile platform');
          navigate('/');
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
