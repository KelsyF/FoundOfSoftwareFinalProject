
# Final Team Project for CS5500

Login with your Northeastern credentials and read the project description [here](https://drive.google.com/file/d/1dYVK6U2OV5zou45EL_9B8v2hQgrX-Kce/view?usp=sharing).

## List of features

All the features you have implemented. 


NOTE: All jest tests are located in the subdirectory of server\tests\

| Feature                           | Description                                                                                                       | E2E Tests                                         | Component Tests                              | Jest Tests                                                                                |
|-----------------------------------|-------------------------------------------------------------------------------------------------------------------|---------------------------------------------------|----------------------------------------------|-------------------------------------------------------------------------------------------|
| User Profiles                     | Personalized profile for each user which stores their contributions to the site.                                  | client/cypress/e2e/1_userprofiles.cy.js           | client/cypress/component/user_profile.cy.js  | userControllertest.test.js                                                                 |
| Create New Posts                  | Allows users to publish a new question post.                                                                      | client/cypress/e2e/2_createnewpost.cy.js          | client/cypress/component/new_question.cy.js  | questionControllertest.test.js                                                             |
| View Posts                        | Allows users to view a post and interact with its related data (comments, answers, votes, tags).                  | client/cypress/e2e/4_viewposts.cy.js              | client/cypress/component/question_page.cy.js | questionControllertest.test.js                                                             |
| Search for Existing Posts         | Allows users to search for posts by an input phrase.                                                              | client/cypress/e2e/6_searchforexistingposts.cy.js | client/cypress/component/header.cy.js        | question.test.js                                                                           |
| Commenting on Posts               | Allows a user to comment to a post (this could be an answer to the question, a follow-up question, or a comment). | client/cypress/e2e/3_commentingonposts.cy.js      | client/cypress/component/new_answer.cy.js    | answerControllertest.test.js                                                               |
| Tagging Posts                     | A list of up to five simple (i.e. one word or groups of words with no spaces) tags can be added to a post.        | client/cypress/e2e/5_tags.cy.js                   | client/cypress/component/tag_page.cy.js      | tags.test.js                                                                               |
| Post Moderation                   | A way to filter out posts that go against community guidelines.                                                   | client/cypress/e2e/8_postmoderation.cy.js         | n/a                                          | userControllertest.test.js & questionControllertest.test.js & answerControllertest.test.js |
| Filter Posts                      | Allows users to filter the list of posts based on a chosen, existing, criteria.                                   | client/cypress/e2e/7_filterposts.cy.js            | n/a                                          | question.test.js                                                                           |



## Instructions to generate and view coverage report 

jest coverage tool:
1. cd .\server\
2. npm run test:coverage

cypress coverage tool:
1. cd client
2. npx cypress open
   1. e2e tests
   2. run finalfakeso.cy.js - this file has all of the 1 - 8 testing specs combined (hence the naming scheme)
   3. cd client\coverage\lcov-report
   4. open index.html in your browser of choice

## Moderation Notes
In order to sign into the moderator account 
username: moderator
password: M1

This would not be used in final production, this is set for graders ease of use.

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
