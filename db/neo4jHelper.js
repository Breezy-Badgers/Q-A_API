module.exports = {
  getSession: function(context, driver) {
    if (context.neo4jSession) {
      return context.neo4jSession;
    } else {
      context.neo4jSession = driver.session();
      return context.neo4jSession;
    }
  }
};
