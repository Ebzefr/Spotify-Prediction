import pandas as pd
from prophet import Prophet

def forecast_artist_timeseries(monthly_df, top_artists, months_ahead=12):
    results = []

    for artist in top_artists:
        try:
            artist_df = monthly_df[monthly_df['artist_name'] == artist].copy()
            artist_df = artist_df.rename(columns={'month': 'ds', 'ms_played': 'y'})
            artist_df['ds'] = artist_df['ds'].astype(str)

            m = Prophet()
            m.fit(artist_df)

            future = m.make_future_dataframe(periods=months_ahead, freq='M')
            forecast = m.predict(future)

            last = artist_df['ds'].max()
            future_pred = forecast[forecast['ds'] > last]
            future_pred['yhat'] = future_pred['yhat'].clip(lower=0)

            total_ms = future_pred['yhat'].sum()
            results.append((artist, total_ms))

        except Exception as e:
            print(f"Error forecasting {artist}: {e}")

    df = pd.DataFrame(results, columns=['artist_name', 'predicted_ms'])
    df = df.sort_values('predicted_ms', ascending=False)

    return df
