# Q-A_API
# ShopBox Questions and Answers API Documentation

<!-- INSERT GIF OF OVERALL APP HERE -->

The goal of this project was to design a system that can at least handle 100 requests per second across 8 endpoints to serve a Questions and Answers component for an e-commerce application. 

Data to be the generated came from 3 csv's with millions of records. The provided csv's were one containing questions, answers, photos related to specific answer. Due to handle the relational nature of the provided data, Neo4J was selected as the database. 

A Cloud Architecture was created on AWS EC2, with Express server containerized with Docker, Neo4J, and Custom built load balancer to horizontally scale the application. With the architecture in place, the api could handle 1000 requests per second with two servers running.

<p align="center">
<img src="https://go.neo4j.com/rs/710-RRC-335/images/neo4j_logo.png" width="300" height="150">
<img src="https://cdn.vox-cdn.com/thumbor/fbrTLtxuP2D29o8VJUaE-u3NKfU=/0x0:792x613/1200x800/filters:focal(300x237:426x363)/cdn.vox-cdn.com/uploads/chorus_image/image/59850273/Docker_logo_011.0.png" width="300" height="150">
<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Amazon_Web_Services_Logo.svg/1280px-Amazon_Web_Services_Logo.svg.png" width="300" height="150">
</p>




## Table of Contents

  - [Table of Contents](#table-of-contents)
  - [Installing-Dependencies](#installing-dependencies)
  - [Technologies-Used](#technologies-used)
  - [Requirements](#requirements)
  - [Routes](#routes)
  - [Notes](#notes)

## Installing-Dependencies

> Navigate to the root directory and run the following scripts to run locally

- `npm install` - install dependencies
- `npm start` - start the server in production

* Navigate to http://localhost:8080/

## Technologies-Used

> Back-End

- [Node.js](https://nodejs.org/en/)
- [Express](https://expressjs.com)
- [Neo4J](https://https://neo4j.com/)
- [Docker](https://www.docker.com)


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


# Questions and Answers API
### List Questions

`GET /qa/:product_id`
Retrieves a list of questions for a particular product.  This list *does not* include any reported questions.

Parameters

| Parameter  | Type    | Description                                               |
| ---------- | ------- | --------------------------------------------------------- |
| product_id | integer | Specifies the product for which to retrieve questions.    |
| page       | integer | Selects the page of results to return.  Default 1.        |
| count      | integer | Specifies how many results per page to return. Default 5. |

Response

`Status: 200 OK `

```json
{
  "product_id": "5",
  "results": [{
        "question_id": 37,
        "question_body": "Why is this product cheaper here than other sites?",
        "question_date": "2018-10-18T00:00:00.000Z",
        "asker_name": "williamsmith",
        "question_helpfulness": 4,
        "reported": 0,
        "answers": [
          {
            "id": 68,
            "body": "We are selling it here without any markup from the middleman!",
            "date": "2018-08-18T00:00:00.000Z",
            "answerer_name": "Seller",
            "helpfulness": 4,
            "photos": []
            // ...
          }
        ]
      },
      {
        "question_id": 38,
        "question_body": "How long does it last?",
        "question_date": "2019-06-28T00:00:00.000Z",
        "asker_name": "funnygirl",
        "question_helpfulness": 2,
        "reported": 0,
        "answers": [
          {
            "id": 70,
            "body": "Some of the seams started splitting the first time I wore it!",
            "date": "2019-11-28T00:00:00.000Z",
            "answerer_name": "sillyguy",
            "helpfulness": 6,
            "photos": [],
          },
          {
            "id": 78,
            "body": "9 lives",
            "date": "2019-11-12T00:00:00.000Z",
            "answerer_name": "iluvdogz",
            "helpfulness": 31,
            "photos": [],
          }
        ]
      },
      // ...
  ]
}
```



### Answers List

Returns answers for a given question. This list *does not* include any reported answers.

`GET /qa/:question_id/answers`

Parameters

| Parameter   | Type    | Description                                               |
| ----------- | ------- | --------------------------------------------------------- |
| question_id | integer | Required ID of the Question requested                     |
| page        | integer | Selects the page of results to return.  Default 1.        |
| count       | integer | Specifies how many results per page to return. Default 5. |

Response

`Status: 200 OK `

```json
{
  "question": "1",
  "page": 0,
  "count": 5,
  "results": [
    {
      "answer_id": 8,
      "body": "What a great question!",
      "date": "2018-01-04T00:00:00.000Z",
      "answerer_name": "metslover",
      "helpfulness": 8,
      "photos": [],
    },
    {
      "answer_id": 5,
      "body": "Something pretty durable but I can't be sure",
      "date": "2018-01-04T00:00:00.000Z",
      "answerer_name": "metslover",
      "helpfulness": 5,
      "photos": [{
          "id": 1,
          "url": "urlplaceholder/answer_5_photo_number_1.jpg"
        },
        {
          "id": 2,
          "url": "urlplaceholder/answer_5_photo_number_2.jpg"
        },
        // ...
      ]
    },
    // ...
  ]
}
```



### Add a Question

Adds a question for the given product

`POST /qa/:product_id`

Parameters

| Parameter  | Type    | Description                                         |
| ---------- | ------- | --------------------------------------------------- |
| product_id | integer | Required ID of the Product to post the question for |

Body Parameters

| Parameter | Type | Description                      |
| --------- | ---- | -------------------------------- |
| body      | text | Text of question being asked     |
| name      | text | Username for question asker      |
| email     | text | Email address for question asker |

Response

`Status: 201 CREATED `



### Add an Answer

Adds an answer for the given question

`POST /qa/:question_id/answers`

Parameters

| Parameter   | Type    | Description                                        |
| ----------- | ------- | -------------------------------------------------- |
| question_id | integer | Required ID of the question to post the answer for |

Body Parameters

| Parameter | Type   | Description                                         |
| --------- | ------ | --------------------------------------------------- |
| body      | text   | Text of question being asked                        |
| name      | text   | Username for question asker                         |
| email     | text   | Email address for question asker                    |
| photos    | [text] | An array of urls corresponding to images to display |

Response

`Status: 201 CREATED `



### Mark Question as Helpful

Updates a question to show it was found helpful.

`PUT /qa/question/:question_id/helpful`

Parameters

| Parameter   | Type    | Description                           |
| ----------- | ------- | ------------------------------------- |
| question_id | integer | Required ID of the question to update |

Response

`Status: 204 NO CONTENT `



### Report Question

Updates a question to show it was reported. Note, this action does not delete the question, but the question will not be returned in the above GET request.

`PUT /qa/question/:question_id/report`

Parameters

| Parameter   | Type    | Description                           |
| ----------- | ------- | ------------------------------------- |
| question_id | integer | Required ID of the question to update |

Response

`Status: 204 NO CONTENT `



### Mark Answer as Helpful

Updates an answer to show it was found helpful.

`PUT /qa/answer/:answer_id/helpful`

Parameters

| Parameter | Type    | Description                         |
| --------- | ------- | ----------------------------------- |
| answer_id | integer | Required ID of the answer to update |

Response

`Status: 204 NO CONTENT `



### Report Answer

Updates an answer to show it has been reported.  Note, this action does not delete the answer, but the answer will not be returned in the above GET request.

`PUT /qa/answer/:answer_id/report`

Parameters

| Parameter | Type    | Description                         |
| --------- | ------- | ----------------------------------- |
| answer_id | integer | Required ID of the answer to update |

Response

`Status: 204 NO CONTENT `