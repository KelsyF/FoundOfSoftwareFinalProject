[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/37vDen4S)
# Final Team Project for CS5500

Login with your Northeastern credentials and read the project description [here](https://northeastern-my.sharepoint.com/:w:/g/personal/j_mitra_northeastern_edu/ETUqq9jqZolOr0U4v-gexHkBbCTAoYgTx7cUc34ds2wrTA?e=URQpeI).

## List of features

All the features you have implemented. 

NOTE: All jest tests are located in the subdirectory of server\tests\

| Feature                           | Description                                                                                                       | E2E Tests      | Component Tests | Jest Tests                                                                                |
|-----------------------------------|-------------------------------------------------------------------------------------------------------------------|----------------|-----------------|-------------------------------------------------------------------------------------------|
| User Profiles                     | Personalized profile for each user which stores their contributions to the site.                                  | /path/to/test | path/to/test    | userControllertest.test.js                                                                 |
| Create New Posts                  | Allows users to publish a new question post.                                                                      | /path/to/test | path/to/test    | questionControllertest.test.js                                                             |
| View Posts                        | Allows users to view a post and interact with its related data (comments, answers, votes, tags).                  | /path/to/test | path/to/test    | questionControllertest.test.js                                                             |
| Search for Existing Posts         | Allows users to search for posts by an input phrase.                                                              | /path/to/test | path/to/test    | question.test.js                                                                           |
| Commenting on Posts               | Allows a user to comment to a post (this could be an answer to the question, a follow-up question, or a comment). | /path/to/test | path/to/test    | answerControllertest.test.js                                                               |
| Tagging Posts                     | A list of up to five simple (i.e. one word or groups of words with no spaces) tags can be added to a post.        | /path/to/test | path/to/test    | tags.test.js                                                                               |
| Post Moderation                   | A way to filter out posts that go against community guidelines.                                                   | /path/to/test | path/to/test    | userControllertest.test.js & questionControllertest.test.js & answerControllertest.test.js |
| Filter Posts                      | Allows users to filter the list of posts based on a chosen, existing, criteria.                                   | /path/to/test | path/to/test    | question.test.js                                                                           |


## Instructions to generate and view coverage report 

jest coverage tool:
1. cd .\server\
2. npm run test:coverage

## How to run Docker to Self-Run

1. Docker

In the .\server\config.js & .\server\server.js ensure that:

const MONGO_URL = "mongodb://mongodb:27017/final_fake_so";
//const MONGO_URL = "mongodb://localhost:27017/final_fake_so";

2. Self-Run

In the .\server\config.js & .\server\server.js ensure that:

//const MONGO_URL = "mongodb://mongodb:27017/final_fake_so";
const MONGO_URL = "mongodb://localhost:27017/final_fake_so";

## Extra Credit Section (if applicable)