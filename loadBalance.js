const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const port = 8080;

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

let count = 0;
let server = ["18.222.190.178", "13.58.8.242"];
let toggle = () => {
  if (count === 0) {
    count = 1;
  } else {
    count = 0;
  }
};
app.get("/loaderio-899fec3d958ff6945cd4c4046c4a86d2", (req, res) => {
  res.send("loaderio-899fec3d958ff6945cd4c4046c4a86d2");
});

app.get("/qa/:productId", (req, res) => {
  res.redirect(`http://${server[count]}/qa/${req.params.productId}`);
  toggle();
});

app.put("/qa/question/:question_id/helpful", (req, res) => {
  res.redirect(
    `http://${server[count]}/qa/question/${req.params.question_id}/helpful`
  );
  toggle();
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
