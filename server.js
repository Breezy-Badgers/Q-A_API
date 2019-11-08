const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const neo4j = require("neo4j-driver").v1;
const path = require("path");
const parser = require("parse-neo4j");
const app = express();
const db = require("./db/db.js");

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const driver = neo4j.driver(
  `bolt://localhost:7687`,
  neo4j.auth.basic("neo4j", "hrnyc25")
);
const session = driver.session();

app.get("/qa/:product_id", (req, res) => {
  console.log(db, req.params.product_id);
  db.getAllQuestions(parseInt(req.params.product_id), session)
    .then(parser.parse)
    .then(result => {
      data = result[0];
      data.results.forEach(question => {
        let newAnswer = {};
        question.answers.forEach(answer => {
          newAnswer[answer.id] = answer;
        });
        question.answers = newAnswer;
      });
      res.send(data);
    })
    .catch(err => {
      res.sendStatus(404);
      console.log(err);
      session.close();
    });
});

// app.get("/");

app.listen(3000, () => {
  console.log("connected");
});

// `
// MATCH p=(n:Product{product_id:2})-[:hasQuestion]->(q:Question)-[:hasAnswer]->(a:Answer)
// WITH {
// question_body:q.question_body,
// question_id:q.question_id,
// question_date:q.question_date,
// asker_name:q.question_asker_name,
// question_helpfulness: q.question_helpful,
// reported: q.question_reported,
// answers:collect(a)
// } as questionResults
// WITH {product_id:2, results:collect(questionResults)} as Result
// RETURN Result
// `

// `MATCH (product:Product{product_id:{ID}})-->(question:Question)-->(answer:Answer)
//         RETURN question,collect(answer) as answers`,
