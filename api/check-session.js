import { jwtVerify } from "jose";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      authenticated: false,
    });
  }

  try {
    const cookies = req.headers.cookie || "";

    const sessionCookie = cookies
      .split(";")
      .map((cookie) => cookie.trim())
      .find((cookie) => cookie.startsWith("card_session="));

    if (!sessionCookie) {
      return res.status(401).json({
        authenticated: false,
      });
    }

    const token = sessionCookie.substring("card_session=".length);

    const sessionSecret = process.env.CARD_SESSION_SECRET;

    if (!sessionSecret) {
      console.error("CARD_SESSION_SECRET is not configured.");

      return res.status(500).json({
        authenticated: false,
      });
    }

    const secretKey = new TextEncoder().encode(sessionSecret);

    await jwtVerify(token, secretKey, {
      algorithms: ["HS256"],
    });

    return res.status(200).json({
      authenticated: true,
    });
  } catch (error) {
    return res.status(401).json({
      authenticated: false,
    });
  }
}
