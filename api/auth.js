// api/auth.js
export default function handler(req, res) {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI || 'https://spotify-prediction-rosy.vercel.app/callback';
  
  if (!clientId) {
    return res.status(500).send('SPOTIFY_CLIENT_ID not configured');
  }
  
  const scopes = [
    'user-read-recently-played',
    'user-top-read', 
    'user-library-read',
    'user-read-playback-state'
  ].join(' ');
  
  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectUri,
    scope: scopes,
    show_dialog: 'false'
  });
  
  const authUrl = `https://accounts.spotify.com/authorize?${params}`;
  
  res.redirect(302, authUrl);
}