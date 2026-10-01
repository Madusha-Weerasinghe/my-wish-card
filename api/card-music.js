import { jwtVerify } from "jose";
import fs from "node:fs/promises";
import path from "node:path";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  try {
    /* =========================
       GET SESSION COOKIE
    ========================= */

    const cookies = req.headers.cookie || "";

    const sessionCookie = cookies
      .split(";")
      .map((cookie) => cookie.trim())
      .find((cookie) => cookie.startsWith("card_session="));

    if (!sessionCookie) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const token = sessionCookie.substring("card_session=".length);

    /* =========================
       VERIFY SESSION
    ========================= */

    const sessionSecret = process.env.CARD_SESSION_SECRET;

    if (!sessionSecret) {
      return res.status(500).json({
        message: "Server configuration error",
      });
    }

    const secretKey = new TextEncoder().encode(sessionSecret);

    await jwtVerify(token, secretKey, {
      algorithms: ["HS256"],
    });

    /* =========================
       READ PRIVATE MUSIC
    ========================= */

    const musicPath = path.join(
      process.cwd(),
      "private",
      "music",
      "happyBirthday.mp3",
    );

    const music = await fs.readFile(musicPath);

    /* =========================
       SEND MUSIC
    ========================= */

    res.setHeader("Content-Type", "audio/mpeg");

    res.setHeader("Cache-Control", "private, max-age=3600");

    return res.status(200).send(music);
  } catch (error) {
    console.error(error);

    return res.status(401).json({
      message: "Unauthorized",
    });
  }
}
