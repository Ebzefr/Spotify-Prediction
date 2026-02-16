from http.server import BaseHTTPRequestHandler
from urllib.parse import urlencode
import os

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        """Redirect to Spotify OAuth"""
        
        client_id = os.getenv('SPOTIFY_CLIENT_ID')
        redirect_uri = os.getenv('SPOTIFY_REDIRECT_URI', 'https://spotify-prediction-rosy.vercel.app/callback')
        
        if not client_id:
            self.send_response(500)
            self.send_header('Content-Type', 'text/html')
            self.end_headers()
            self.wfile.write(b'<h1>Error: SPOTIFY_CLIENT_ID not configured</h1>')
            return
        
        scopes = [
            'user-read-recently-played',
            'user-top-read',
            'user-library-read',
            'user-read-playback-state'
        ]
        
        params = {
            'client_id': client_id,
            'response_type': 'code',
            'redirect_uri': redirect_uri,
            'scope': ' '.join(scopes),
            'show_dialog': 'false'
        }
        
        auth_url = f'https://accounts.spotify.com/authorize?{urlencode(params)}'
        
        # Send redirect
        self.send_response(302)
        self.send_header('Location', auth_url)
        self.end_headers()