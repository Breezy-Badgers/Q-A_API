# Q-A_API
# Green Field Questions and Answers API Documentation

<!-- INSERT GIF OF OVERALL APP HERE -->

The goal of this project was to design a system that can at least handle 100 requests per second across 8 endpoints to serve a Questions and Answers component for an e-commerce application. 

Data to be the generated came from 3 csv's with millions of records. The provided csv's were one containing questions, answers, photos related to specific answer. Due to handle the relational nature of the provided data, Neo4J was selected as the database. 

A Cloud Architecture was created on AWS EC2, with Express server containerized with Docker, Neo4J, and Custom built load balancer to horizontally scale the application. With the architecture in place, the api could handle 1000 requests per second with two servers running.

<p align="center">
<img src="https://go.neo4j.com/rs/710-RRC-335/images/neo4j_logo.png">
</p>

> - 🐘 Postgres
> - 🐋 Docker
> - 🐋 Docker


## Table of Contents

  - [Table of Contents](#table-of-contents)
  - [Installing-Dependencies](#installing-dependencies)
  - [Technologies-Used](#technologies-used)
  - [Requirements](#requirements)
  - [Routes](#routes)
  - [API](#api)
  - [Engineering Journal](#engineering-journal)
  - [Notes](#notes)

## Installing-Dependencies

> Navigate to the root directory and run the following scripts to run locally

- `npm install` - install dependencies
- `npm start` - start the server in production

* Navigate to http://localhost:4000/

## Technologies-Used

> Back-End

- [Node.js](https://nodejs.org/en/)
- [Express](https://expressjs.com)
- [Postgres](https://www.postgresql.org/)
- [Docker](https://www.docker.com)
- [Redis](https://redis.io/)


> Continuous Integration

- [Travis](https://travis-ci.org/)

> Testing Suite

- [Jest](https://jestjs.io/docs/en/api)
- [Frisbby](https://www.frisbyjs.com/)

## Requirements

Ensure that the following modules are installed before running `npm install`

- Node v10.13.0 or higher

## Routes

> Listed are available routes that can be handled by the API.

| Request Type | Endpoint                          | Returns                                                                                                               | Status |
| ------------ | --------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ------ |
| GET          | /qa/:productId                    | An object containing questions related to a particular product along with answers/photos associated with the question | 200    |
| GET          | /qa/:questionId/answers           | An object cotaining answers and photos related a question                                                             | 200    |
| POST         | /qa/:productId                    | Nothing is returned but serves a route to post questions about specific product                                       | 201    |
| POST         | /qa/:questionId/answers           | Nothing is returned but this route serves handling posting answers about a specfic question                           | 201    |
| PUT          | /qa/question/:question_id/helpful | A counter associated with the question is incremented up                                                              | 204    |
| PUT          | /qa/question/:question_id/report  | The question will not get deleted but it will no longer be returned upon making a GET request for the questions route | 204    |
| PUT          | /qa/answer/:answer_id/helpful     | A counter associated with the question is incremented up                                                              | 204    |
| PUT          | /qa/answer/:answer_id/report      | The specific response will no longer be returned  upon making a GET request to the answers route                      | 204    |

## API