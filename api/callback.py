import json
import requests
import base64
import os

def handler(event, context):
    """Handle OAuth callback and exchange code for token"""
    
    # Get code from query parameters
    query_params = event.get('queryStringParameters', {})
    code = query_params.get('code')
    error = query_params.get('error')
    
    if error or not code:
        # Redirect to frontend with error
        return {
            'statusCode': 302,
            'headers': {
                'Location': f'/?error={error or "no_code"}'
            }
        }
    
    # Exchange code for token (server-side only)
    client_id = os.getenv('SPOTIFY_CLIENT_ID')
    client_secret = os.getenv('SPOTIFY_CLIENT_SECRET')
    redirect_uri = os.getenv('SPOTIFY_REDIRECT_URI')
    
    auth_str = f"{client_id}:{client_secret}"
    b64_auth = base64.b64encode(auth_str.encode()).decode()
    
    try:
        response = requests.post(
            'https://accounts.spotify.com/api/token',
            data={
                'grant_type': 'authorization_code',
                'code': code,
                'redirect_uri': redirect_uri
            },
            headers={
                'Authorization': f'Basic {b64_auth}',
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        )
        
        token_data = response.json()
        
        if 'access_token' not in token_data:
            raise Exception(token_data.get('error_description', 'Failed to get token'))
        
        access_token = token_data['access_token']
        
        # Redirect to frontend with success
        # Pass token temporarily (in production, use secure session)
        return {
            'statusCode': 302,
            'headers': {
                'Location': f'/?session={access_token[:20]}...', # Truncated for security
                'Set-Cookie': f'spotify_token={access_token}; HttpOnly; Secure; SameSite=Strict; Max-Age=3600'
            }
        }
        
    except Exception as e:
        return {
            'statusCode': 302,
            'headers': {
                'Location': f'/?error={str(e)}'
            }
        }