import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // Server-side proxy for OMDb API movie detail requests
  app.get("/api/movie-detail", async (req, res) => {
    const imdbID = (req.query.i as string) || "";
    if (!imdbID.trim()) {
      return res.status(400).json({ Response: "False", Error: "Missing IMDb ID" });
    }

    const candidateKeys = [
      process.env.OMDB_API_KEY,
      process.env.VITE_OMDB_API_KEY,
      "7f027286",
      "trilogy",
      "b9bd48a6"
    ].filter((k): k is string => Boolean(k && k.trim()));

    const uniqueKeys = Array.from(new Set(candidateKeys));
    let lastError = "Invalid API key!";

    for (const apiKey of uniqueKeys) {
      try {
        const url = `https://www.omdbapi.com/?i=${encodeURIComponent(imdbID.trim())}&plot=full&apikey=${apiKey.trim()}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.Response === "True") {
          return res.json(data);
        }

        if (data.Error && data.Error !== "Invalid API key!" && data.Error !== "Request limit reached!") {
          return res.json(data);
        }

        lastError = data.Error || lastError;
      } catch (err) {
        lastError = err instanceof Error ? err.message : String(err);
      }
    }

    return res.status(400).json({ Response: "False", Error: lastError });
  });

  // Server-side proxy for OMDb API requests to protect API key and avoid CORS/Origin restrictions
  app.get("/api/movies", async (req, res) => {
    const query = (req.query.s as string) || "";
    if (!query.trim()) {
      return res.json({ Search: [], totalResults: "0", Response: "True" });
    }

    const candidateKeys = [
      process.env.OMDB_API_KEY,
      process.env.VITE_OMDB_API_KEY,
      "7f027286",
      "trilogy",
      "b9bd48a6"
    ].filter((k): k is string => Boolean(k && k.trim()));

    const uniqueKeys = Array.from(new Set(candidateKeys));
    let lastError = "Invalid API key!";

    for (const apiKey of uniqueKeys) {
      try {
        const url = `https://www.omdbapi.com/?s=${encodeURIComponent(query.trim())}&apikey=${apiKey.trim()}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.Response === "True") {
          return res.json(data);
        }
        
        if (data.Error && data.Error !== "Invalid API key!" && data.Error !== "Request limit reached!") {
          // Return legitimate OMDb domain response like "Movie not found!"
          return res.json(data);
        }

        lastError = data.Error || lastError;
      } catch (err) {
        lastError = err instanceof Error ? err.message : String(err);
      }
    }

    return res.status(400).json({ Response: "False", Error: lastError });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
