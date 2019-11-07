const getAllQuestions = productID => {
  return session.run(
    `MATCH (product:Product{product_id:{product_ID}})-->(question:Question)-->(answer:Answer)
    RETURN x,collect(answer)`,
    { product_ID: productID }
  );
};
