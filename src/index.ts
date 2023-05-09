import express, { Express, Request, Response } from 'express';

const app: Express = express();
const port: number = 8000;

app.get("/", (_req: Request, res: Response) => {
  res.send("hello world").end();
})

app.listen(port, () => {
  console.log(`Express server is listening on ${port}`)
})
