import json

def handler(event, context):
    """Generate predictions from Spotify data"""
    
    try:
        body = json.loads(event.get('body', '{}'))
        spotify_data = body.get('spotify_data')
    except:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Invalid request body'})
        }
    
    if not spotify_data:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'No Spotify data provided'})
        }
    
    # Your existing prediction logic
    predictions = generate_predictions(spotify_data)
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps(predictions)
    }

# Include your existing generate_predictions function here
# (same as in frontend - move it to backend)