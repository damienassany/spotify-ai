import "animate.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TidyUp for Spotify - Made by Damien Assany @damienassany",
  description: "Creata playlists from your Liked songs on Spotify",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} flex min-h-screen overflow-y-hidden items-center px-10 h-full bg-blue-950`}
      >
        <main className="flex flex-row items-center gap-20">
          <iframe
            src="https://open.spotify.com/embed/playlist/37i9dQZF1DWWQRwui0ExPn?utm_source=generator&theme=0"
            width="400"
            height="800"
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          ></iframe>

          {children}
        </main>
      </body>
    </html>
  );
}
