import pandas as pd
import json
import os

from forecast_artists import forecast_artist_timeseries
from forecast_tracks import forecast_track_timeseries
from forecast_albums import calculate_top_albums

def export_json(data, path):
    with open(path, "w") as f:
        json.dump(data, f, indent=4)

def main():
    # Load cleaned data
    df = pd.read_csv("data/listening_history.csv")
    df['month'] = pd.to_datetime(df['month']).dt.to_period('M')

    # Artists monthly
    monthly = df.groupby(['month', 'artist_name'])['ms_played'].sum().reset_index()

    # Tracks monthly
    monthly_tracks = df.groupby(['month', 'track_name'])['ms_played'].sum().reset_index()

    # Top lists
    top_artists = monthly.groupby('artist_name')['ms_played'].sum().sort_values(ascending=False).head(20).index
    top_tracks = monthly_tracks.groupby('track_name')['ms_played'].sum().sort_values(ascending=False).head(30).index

    # Forecast artists
    artists_pred = forecast_artist_timeseries(monthly, top_artists)
    export_json(artists_pred.to_dict(orient="records"), "predictions/artists.json")

    # Forecast tracks
    tracks_pred = forecast_track_timeseries(monthly_tracks, top_tracks)
    export_json(tracks_pred.to_dict(orient="records"), "predictions/songs.json")

    # Albums
    albums = calculate_top_albums(df)
    export_json(albums.to_dict(), "predictions/albums.json")

    # Total listening prediction
    total_ms = artists_pred['predicted_ms'].sum()
    export_json({"predicted_ms": total_ms, "minutes": total_ms / 60000}, "predictions/minutes.json")

if __name__ == "__main__":
    main()
