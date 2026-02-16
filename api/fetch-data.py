# api/fetch-spotify-data.py
import json
import requests

def handler(event, context):
    """Fetch Spotify data using server-side token"""
    
    # Get token from cookie (server-side)
    cookies = event.get('headers', {}).get('cookie', '')
    access_token = None
    
    for cookie in cookies.split(';'):
        if 'spotify_token=' in cookie:
            access_token = cookie.split('spotify_token=')[1].strip()
            break
    
    if not access_token:
        return {
            'statusCode': 401,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Unauthorized - No token'})
        }
    
    headers = {'Authorization': f'Bearer {access_token}'}
    
    try:
        # Fetch all data in parallel
        import concurrent.futures
        
        def fetch_endpoint(url):
            response = requests.get(url, headers=headers)
            return response.json() if response.status_code == 200 else None
        
        endpoints = {
            'top_artists_long': 'https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=50',
            'top_artists_medium': 'https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=30',
            'top_tracks_long': 'https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=50',
            'recent_tracks': 'https://api.spotify.com/v1/me/player/recently-played?limit=50'
        }
        
        results = {}
        with concurrent.futures.ThreadPoolExecutor() as executor:
            future_to_key = {executor.submit(fetch_endpoint, url): key 
                           for key, url in endpoints.items()}
            
            for future in concurrent.futures.as_completed(future_to_key):
                key = future_to_key[future]
                results[key] = future.result()
        
        # Process results
        spotify_data = {
            'top_artists_long': process_artists(results.get('top_artists_long')),
            'top_artists_medium': process_artists(results.get('top_artists_medium')),
            'top_tracks_long': process_tracks(results.get('top_tracks_long')),
            'recent_tracks': process_recent(results.get('recent_tracks'))
        }
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': 'true'
            },
            'body': json.dumps(spotify_data)
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)})
        }


def process_artists(data):
    """Process artist data"""
    if not data or 'items' not in data:
        return []
    
    return [
        {
            'id': a['id'],
            'name': a['name'],
            'image_url': a['images'][0]['url'] if a.get('images') else None,
            'genres': a.get('genres', [])
        }
        for a in data['items']
    ]


def process_tracks(data):
    """Process track data"""
    if not data or 'items' not in data:
        return []
    
    return [
        {
            'id': t['id'],
            'name': t['name'],
            'artist': t['artists'][0]['name'] if t.get('artists') else 'Unknown',
            'album_name': t['album']['name'] if t.get('album') else 'Unknown Album',
            'album_id': t['album']['id'] if t.get('album') else None,
            'image_url': t['album']['images'][0]['url'] if t.get('album', {}).get('images') else None
        }
        for t in data['items']
    ]


def process_recent(data):
    """Process recent tracks"""
    if not data or 'items' not in data:
        return []
    
    return [
        {
            'played_at': item['played_at'],
            'track_name': item['track']['name'] if item.get('track') else 'Unknown',
            'artist': item['track']['artists'][0]['name'] if item.get('track', {}).get('artists') else 'Unknown',
            'duration_ms': item['track']['duration_ms'] if item.get('track') else 180000
        }
        for item in data['items']
    ]