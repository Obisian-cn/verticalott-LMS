import express from "express";
const app = express();
const port = 3010;
app.get("/", (req, res) => res.json({ service: "notification-service", status: "ok" }));
app.listen(port, () => console.log("notification-service listening on port 3010"));
