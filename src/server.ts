import express, { Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import packageInfo from "../package.json";
import cors from "cors";
import startup from "./utils/startup";
import routes from "./routes";
import connectDB from "./repositories";
import { getLocalIPAddress } from "./utils/localIpAddress";

// Load the correct environment file
const env = process.env.NODE_ENV ?? "dev";
dotenv.config({ path: path.resolve(__dirname, `../config/${env}.env`) });

// Run startup ASCII art
console.log(startup());

// Connect to the database
connectDB();

const localIP = getLocalIPAddress();

// Use uppercase PORT for the environment variable
const port = process.env.PORT ?? 3000;

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api/v1", routes);

// Main route
app.get("/", (req: Request, res: Response) => {
    res.send(`${packageInfo.name} server (${process.env.NODE_ENV}) v${packageInfo.version} running`);
});

// Start the server
app.listen(port, () => {
    console.log(`${packageInfo.name} server v${packageInfo.version} is running:`);
    console.log(`- Local:    http://localhost:${port}`);
    console.log(`- Network:  http://${localIP}:${port}`);
});
