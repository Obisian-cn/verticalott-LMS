import express from "express";
const app = express();
const port = 3008;
app.get("/", (req, res) => res.json({ service: "progress-service", status: "ok" }));
app.listen(port, () => console.log("progress-service listening on port 3008"));
