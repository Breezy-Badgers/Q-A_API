const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const neo4j = require("neo4j-driver").v1;
const parser = require("parse-neo4j");
const app = express();
const db = require("./db/db.js");
const dbHelper = require("./db/neo4jHelper");
const cors = require("cors");
const port = 8080;

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.get("/loaderio-b33e58337b890618cc3bd09fc85bce39", (req, res) => {
  res.send("loaderio-b33e58337b890618cc3bd09fc85bce39");
});
const driver = neo4j.driver(
  `bolt://ec2-18-191-179-68.us-east-2.compute.amazonaws.com:7687`,
  neo4j.auth.basic("neo4j", "1234")
);

app.get("/qa/:product_id", (req, res) => {
  let skip =
    req.query.page && req.query.count
      ? (parseInt(req.query.page) - 1) * parseInt(req.query.count)
      : 0;
  let show = req.query.count ? parseInt(req.query.count) : 5;

  db.getAllQuestions(
    parseInt(req.params.product_id),
    dbHelper.getSession(req, driver),
    skip,
    show
  )
    .then(parser.parse)
    .then(result => {
      // session.close();
      data = result[0];
      data.results.forEach(question => {
        let newAnswer = {};
        question.answers.forEach(answer => {
          if (answer.id !== null) {
            newAnswer[answer.id] = answer;
          }
        });
        question.answers = newAnswer;
      });
      res.send(data);
    })
    .catch(err => {
      res.sendStatus(404);
      console.log(err);
      // session.close();
    });
});

app.get("/qa/:question_id/answers", (req, res) => {
  const session = driver.session();
  let page = req.query.page ? parseInt(req.query.page) : 1;
  let count = req.query.count ? parseInt(req.query.count) : 5;
  let skip = (page - 1) * count;

  db.getAllAnswers(parseInt(req.params.question_id), session, skip, count)
    .then(parser.parse)
    .then(result => {
      session.close();
      data = result[0];
      data.count = count;
      data.page = page;
      res.send(data);
    })
    .catch(err => {
      res.sendStatus(404);
      console.log(err);
      session.close();
    });
});

app.post("/qa/:product_id", (req, res) => {
  const session = driver.session();
  const product_id = parseInt(req.params.product_id);
  const data = { ...req.body, date: new Date().toISOString().slice(0, 10) };
  db.addQuestion(product_id, data, session)
    .then(() => {
      session.close();
      res.sendStatus(201);
    })
    .catch(err => {
      session.close();
      res.sendStatus(404);
      console.log(err.message);
    });
});

app.post("/qa/:question_id/answers", (req, res) => {
  const session = driver.session();
  const question_id = parseInt(req.params.question_id);
  const data = { ...req.body, date: new Date().toISOString().slice(0, 10) };
  db.addAnswer(question_id, data, session)
    .then(() => {
      session.close();
      res.sendStatus(201);
    })
    .catch(err => {
      session.close();
      res.sendStatus(404);
      console.log(err.message);
    });
});

app.put("/qa/question/:question_id/helpful", (req, res) => {
  const session = driver.session();
  let question_id = parseInt(req.params.question_id);
  db.markQuestionHelpful(question_id, session)
    .then(data => {
      session.close();
      res.sendStatus(204);
    })
    .catch(err => {
      res.sendStatus(404);
      console.log(err.message);
    });
});

app.put("/qa/question/:question_id/report", (req, res) => {
  const session = driver.session();
  let question_id = parseInt(req.params.question_id);
  db.reportQuestion(question_id, session)
    .then(data => {
      session.close();
      res.sendStatus(204);
    })
    .catch(err => {
      res.sendStatus(404);
      console.log(err.message);
    });
});

app.put("/qa/answer/:answer_id/helpful", (req, res) => {
  const session = driver.session();
  let answer_id = parseInt(req.params.answer_id);
  db.markAnswerHelpful(answer_id, session)
    .then(data => {
      session.close();
      res.sendStatus(204);
    })
    .catch(err => {
      res.sendStatus(404);
      console.log(err.message);
    });
});

app.put("/qa/answer/:answer_id/report", (req, res) => {
  const session = driver.session();
  let answer_id = parseInt(req.params.answer_id);
  db.reportAnswer(answer_id, session)
    .then(data => {
      session.close();
      res.sendStatus(204);
    })
    .catch(err => {
      res.sendStatus(404);
      console.log(err.message);
    });
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
