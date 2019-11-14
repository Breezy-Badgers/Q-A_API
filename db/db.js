module.exports = {
  // getAllQuestions: (productID, currentSession, skip, show) => {
  //   return currentSession.run(
  //     `
  //     MATCH (n:Product{product_id:{ID}})-[:hasQuestion]->(q:Question)
  //     OPTIONAL MATCH (q)-[:hasAnswer]->(a:Answer)
  //     OPTIONAL MATCH (a)-[rPic:hasPicture]->(pic:Picture)
  //     WITH q,
  //         {
  //           id:a.answer_id,
  //           body:a.answer_body,
  //           date:a.answer_date,
  //           answerer_name:a.answer_answerer_name,
  //           helpfulness:a.answer_helpful,
  //           photos:collect(pic)
  //         } as answ

  //     WITH {
  //           question_body:q.question_body,
  //           question_id:q.question_id,
  //           question_date:q.question_date,
  //           asker_name:q.question_asker_name,
  //           question_helpfulness: q.question_helpful,
  //           reported: q.question_reported,
  //           answers:collect(answ)
  //           } as questionResults SKIP {skip} LIMIT {show}
  //     WITH {product_id:{ID}, results:collect(questionResults)} as Result
  //     RETURN Result
  //     `,
  //     { ID: productID, skip: skip, show: show }
  //   );

  // },
  getAllQuestions: (productID, currentSession, skip, show) => {
    return currentSession.run(
      `
      MATCH (n:Product{product_id:{ID}})-[:hasQuestion]->(q:Question)
      OPTIONAL MATCH (q)-[:hasAnswer]->(a:Answer)
      WITH {
            question_body:q.question_body,
            question_id:q.question_id,
            question_date:q.question_date,
            asker_name:q.question_asker_name,
            question_helpfulness: q.question_helpful,
            reported: q.question_reported,
            answers:collect(a)
            } as questionResults SKIP {skip} LIMIT {show}
      WITH {product_id:{ID}, results:collect(questionResults)} as Result
      RETURN Result`,
      { ID: productID, skip: skip, show: show }
    );
  },
  getAllAnswers: (questionId, currentSession, skip, show) => {
    return currentSession.run(
      `
      MATCH (q:Question{question_id:{questionId}})-[:hasAnswer]->(a:Answer)
      OPTIONAL MATCH (q:Question{question_id:{questionId}})-[:hasAnswer]->(a:Answer)-[rPic:hasPicture]->(pic:Picture)
      WITH q,
            {
              id:a.answer_id,
              body:a.answer_body,
              date:a.answer_date,
              answerer_name:a.answer_answerer_name,
              helpfulness:a.answer_helpful,
              photos:collect(pic)
            } as answ SKIP {skip}  LIMIT {show}
  
      WITH {
              question:q.question_id,
              results:collect(answ)
            } as  Result 
      RETURN Result
      `,
      { questionId: questionId, skip: skip, show: show }
    );
  },

  markQuestionHelpful: (questionId, currentSession) => {
    return currentSession.run(
      `
      MATCH (q:Question {question_id:{questionId}})
      SET q.question_helpful=q.question_helpful+1
      Return q
      `,
      { questionId }
    );
  },
  reportQuestion: (questionId, currentSession) => {
    return currentSession.run(
      `
      MATCH (q:Question {question_id:{questionId}})
      SET q.question_reported=q.question_reported+1
      Return q
      `,
      { questionId }
    );
  },

  markAnswerHelpful: (answer_id, currentSession) => {
    return currentSession.run(
      `
      MATCH (a:Answer {answer_id:{answer_id}})
      SET a.answer_helpful=a.answer_helpful+1
      Return a
      `,
      { answer_id }
    );
  },
  reportAnswer: (answer_id, currentSession) => {
    return currentSession.run(
      `
      MATCH (a:Answer {answer_id:{answer_id}})
      SET a.answer_reported=a.answer_reported+1
      Return a
      `,
      { answer_id }
    );
  },
  addQuestion: (product_id, data, currentSession) => {
    return currentSession.run(
      `
      MATCH (c:trackCount {id:1})
      MATCH (p:Product {product_id:{product_id}})
      MERGE (q:Question {question_id:c.question_count})
      SET q.question_body={body},
      q.question_date= {date},
      q.question_asker_name={name},
      q.question_asker_email={email},
      q.question_helpful=0,
      q.question_reported=0,
      c.answer_count=c.question_count+1
      MERGE (p)-[r:hasQuestion]->(q)
      Return q.question_id
      `,
      { product_id, ...data }
    );
  },
  addAnswer: (question_id, data, currentSession) => {
    let query = `
    MATCH (c:trackCount {id:1})
    MATCH (q:Question {question_id:{question_id}})
    MERGE (a:Answer {answer_id:c.answer_count})
    SET a.answer_body={body},
    a.answer_date= {date},
    a.answer_answerer_name={name},
    a.answer_answerer_email={email},
    a.answer_helpful=0,
    a.answer_reported=0,
    c.answer_count=c.answer_count+1
    MERGE (q)-[r:hasAnswer]->(a)
    `;
    if (data.photos) {
      for (let i = 0; i < data.photos.length; i++) {
        let photoQuery = `
        MERGE (pic${i}:Picture {id:c.picture_count})
        SET c.picture_count=c.picture_count+1
        SET pic${i}.url = "${data.photos[i]}"
        MERGE (a)-[:hasPicture]->(pic${i})
        `;
        query = query + photoQuery;
      }
    }

    return currentSession.run(query, { question_id, ...data });
  }
};

//without the answer_photos_Node
// module.exports = {
//   getAllQuestions: (productID, currentSession) => {
//     return currentSession.run(
//       `
// MATCH (n:Product{product_id:{ID}})-[:hasQuestion]->(q:Question)
// OPTIONAL MATCH (n:Product{product_id:{ID}})-[:hasQuestion]->(q:Question)-[:hasAnswer]->(a:Answer)
// WITH {
//  question_body:q.question_body,
//  question_id:q.question_id,
//  question_date:q.question_date,
//  asker_name:q.question_asker_name,
//  question_helpfulness: q.question_helpful,
//  reported: q.question_reported,
//  answers:collect(a)
//  } as questionResults
//  WITH {product_id:{ID}, results:collect(questionResults)} as Result
//  RETURN Result`,
// { ID: productID }
//     );
//   }
// };

// `
// MATCH p=(n:Product{product_id:1})-[:hasQuestion]->(q:Question)-[:hasAnswer]->(a:Answer)

//      WITH {
//       question_body:q.question_body,
//       question_id:q.question_id,
//       question_date:q.question_date,
//       asker_name:q.question_asker_name,
//       question_helpfulness: q.question_helpful,
//       reported: q.question_reported,
//       answers:collect(a)
//       } as questionResults
//       WITH {product_id:1, results:collect(questionResults)} as Result
//       RETURN Result
// `;

// MATCH (n:Product{product_id:{ID}})-[:hasQuestion]->(q:Question)
// OPTIONAL MATCH (n:Product{product_id:{ID}})-[:hasQuestion]->(q:Question)-[:hasAnswer]->(a:Answer)
// OPTIONAL MATCH (n:Product{product_id:{ID}})-[:hasQuestion]->(q:Question)-[:hasAnswer]->(a:Answer)-[rPic:hasPicture]->(pic:Picture)
