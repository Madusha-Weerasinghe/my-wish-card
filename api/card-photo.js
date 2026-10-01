import { jwtVerify } from "jose";
import fs from "node:fs/promises";
import path from "node:path";

const IMAGE_DIR = path.join(process.cwd(), "private", "images");

const FALLBACK_IMAGE = "person2.jpg";

// Photos live in private/images as photo1.jpg ... photo4.jpg.
async function readPhoto(number) {
  if (Number.isInteger(number) && number >= 1 && number <= 4) {
    try {
      return await fs.readFile(path.join(IMAGE_DIR, `photo${number}.jpg`));
    } catch {
      // Fall through to the placeholder while the real photo is missing.
    }
  }

  return fs.readFile(path.join(IMAGE_DIR, FALLBACK_IMAGE));
}

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
       READ PRIVATE PHOTO
       (?n=1..4 picks the photo)
    ========================= */

    const image = await readPhoto(Number.parseInt(req.query?.n, 10));

    /* =========================
       SEND IMAGE
    ========================= */

    res.setHeader("Content-Type", "image/jpeg");

    res.setHeader("Cache-Control", "private, max-age=3600");

    return res.status(200).send(image);
  } catch (error) {
    console.error(error);

    return res.status(401).json({
      message: "Unauthorized",
    });
  }
}
