import express from "express";
const app = express();
const port = 3006;
app.get("/", (req, res) => res.json({ service: "enrollment-service", status: "ok" }));
app.listen(port, () => console.log("enrollment-service listening on port 3006"));
