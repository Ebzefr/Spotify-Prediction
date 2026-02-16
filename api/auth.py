from urllib.parse import urlencode
import os

def handler(event, context):
    """Redirect to Spotify OAuth"""
    
    client_id = os.getenv('SPOTIFY_CLIENT_ID')
    redirect_uri = os.getenv('SPOTIFY_REDIRECT_URI')
    
    if not client_id:
        return {
            'statusCode': 500,
            'body': 'SPOTIFY_CLIENT_ID not configured'
        }
    
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
    
    return {
        'statusCode': 302,
        'headers': {
            'Location': auth_url
        }
    }