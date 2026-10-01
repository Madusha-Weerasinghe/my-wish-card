import { SignJWT } from "jose";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    const submittedCode = req.body?.code;

    if (!submittedCode) {
      return res.status(400).json({
        success: false,
        message: "Code is required",
      });
    }

    const correctCode = process.env.CARD_ACCESS_CODE;
    const sessionSecret = process.env.CARD_SESSION_SECRET;

    if (!correctCode || !sessionSecret) {
      console.error("Required environment variables are missing.");

      return res.status(500).json({
        success: false,
        message: "Server configuration error",
      });
    }

    if (submittedCode !== correctCode) {
      return res.status(401).json({
        success: false,
        message: "Incorrect code",
      });
    }

    const secretKey = new TextEncoder().encode(sessionSecret);

    const token = await new SignJWT({
      access: "wish-card",
    })
      .setProtectedHeader({
        alg: "HS256",
      })
      .setIssuedAt()
      .setExpirationTime("2h")
      .sign(secretKey);

    res.setHeader(
      "Set-Cookie",
      [
        `card_session=${token}`,
        "HttpOnly",
        "Path=/",
        "SameSite=Lax",
        "Max-Age=7200",
      ].join("; "),
    );

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}
