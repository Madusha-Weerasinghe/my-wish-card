export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  const requestedToken = req.query?.token;
  const correctToken = process.env.CARD_LINK_TOKEN;

  if (!correctToken) {
    console.error("CARD_LINK_TOKEN is not configured.");

    return res.status(500).send("Server configuration error");
  }

  if (!requestedToken || requestedToken !== correctToken) {
    return res.status(404).send("Not found");
  }

  return res.status(200).send("Valid card link");
}
