import NewAnswer from "../../src/components/main/newAnswer";
import { UserProvider } from "../../src/components/context/UserContext";
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
            </UserProvider>)

        cy.get('#answerTextInput').type('My question of the day is who really likes Koalas??');
        cy.get('.form_postBtn').click();
        cy.wrap(alertStub).should('have.been.calledWith', 'Please log in to answer a question.');
    });

    it('Shows error message when text input is empty', () => {
        const user = { username: 'itsATrap' };

        cy.mount(
            <UserProvider value={user={user}}>
                <NewAnswer/>
            </UserProvider>)

        cy.get('.form_postBtn').click();
        cy.get('.input_error').contains('Answer text cannot be empty');
    });
});