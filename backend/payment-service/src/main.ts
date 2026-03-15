import express from "express";
const app = express();
const port = 3007;
app.get("/", (req, res) => res.json({ service: "payment-service", status: "ok" }));
app.listen(port, () => console.log("payment-service listening on port 3007"));
