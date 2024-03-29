module.exports = {
  getAllQuestions: (productID, currentSession, skip, show) => {
    return currentSession.run(
      `
      MATCH (n:Product{product_id: ID})-[:hasQuestion]->(results:Question)
      OPTIONAL MATCH (results)-[:hasAnswer]->(answers:Answer)
      RETURN results,collect(answers) as answers SKIP {skip} LIMIT {show}`,
      { ID: productID, skip: skip, show: show }
    );
  },

  getAllAnswers: (questionId, currentSession, skip, show) => {
    return currentSession.run(
      `
      MATCH (question:Question{question_id:{questionId}})-[:hasAnswer]->(a:Answer)
      OPTIONAL MATCH (a:Answer)-[rPic:hasPicture]->(pic:Picture) 
      RETURN question, collect(a) as results SKIP {skip} LIMIT {show}
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
