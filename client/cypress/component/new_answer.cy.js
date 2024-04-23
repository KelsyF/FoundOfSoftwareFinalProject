import NewAnswer from "../../src/components/main/newAnswer";
import { UserProvider } from "../../src/components/context/UserContext";

const users = require('../../cypress/fixtures/users.json');
describe('New Answer Page', () => {

    it('Mounts', () => {
        cy.mount(
            <UserProvider>
                <NewAnswer/>
            </UserProvider>)
        cy.get('#answerTextInput');
        cy.get('.form_postBtn');
    });

    it('Shows alert message when no user signed in', () => {
        const alertStub = cy.stub(window, 'alert');

        cy.mount(
            <UserProvider>
                <NewAnswer/>
            </UserProvider>
        )

        cy.get('#answerTextInput').type('My question of the day is who really likes Koalas??');
        cy.get('.form_postBtn').click();
        cy.wrap(alertStub).should('have.been.calledWith', 'Please log in to answer a question.');
    });

    it('Shows error message when text input is empty', () => {
        const user = { username: 'itsATrap' };
        localStorage.setItem('user', JSON.stringify({ user }));

        cy.mount(
            <UserProvider>
                <NewAnswer/>
            </UserProvider>)

        cy.get('.form_postBtn').click();
        cy.get('.input_error').contains('Answer text cannot be empty');
    });

    it('Shows text input by user', () => {

        cy.mount(
            <UserProvider>
                <NewAnswer/>
            </UserProvider>)

        cy.get('#answerTextInput').should('have.value', '');
        cy.get('#answerTextInput').type('My question of the day is, again, WHO LIKES KOALAS??');
        cy.get('#answerTextInput').should('have.value', 'My question of the day is, again, WHO LIKES KOALAS??');
    });
});