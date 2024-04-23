import {UserProvider} from "../../src/components/context/UserContext";
import NewQuestion from "../../src/components/main/newQuestion";
import {REACT_APP_API_URL} from "../../src/services/config";
import { addQuestion } from "../../src/services/questionService";

describe('New Question Page', () => {

    it('Mounts', () => {
        cy.mount(
            <UserProvider>
                <NewQuestion/>
            </UserProvider>
        )

        cy.get('#formTitleInput');
        cy.get('#formTextInput');
        cy.get('#formTagInput');
        cy.get('.form_postBtn');
    });

    it('Shows alert message when no user signed in', () => {
        const alertStub = cy.stub(window, 'alert');

        cy.mount(
            <UserProvider>
                <NewQuestion/>
            </UserProvider>
        )

        cy.get('#formTitleInput').type('Lots of love today folks');
        cy.get('#formTextInput').type("I swear, I never knew llamas were so soft!");
        cy.get('#formTagInput').type("llama today");
        cy.get('.form_postBtn').click();
        cy.wrap(alertStub).should('have.been.calledWith', 'Please log in to post a question.');
    });

    it('Shows title that\'s been input by user', () => {
        const user = {username: 'itsATrap'};
        localStorage.setItem('user', JSON.stringify({user}));

        cy.mount(
            <UserProvider>
                <NewQuestion/>
            </UserProvider>
        )

        cy.get('#formTitleInput').should('have.value', '');
        cy.get('#formTitleInput').type('Lots of love today folks');
        cy.get('#formTitleInput').should('have.value', 'Lots of love today folks');
    });

    it('Shows text that\'s been input by user', () => {
        const user = {username: 'itsATrap'};
        localStorage.setItem('user', JSON.stringify({user}));

        cy.mount(
            <UserProvider>
                <NewQuestion/>
            </UserProvider>
        )

        cy.get('#formTextInput').should('have.value', '');
        cy.get('#formTextInput').type('I swear, I never knew llamas were so soft!');
        cy.get('#formTextInput').should('have.value', 'I swear, I never knew llamas were so soft!');
    });

    it('Shows tags that\'ve been input by user', () => {
        const user = {username: 'itsATrap'};
        localStorage.setItem('user', JSON.stringify({user}));

        cy.mount(
            <UserProvider>
                <NewQuestion/>
            </UserProvider>
        )

        cy.get('#formTagInput').should('have.value', '');
        cy.get('#formTagInput').type('llama today');
        cy.get('#formTagInput').should('have.value', 'llama today');
    });

    it('Shows error message when inputs are empty', () => {
        const user = {username: 'itsATrap'};
        localStorage.setItem('user', JSON.stringify({user}));

        cy.mount(
            <UserProvider>
                <NewQuestion/>
            </UserProvider>
        )

        cy.get(".form_postBtn").click();
        cy.get('div .input_error').contains("Title cannot be empty");
        cy.get('div .input_error').contains("Question text cannot be empty");
        cy.get('div .input_error').contains("Should have at least 1 tag");
    });

    it('Shows error message when title is longer than 100 characters and there are more than 5 tags', () => {
        const user = {username: 'itsATrap'};
        localStorage.setItem('user', JSON.stringify({user}));

        cy.mount(
            <UserProvider>
                <NewQuestion/>
            </UserProvider>
        )

        cy.get('#formTitleInput').type('Lots of love today folks it\'s honestly crazy how wonderful of a day I\'m having, wow, how great and cool, noice, thank you guys!');
        cy.get('#formTextInput').type("I swear, I never knew llamas were so soft!");
        cy.get('#formTagInput').type("llama today great cool amazing wow how-nice");

        cy.get(".form_postBtn").click();

        cy.get('div .input_error').contains("Title cannot be more than 100 characters");
        cy.get('div .input_error').contains("Cannot have more than 5 tags");
    });
});