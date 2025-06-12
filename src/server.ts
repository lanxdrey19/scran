import "./index.js";
import express, { Request, Response } from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("🤖 Bot is running!");
});

app.listen(PORT, () => {
  console.log(`🌐 Web server is listening on port ${PORT}`);
});
