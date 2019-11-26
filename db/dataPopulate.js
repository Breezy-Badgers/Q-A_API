//powerShell Script to parse big CSV file
`$i=0; Get-Content C:\Users\Gavin\Downloads\Hospital_Revised_Flatfiles\HCAHPSHospital.csv --file name
-ReadCount 2500 --# of line per split | %{$i++; $_ | Out-File C:\Users\Gavin\Downloads\Hospital_Revised_Flatfiles\split\splitfile_$i.csv} --keep $i.csv`;
`$i=0; Get-Content C:\Users\Hoon\.Neo4jDesktop\neo4jDatabases\database-4ff1a121-5006-44b3-a05a-de419ba62d52\installation-3.5.6\import\product.csv -ReadCount 1000000
 | %{$i++; $_ | Out-File C:\Users\Hoon\.Neo4jDesktop\neo4jDatabases\database-4ff1a121-5006-44b3-a05a-de419ba62d52\installation-3.5.6\import\product_$i.csv}`;

const driver = neo4j.driver(
  `http://68.129.140.202:7687`,
  neo4j.auth.basic("neo4j", "hrnyc25")
);
const session = driver.session();

const personName = "Alice";
const createProductIndexPromise = session.run(
  `CREATE INDEX ON :Product(product_id);`
);

const createQuestionIndexPromise = session.run(
  `CREATE INDEX ON :Question(question_id);`
);

const createAnswerIndexPromise = session.run(
  `CREATE INDEX ON :Answer(answer_id);`
);

const loadProductPromise = session.run(
  `USING PERIODIC COMMIT 1000
  LOAD CSV WITH HEADERS FROM "file:///product.csv" AS row
  MERGE(product:Product {product_id: toInteger(row.id)})
  RETURN count(row)`
);

const loadQuestionPromise = session.run(
  `USING PERIODIC COMMIT 1500
  LOAD CSV WITH HEADERS FROM "file:///questions.csv" AS row
  MERGE(q:Question {question_id: toInteger(row.id)})
    SET q.question_body=row.body, q.question_date=row.date_written, q.question_asker_name=row.asker_name, q.question_asker_email=
  row.asker_email, q.question_reported= toInteger(row.reported), q.question_helpful=toInteger(row.helpful)
  RETURN count(row)`
);

const loadAnswersPromise = session.run(
  `USING PERIODIC COMMIT
  LOAD CSV WITH HEADERS FROM "file:///answers.csv" AS row
  MERGE(a:Answer {answer_id: toInteger(row.id)})
    SET a.answer_body=row.body, a.answer_date=row.date_written, a.answer_answerer_name=row.answerer_name, a.answer_answerer_email=
  row.answerer_email, a.answer_reported= toInteger(row.reported),a.answer_helpful=toInteger(row.helpful)
  RETURN count(row)`
);

const loadPicturesPromiseV1 = session.run(
  `USING PERIODIC COMMIT 1000
  LOAD CSV WITH HEADERS FROM "file:///answers_photos.csv" AS row
  MERGE(pic:Picture {id: toInteger(row.id)})
    SET pic.url=row.url
  RETURN count(row)`
);

const loadPicturesPromiseV2 = session.run(
  `USING PERIODIC COMMIT 1000
  LOAD CSV WITH HEADERS FROM "file:///answers_photos.csv" AS row
  MATCH(answer:Answer {answer_id: toInteger(row.answer_id)})
    SET answer.photos=answer.photos+row.url
  RETURN count(row)`
);

const loadPicturesPromise = session.run(
  `USING PERIODIC COMMIT 1000
  MERGE(pic:Picture {id: toInteger(row.id)})
    SET pic.url=row.url
  RETURN count(row)`
);

const RelateProductQuestionPromise = session.run(
  `USING PERIODIC COMMIT 1000
  LOAD CSV WITH HEADERS FROM "file:///questions.csv" AS row
  MATCH (product:Product {product_id:toInteger(row.product_id)})
  MATCH (question:Question {question_id:toInteger(row.id)})
  MERGE (product)-[r:hasQuestion]->(question)
  RETURN count(r)`
);

const RelateQuestionAnswerPromise = session.run(
  `USING PERIODIC COMMIT 1000
  LOAD CSV WITH HEADERS FROM "file:///answers.csv" AS row
  MATCH (question:Question {question_id:toInteger(row.question_id)})
  MATCH (answer:Answer {answer_id:toInteger(row.id)})
  MERGE (question)-[r:hasAnswer]->(answer)
  RETURN count(r)`
);

const RelateAnswerPicturePromise = session.run(
  `USING PERIODIC COMMIT 1000
  LOAD CSV WITH HEADERS FROM "file:///answers_photos.csv" AS row
  MATCH (answer:Answer {answer_id:toInteger(row.answer_id)})
  MATCH (pic:Picture {id:toInteger(row.id)})
  MERGE (answer)-[r:hasPicture]->(pic)
  RETURN count(r)`
);

// Past iteration of the queries

// const promiseResolver = promise => {
//   promise
//     .then(data => {
//       console.log(data);
//     })
//     .catch(err => {
//       console.log(err.message);
//     });
// };

// promiseResolver(loadProductPromise);

// // createQuestionIndexPromise
//   .then(data => {
//     console.log(data);
//     return loadQuestionPromise;
//   })
//   .then(data => {
//     console.log(data);
//   })
//   .catch(err => {
//     console.log(err.message);
//   });

// createProductIndexPromise
//   .then(data => {
//     console.log(data);
//     return loadPromise;
//   })
//   .then(result => {
//     session.close();
//     // on application exit:
//     driver.close();
//   })
//   .catch(err => {
//     console.log(err.message);
//   });
