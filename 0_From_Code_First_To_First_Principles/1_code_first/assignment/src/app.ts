import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import userRouter from "./routes/user";

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

app.use("/users", userRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

export default app;
