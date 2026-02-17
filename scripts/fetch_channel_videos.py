"""
Script to fetch video metadata from specified YouTube channels using direct Channel IDs.
"""

import os
import json
import requests
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("YOUTUBE_API_KEY")

CHANNELS = {
    "GeeksforGeeks": "UC0RhatS1pyxInC00YKjjBqQ",
    "gkcs": "UCRPMAqdtSgd0Ipeef7iFsKw",
    "hello_interview": "UC2UX_v6h_p1M2qM7fT2F_4Q",
    "ByteByteGo": "UCZHLi6N_A51_S4L5gD5y9yQ"
}


def get_uploads_id(channel_id):
    """
    Fetches the uploads playlist ID for a given channel ID.
    """
    base_url = "https://www.googleapis.com/youtube/v3"
    url = (
        f"{base_url}/channels?part=contentDetails&id={channel_id}"
        f"&key={API_KEY}"
    )
    resp = requests.get(url, timeout=10)
    if resp.status_code != 200:
        print(f"Error fetching channel details: {resp.text}")
        return None
    data = resp.json()
    items = data.get('items', [])
    if items:
        return items[0]['contentDetails']['relatedPlaylists']['uploads']
    return None


def fetch_videos_for_channel(name, channel_id):
    """
    Fetches all videos from a channel's uploads playlist and saves to JSON.
    """
    if not API_KEY:
        print("Error: YOUTUBE_API_KEY not found in .env")
        return

    print(f"\nProcessing channel {name} ({channel_id})...")
    uploads_playlist_id = get_uploads_id(channel_id)

    if not uploads_playlist_id:
        print(f"Could not find uploads playlist for {name}.")
        return

    print(f"Found Uploads Playlist: {uploads_playlist_id}...")

    videos = []
    next_page_token = None

    while True:
        pl_url = (
            "https://www.googleapis.com/youtube/v3/playlistItems"
            f"?part=snippet&playlistId={uploads_playlist_id}"
            f"&maxResults=50&key={API_KEY}"
        )
        if next_page_token:
            pl_url += f"&pageToken={next_page_token}"

        resp = requests.get(pl_url, timeout=10)
        if resp.status_code != 200:
            print(f"Error fetching playlist: {resp.text}")
            break

        data = resp.json()
        items = data.get('items', [])

        for item in items:
            snippet = item['snippet']
            videos.append({
                'title': snippet['title'],
                'videoId': snippet['resourceId']['videoId'],
                'publishedAt': snippet['publishedAt']
            })

        next_page_token = data.get('nextPageToken')
        print(f"Fetched {len(videos)} videos so far...")

        if not next_page_token:
            break

    # Save to file
    outfile = f'system-design/data/{name}_videos.json'
    os.makedirs('system-design/data', exist_ok=True)
    with open(outfile, 'w', encoding='utf-8') as f:
        json.dump(videos, f, indent=2)

    print(f"Done! Saved {len(videos)} videos to {outfile}")


if __name__ == "__main__":
    for c_name, c_id in CHANNELS.items():
        fetch_videos_for_channel(c_name, c_id)
