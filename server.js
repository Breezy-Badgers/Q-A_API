const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const neo4j = require("neo4j-driver").v1;
const path = require("path");
const parser = require("parse-neo4j");
const app = express();

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const driver = neo4j.driver(
  `bolt://localhost:7687`,
  neo4j.auth.basic("neo4j", "hrnyc25")
);
const session = driver.session();

app.get("/qa/:product_id", (req, res) => {
  console.log(req.params.product_id);
  session
    .run(
      `MATCH (product:Product{product_id:{ID}})-->(question:Question)-->(answer:Answer)
        RETURN question,collect(answer) as answers`,
      { ID: parseInt(req.params.product_id) }
    )
    .then(data => {
      res.send(data.records);
    })
    .catch(err => {
      res.sendStatus(404);
      console.log(err);
      session.close();
    });
});

app.listen(3000, () => {
  console.log("connected");
});
