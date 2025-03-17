import path from "node:path";
import { fileURLToPath } from "node:url";
import { Router, Request, Response } from "express";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

//Define route to serve index.html

router.get("*", (_req: Request, res: Response): void => {
  const clientPath =
    process.env.NODE_ENV === "production"
      ? "../../../client/dist"
      : "../../../client";

  res.sendFile(path.join(__dirname, `${clientPath}/index.html`));
});

export default router;
