import pandas as pd

def calculate_top_albums(df_clean):
    albums = (
        df_clean.groupby('album_name')['ms_played']
        .sum()
        .sort_values(ascending=False)
    )
    return albums
