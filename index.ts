import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import fileupload from "express-fileupload";
import mainroutes from "./allRoutes";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import "reflect-metadata";
//import dotenv from "dotenv";
//dotenv.config();
var app = express();
var mongoose = require("mongoose");
//let uri = process.env.MONGO_URL;

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Express API for JSONPlaceholder',
    version: '1.0.0',
    description:
      'This is a REST API application made with Express. It retrieves data from JSONPlaceholder.',
    license: {
      name: 'Licensed Under MIT',
      url: 'https://spdx.org/licenses/MIT.html',
    },
    contact: {
      name: 'JSONPlaceholder',
      url: 'https://jsonplaceholder.typicode.com',
    },
  },
  servers: [
    {
      url: 'http://localhost:3008',
      description: 'Development server',
    },
  ],
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ["./org/r1/controllers/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

mongoose
  .connect(
    "mongodb+srv://sarabpreet:Sarab123@cluster0.nxyuq.mongodb.net/test",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(function () {
    return console.log("connected");
  });
app.use(fileupload());
app.use(cors());
app.use(express.json());

app.use(helmet());

app.use("/swagger-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(
  "/org",
  function (req: Request, res: Response, next: NextFunction) {
    next();
  },
  mainroutes
);

var port = process.env.PORT || 3008;
app.listen(port, function () {
  console.log("app listening at http://localhost:" + port);
});
