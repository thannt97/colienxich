import React, { useState, useEffect } from 'react';
import './InviteLink.css';

interface InviteLinkProps {
  onClose?: () => void;
}

export const InviteLink: React.FC<InviteLinkProps> = ({ onClose }) => {
  const [customUrl, setCustomUrl] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  // Get LAN IP address for local network play
  const getLocalIP = async (): Promise<string> => {
    try {
      // Use WebRTC to get local IP
      const pc = new RTCPeerConnection({ iceServers: [] });
      pc.createDataChannel('');
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      return new Promise((resolve) => {
        pc.onicecandidate = (event) => {
          if (event.candidate) {
            const match = event.candidate.candidate.match(/(\d+\.\d+\.\d+\.\d+)/);
            if (match) {
              pc.close();
              resolve(match[1]);
            }
          }
        };
        setTimeout(() => {
          pc.close();
          resolve('localhost');
        }, 1000);
      });
    } catch {
      return 'localhost';
    }
  };

  const getInviteLink = async () => {
    // If user entered custom URL, use it
    if (customUrl) {
      const serverUrl = getServerUrl();
      return `${customUrl}?server=${encodeURIComponent(serverUrl)}`;
    }

    const currentUrl = new URL(window.location.href);
    const serverUrl = getServerUrl();

    // If current URL is localhost, try to use LAN IP
    if (currentUrl.hostname === 'localhost' || currentUrl.hostname === '127.0.0.1') {
      const localIP = await getLocalIP();
      if (localIP !== 'localhost') {
        return `${currentUrl.protocol}//${localIP}:${currentUrl.port}${currentUrl.pathname}?server=${encodeURIComponent(serverUrl)}`;
      }
    }

    // Otherwise use current URL
    const baseUrl = currentUrl.origin + currentUrl.pathname;
    return `${baseUrl}?server=${encodeURIComponent(serverUrl)}`;
  };

  const getServerUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const serverParam = urlParams.get('server');
    if (serverParam) return serverParam;

    const localStorageUrl = localStorage.getItem('viteSocketUrl');
    if (localStorageUrl) return localStorageUrl;

    return 'http://localhost:3001';
  };

  const copyToClipboard = async () => {
    const link = await getInviteLink();
    navigator.clipboard.writeText(link).then(() => {
      alert('Link copied! Send it to your friend.');
    });
  };

  const [inviteLink, setInviteLink] = useState('');

  useEffect(() => {
    getInviteLink().then(setInviteLink);
  }, [customUrl]);

  const handleCustomUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    getInviteLink().then(setInviteLink);
  };

  return (
    <div className="invite-link-overlay" onClick={onClose}>
      <div className="invite-link-container" onClick={(e) => e.stopPropagation()}>
        <button className="invite-link-close" onClick={onClose}>
          ✕
        </button>

        <h2 className="invite-link-title">🔗 Invite Friend</h2>

        <p className="invite-link-description">
          Send this link to your friend to play together:
        </p>

        <div className="invite-link-box">
          <input
            type="text"
            readOnly
            value={inviteLink}
            className="invite-link-input"
          />
          <button className="invite-link-copy" onClick={copyToClipboard}>
            Copy
          </button>
        </div>

        {!showCustomInput ? (
          <button
            className="invite-link-custom"
            onClick={() => setShowCustomInput(true)}
          >
            Use custom URL (for remote play)
          </button>
        ) : (
          <form className="invite-link-custom-form" onSubmit={handleCustomUrlSubmit}>
            <input
              type="text"
              placeholder="https://your-ngrok-url.ngrok-free.app"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              className="invite-link-custom-input"
            />
            <button type="submit" className="invite-link-custom-submit">
              Generate
            </button>
          </form>
        )}

        <p className="invite-link-hint">
          💡 <strong>Same network:</strong> Link works automatically<br/>
          🌐 <strong>Remote play:</strong> Click "Use custom URL" and enter your ngrok/Vercel URL
        </p>
      </div>
    </div>
  );
};
