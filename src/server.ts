import "./index.js";
import logger from "./logger.js";
import express, { Request, Response } from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("🤖 Bot is running!");
});

app.listen(PORT, () => {
  logger.info(`🌐 Web server is listening on port ${PORT}`);
});
