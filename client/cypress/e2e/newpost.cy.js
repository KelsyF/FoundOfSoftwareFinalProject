//Based off of newquestion.cy.js from react assignment.

describe('New Post Form', () => {

    beforeEach(() => {
        cy.visit('http://localhost:3000');
        cy.login(0)
    })

    it('Ask Question button creates and displays new post in All Questions', () => {
        cy.contains('Ask Question').click();
        cy.get('#formTitleInput').type('Test Question 1');
        cy.get('#formTextInput').type('Test question 1 text.');
        cy.get('#formTagInput').type('javascript');

        //How are we handling username now that we have a logged in profile?
        cy.get('#username')

        cy.contains('Post').click();
        cy.contains('Fake Stack Overflow');

        //Need to add question titles once we've populated our db.
        const qTitles = ['Test Question 1']
        cy.get('.postTitle').each(($el, index, $list) => {
            cy.wrap($el).should('contain', qTitles[index]);
        });
    })
})