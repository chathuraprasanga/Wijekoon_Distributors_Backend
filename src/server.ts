import express, { Request, Response } from "express";
import "dotenv/config";
import packageInfo from "../package.json"
import cors from "cors";
import startup from "./utils/startup";

// Run startup ASCII art
console.log(startup());

const port = process.env.port ?? 5000;

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Main route
app.get("/", (req: Request, res: Response) => {
    res.send(`${packageInfo.name} server v${packageInfo.version} running`)
})

// Start the server
app.listen(port, () => {
  console.log(`${packageInfo.name} server v${packageInfo.version} is running on http://localhost:${port}`);
});
