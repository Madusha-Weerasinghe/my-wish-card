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

  res.setHeader("Content-Type", "text/html");

  return res.status(200).send(`
    <!doctype html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>A Little Surprise</title>
      </head>
      <body>
        <div id="app"></div>

        <script type="module" src="/src/main.js"></script>
      </body>
    </html>
  `);
}
