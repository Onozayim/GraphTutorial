const express = require("express");
const { schema } = require("../server/Schema/typeDef");
const { resolvers } = require("../server/Schema/resolvers");
const graphqlHttp = require("express-graphql");
const mongoose = require("mongoose");
const isAuth = require("./middleware/is-auth");

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(isAuth);

app.use(
  "/graphql",
  graphqlHttp.graphqlHTTP({
    schema: schema,
    rootValue: resolvers,
    graphiql: true,
  })
);

const URL =
  "mongodb+srv://CamiloMontesDeOca:Montesdeoca2003@personalproyects.yaoqe.mongodb.net/events-react-dev?retryWrites=true&w=majority";

mongoose
  .connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    listen();
    console.log("DB connected");
  })
  .catch((err) => {
    console.log(err);
  });

const listen = () => {
  app.listen(4000, () => {
    console.log("Server conected");
  });
};
