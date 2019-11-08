module.exports = {
  getAllQuestions: (productID, currentSession) => {
    return currentSession.run(
      `
      MATCH p=(n:Product{product_id:{ID}})-[:hasQuestion]->(q:Question)-[:hasAnswer]->(a:Answer)
      OPTIONAL MATCH (n:Product{product_id:{ID}})-[:hasQuestion]->(q:Question)-[:hasAnswer]->(a:Answer)-[rPic:hasPicture]->(pic:Picture)
      
            WITH q,
            {id:a.answer_id,
            body:a.answer_body,
            date:a.answer_date,
            answerer_name:a.answer_answerer_name,
            helpfulness:a.answer_helpful,
            photos:collect(pic)} as answ
      
           WITH {
            question_body:q.question_body,
            question_id:q.question_id,
            question_date:q.question_date,
            asker_name:q.question_asker_name,
            question_helpfulness: q.question_helpful,
            reported: q.question_reported,
            answers:collect(answ)
            } as questionResults
            WITH {product_id:{ID}, results:collect(questionResults)} as Result
            RETURN Result
      `,
      { ID: productID }
    );
  }
};

// `
// MATCH p=(n:Product{product_id:1})-[:hasQuestion]->(q:Question)-[:hasAnswer]->(a:Answer)
// OPTIONAL MATCH (n:Product{product_id:1})-[:hasQuestion]->(q:Question)-[:hasAnswer]->(a:Answer)-[rPic:hasPic]->(pic:Picture)

//       WITH q,
//       {id:a.answer_id,
//       body:a.answer_body,
//       date:a.answer_date,
//       answerer_name:a.answer_answerer_name,
//       helpfulness:a.answer_helpful,
//       photos:collect(pic)} as answ

//      WITH {
//       question_body:q.question_body,
//       question_id:q.question_id,
//       question_date:q.question_date,
//       asker_name:q.question_asker_name,
//       question_helpfulness: q.question_helpful,
//       reported: q.question_reported,
//       answers:collect(answ)
//       } as questionResults
//       WITH {product_id:1, results:collect(questionResults)} as Result
//       RETURN Result
// `;
