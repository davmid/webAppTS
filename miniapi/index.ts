import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/auth";

dotenv.config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use("/", authRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
