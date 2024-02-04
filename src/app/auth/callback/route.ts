import { spotifyProvider } from "@/providers/spotify";
import { NextResponse } from "next/server";

/**
 * Error codes:
 * 521 - Failed to get token
 * 523 - No code provided
 *
 * @param request
 * @returns
 */

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (code) {
    try {
      const { accessToken, refreshToken, expiresIn } =
        await spotifyProvider.getToken(code);

      if (!accessToken || !refreshToken) {
        throw new Error("Failed to get token");
      }

      return NextResponse.redirect(
        `${url.origin}/?token=${accessToken}&refresh_token=${refreshToken}&expires_in=${expiresIn}`
      );
    } catch (error) {
      console.error(error);
      return NextResponse.redirect(`${url.origin}/?error=521`);
    }
  }

  return NextResponse.redirect(`${url.origin}/?error=523`);
}
