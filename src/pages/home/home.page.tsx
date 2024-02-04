"use client";

import { useHome } from "./use-home";

export const HomePage = () => {
  const { handleConnect, title } = useHome();

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-5xl font-bold">{title}</h1>
        <p className="text-lg mt-5 animate__fadeIn animate__animated animate__delay-1s">
          Create playlists from your Liked songs on Spotify
        </p>
      </div>
      <button
        onClick={handleConnect}
        className="px-10 py-5 rounded-full font-bold text-lg bg-primary text-black hover:scale-105 self-start animate__fadeIn animate__animated animate__delay-1s"
      >
        Get started
      </button>
    </div>
  );
};
