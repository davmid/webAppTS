import { Router, Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import users from "../data/users";

const router = Router();
const tokenSecret = process.env.JWT_SECRET || "secret";
let refreshToken: string;

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

router.get("/", (_req: Request, res: Response) => {
  res.send("Hello World - simple api with JWT!");
});

router.post("/login", loginHandler);
router.post("/token", tokenHandler);
router.post("/refreshToken", refreshHandler);
router.get("/protected/:id", verifyToken, protectedHandler);

async function loginHandler(req: Request, res: Response): Promise<void> {
  const { login, password } = req.body;
  const user = users.find(u => u.login === login);

  if (!user) {
    res.status(401).json({ error: "Nieprawidłowy login" });
    return;
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    res.status(401).json({ error: "Nieprawidłowe hasło" });
    return;
  }

  const accessToken = jwt.sign(
    { id: user.id, role: user.role },
    tokenSecret,
    { expiresIn: "15m" }
  );

  refreshToken = jwt.sign(
    { id: user.id },
    tokenSecret,
    { expiresIn: "7d" }
  );

  res.json({ accessToken, refreshToken });
}

function tokenHandler(req: Request, res: Response) {
  const expTime = Number(req.body.exp) || 60;
  const token = generateToken(expTime);
  refreshToken = generateToken(60 * 60);
  res.status(200).json({ token, refreshToken });
}

async function refreshHandler(req: Request, res: Response): Promise<void> {
  const refreshTokenFromPost = req.body.refreshToken;

  if (refreshToken !== refreshTokenFromPost) {
    res.status(400).send("Bad refresh token!");
    return;
  }

  const expTime = Number(req.headers.exp) || 60;
  const token = generateToken(expTime);
  refreshToken = generateToken(60 * 60);

  setTimeout(() => {
    res.status(200).json({ token, refreshToken });
  }, 3000);
}


function protectedHandler(req: Request, res: Response) {
  const id = req.params.id;
  const delay = Number(req.query.delay) || 1000;

  setTimeout(() => {
    res.status(200).json({ message: `protected endpoint ${id}` });
  }, delay);
}

function verifyToken(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) {
    res.status(403).send("Brak tokenu");
    return;
  }

  jwt.verify(token, tokenSecret, (err, user) => {
    if (err) {
      console.log(err);
      res.status(401).send("Nieprawidłowy token");
      return;
    }
    req.user = user;
    next();
  });
}

function generateToken(expirationInSeconds: number) {
  const exp = Math.floor(Date.now() / 1000) + expirationInSeconds;
  return jwt.sign({ exp, foo: "bar" }, tokenSecret, { algorithm: "HS256" });
}

export default router;
