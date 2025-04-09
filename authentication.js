  // Replace with your actual client IDs
  const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID';
  const FACEBOOK_APP_ID = 'YOUR_FACEBOOK_APP_ID';

  // === GOOGLE SIGN-IN ===
  (function loadGoogle() {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.onload = () => {
      if (typeof google !== 'undefined') {
        google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
        });
        google.accounts.id.renderButton(
          document.querySelector('.media-options2'),
          { theme: 'outline', size: 'large' }
        );
      } else {
        console.error('Google SDK not loaded properly');
      }
    };
    script.onerror = () => console.error('Failed to load Google SDK');
    document.body.appendChild(script);
  })();

  async function handleGoogleResponse(response) {
    try {
      const res = await fetch('http://localhost:5000/api/v1/users/auth/google/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: response.credential }),
      });
      const data = await res.json();
      localStorage.setItem('user', JSON.stringify(data.user));
      console.log('Google login success:', data);
    } catch (err) {
      console.error('Google login error:', err);
    }
  }

  // === FACEBOOK SIGN-IN ===
  (function loadFacebook() {
    const script = document.createElement('script');
    script.src = 'https://connect.facebook.net/en_US/sdk.js';
    script.async = true;
    script.onload = () => {
      if (typeof FB !== 'undefined') {
        FB.init({
          appId: FACEBOOK_APP_ID,
          cookie: true,
          xfbml: true,
          version: 'v17.0',
        });
      } else {
        console.error('Facebook SDK failed to load');
      }
    };
    script.onerror = () => console.error('Failed to load Facebook SDK');
    document.body.appendChild(script);
  })();

  document.querySelector('fbLoginLink').onclick = function () {
    if (typeof FB === 'undefined') {
      console.error('Facebook SDK not initialized');
      return;
    }

    FB.login(async function (response) {
      if (response.authResponse) {
        try {
          const fbToken = response.authResponse.accessToken;
          const res = await fetch('/auth/facebook', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: fbToken }), //Facebook token
          });
          const data = await res.json();
          localStorage.setItem('user', JSON.stringify(data.user));
          console.log('Facebook login success:', data);
        } catch (err) {
          console.error('Facebook login error:', err);
        }
      } else {
        console.warn('Facebook login canceled or not authorized');
      }
    }, { scope: 'email' });
  };

  // === TWITTER SIGN-IN ===
  function handleTwitterMessage(event) {
    if (event.origin !== window.location.origin) return;
    if (event.data.type === 'twitter-login-success') {
      localStorage.setItem('user', JSON.stringify(event.data.user));
      console.log('Twitter login success:', event.data.user);
      window.removeEventListener('message', handleTwitterMessage);
    }
  }

  document.getElementById('twitterLoginBtn').onclick = function () {
    const width = 600;
    const height = 700;
    const left = (screen.width / 2) - (width / 2);
    const top = (screen.height / 2) - (height / 2);
    window.open(
      '/auth/twitter',
      'Twitter Login',
      `width=${width},height=${height},top=${top},left=${left}`
    );

    window.addEventListener('message', handleTwitterMessage);
  };

