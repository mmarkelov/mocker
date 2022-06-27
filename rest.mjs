import express from 'express';
import routes from './routes/index.mjs';

const app = express();

const port = 4000;

routes.forEach((route) => {
  const {
    method, url, result, errors,
  } = route;
  app[method.toLowerCase()](url, (req, res) => {
    const randomNum = Math.random();

    if (randomNum < 0.5) {
      res.status(errors[0].response.status).send(errors[0].response.id);
    } else {
      res.send(result);
    }
  });
});

console.log(`Mock Api Server listening: ${port}`);

app.listen(port);
