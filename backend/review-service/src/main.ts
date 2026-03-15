import express from "express";
const app = express();
const port = 3009;
app.get("/", (req, res) => res.json({ service: "review-service", status: "ok" }));
app.listen(port, () => console.log("review-service listening on port 3009"));
