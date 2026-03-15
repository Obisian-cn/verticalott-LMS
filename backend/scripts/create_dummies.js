import fs from 'fs';
import path from 'path';

const services = [
    { name: 'content-service', port: 3004 },
    { name: 'video-service', port: 3005 },
    { name: 'enrollment-service', port: 3006 },
    { name: 'payment-service', port: 3007 },
    { name: 'progress-service', port: 3008 },
    { name: 'review-service', port: 3009 },
    { name: 'notification-service', port: 3010 },
];

const template = (name, port) => `import express from "express";
const app = express();
const port = ${port};
app.get("/", (req, res) => res.json({ service: "${name}", status: "ok" }));
app.listen(port, () => console.log("${name} listening on port ${port}"));
`;

services.forEach(s => {
    const dir = path.join(process.cwd(), s.name, 'src');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'main.ts'), template(s.name, s.port));
    console.log(`Created ${s.name}/src/main.ts`);
});
