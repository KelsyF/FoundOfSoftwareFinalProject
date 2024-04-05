//Based off of newquestion.cy.js from react assignment.

describe('New Post Form', () => {

    beforeEach(() => {
        cy.visit('http://localhost:3000');
        cy.login(0)
    })

    it('Ask Question button creates and displays new post in All Questions', () => {

        cy.contains('Ask Question').click();
        cy.get('#formTitleInput').type('Test Question 1');
        cy.get('#formTestInput').type('Test question 1 text.');
        cy.get('#formTagInput').type('javascript test-1');
        //How will we be implementing this considering our user profile setup?
        cy.get('#username')
    })
})