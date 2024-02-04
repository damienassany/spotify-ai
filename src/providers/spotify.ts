class SpotifyProvider {
  private clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
  private clientSecret = process.env.NEXT_PUBLIC_CLIENT_SECRET;
  private scopes = [
    "user-library-read",
    "playlist-modify-public",
    "playlist-modify-private",
  ];
  private redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI;

  public get accessToken() {
    return localStorage.getItem("token");
  }

  public async authorize() {
    window.location.href = `https://accounts.spotify.com/authorize?client_id=${
      this.clientId
    }&response_type=code&redirect_uri=${
      this.redirectUri
    }&scope=${this.scopes.join("%20")}`;
  }

  public async getToken(code: string) {
    try {
      const res = await fetch(
        `https://accounts.spotify.com/api/token?grant_type=authorization_code&code=${code}&redirect_uri=${this.redirectUri}&client_id=${this.clientId}&client_secret=${this.clientSecret}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      ).then((res) => res.json());

      return {
        accessToken: res.access_token,
        refreshToken: res.refresh_token,
        expiresIn: res.expires_in,
      };
    } catch (e) {
      console.log(e);
      return { accessToken: null, refreshToken: null, expiresIn: null };
    }
  }

  public async refreshToken() {
    const refreshToken = localStorage.getItem("refreshToken");

    if (refreshToken) {
      const res = await fetch(
        `https://accounts.spotify.com/api/token?grant_type=refresh_token&refresh_token=${refreshToken}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${btoa(
              `${this.clientId}:${this.clientSecret}`
            )}`,
          },
        }
      ).then((res) => res.json());

      localStorage.setItem("token", res.access_token);
      localStorage.setItem(
        "expiresIn",
        new Date(new Date().getTime() + res.expires_in * 1000).toISOString()
      );

      return {
        accessToken: res.access_token,
        expiresIn: res.expires_in,
      };
    }

    return { accessToken: null, refreshToken: null, expiresIn: null };
  }

  public async fetchLikedSongs() {
    try {
      const firstPage = await fetch(
        "https://api.spotify.com/v1/me/tracks?limit=50",
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      ).then((res) => res.json());

      const total = firstPage.total;
      const numberOfPages = Math.ceil(total / 50);
      const promises = Array.from({ length: numberOfPages - 1 }, (_, i) => {
        const offset = (i + 1) * 50;
        return fetch(
          `https://api.spotify.com/v1/me/tracks?limit=50&offset=${offset}`,
          {
            headers: {
              Authorization: `Bearer ${this.accessToken}`,
            },
          }
        ).then((res) => res.json());
      });

      const pages = await Promise.all(promises);

      const tracks = pages.reduce(
        (acc, response) => {
          return [
            ...acc,
            ...response.items.map((item: any) => ({
              name: item.track.name as string,
              images: item.track.album.images as {
                url: string;
                width: number;
                height: number;
              }[],
              artists: item.track.artists.map(
                (artist: any) => artist.name
              ) as string[],
            })),
          ];
        },
        firstPage.items.map((item: any) => ({
          name: item.track.name as string,
          images: item.track.album.images as {
            url: string;
            width: number;
            height: number;
          }[],
          artists: item.track.artists.map(
            (artist: any) => artist.name
          ) as string[],
        }))
      );

      return tracks;
    } catch (error) {
      console.error("Error fetching Liked Songs playlist:", error);
    }
  }
}

export const spotifyProvider = new SpotifyProvider();
