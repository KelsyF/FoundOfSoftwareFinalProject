//Based off of newquestion.cy.js from react assignment.

describe('New Post Form', () => {
    it('Ask Question button creates and displays new post in All Questions', () => {
        cy.visit('http://localhost:3000');

        //We can look into making this log in a command in the support/commands.js file.
        cy.contains('Log in').click();
        cy.get('#formUsername').type('testUser1');
        cy.get('#formPassword').type('badpass1');
        //Check login is successful:
        cy.location("pathname").should("include", "/profile");

        cy.contains('Ask Question').click();
        cy.get('#formTitleInput').type('Test Question 1');
        cy.get('#formTestInput').type('Test question 1 text.');
        cy.get('#formTagInput').type('javascript test-1');
        //How will we be implementing this considering our user profile setup?
        cy.get('#username')
    })
})