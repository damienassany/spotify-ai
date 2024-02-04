"use client";

import { spotifyProvider } from "@/providers/spotify";
import { useEffect, useMemo, useState } from "react";

const greetings = ["Good morning", "Good afternoon", "Good evening"];

export const DashboardPage = () => {
  const [fetching, setFetching] = useState(true);
  const [likedSongs, setLikedSongs] = useState<
    | {
        name: string;
        images: {
          url: string;
          width: number;
          height: number;
        }[];
        artists: string[];
      }[]
  >([]);
  const greeting = useMemo(() => {
    const date = new Date();
    const hour = date.getHours();

    if (hour >= 5 && hour < 12) {
      return greetings[0];
    }

    if (hour >= 12 && hour < 18) {
      return greetings[1];
    }

    return greetings[2];
  }, []);

  useEffect(() => {
    spotifyProvider.fetchLikedSongs().then((songs) => {
      setFetching(false);

      if (songs) {
        setLikedSongs(songs);
      }
    });
  }, []);

  return (
    <div
      className="flex flex-col gap-10"
      style={{ height: "calc(800px - 80px)" }}
    >
      <h1 className="text-5xl font-bold">{greeting}</h1>
      {fetching ? (
        <p className="text-lg mt-5">Fetching your liked songs...</p>
      ) : (
        <>
          <div
            className="max-h-screen max-w-3xl overflow-y-scroll flex flex-col gap-4 animate__fadeIn animate__animated p-5 rounded-lg"
            style={{ background: "#121212" }}
          >
            {likedSongs.map((song, index) => (
              <div
                key={`${song.name}-${index}`}
                className="p-3 rounded-md flex flex-row gap-6 items-center"
              >
                <img
                  src={song.images[0]?.url}
                  alt={song.name}
                  width={song.images[0]?.width}
                  height={song.images[0]?.height}
                  className="rounded-md w-10 h-10"
                />
                <div className="flex flex-col">
                  <p>{song.name}</p>
                  <p>{song.artists.map((artist) => artist).join(", ")}</p>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => {}}
            className="px-10 py-5 rounded-full font-bold text-lg bg-primary text-black hover:scale-105 self-start animate__fadeIn animate__animated"
          >
            Build my playlists
          </button>
        </>
      )}
    </div>
  );
};
