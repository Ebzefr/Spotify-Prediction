import pandas as pd
from prophet import Prophet

def forecast_track_timeseries(monthly_tracks_df, top_tracks, months_ahead=12):
    results = []

    for track in top_tracks:
        try:
            track_df = monthly_tracks_df[monthly_tracks_df['track_name'] == track].copy()
            track_df = track_df.rename(columns={'month': 'ds', 'ms_played': 'y'})
            track_df['ds'] = track_df['ds'].astype(str)

            m = Prophet()
            m.fit(track_df)

            future = m.make_future_dataframe(periods=months_ahead, freq='M')
            forecast = m.predict(future)

            last = track_df['ds'].max()
            future_pred = forecast[forecast['ds'] > last]
            future_pred['yhat'] = future_pred['yhat'].clip(lower=0)

            total_ms = future_pred['yhat'].sum()
            results.append((track, total_ms))

        except Exception as e:
            print(f"Error forecasting track {track}: {e}")

    df = pd.DataFrame(results, columns=['track_name', 'predicted_ms'])
    df = df.sort_values('predicted_ms', ascending=False)

    return df
