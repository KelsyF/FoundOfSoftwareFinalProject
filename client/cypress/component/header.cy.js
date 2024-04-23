import Header from '../../src/components/header';
import { UserProvider } from '../../src/components/context/UserContext';
describe('Header', () => {

    it('Header shows title, search bar, handles login and register onclick events when no user', () => {
        const setQuestionPage = cy.spy().as('setQuestionPageSpy');
        const searchQuery = '';

        cy.mount(
            < UserProvider>
                <Header
                    search={searchQuery}
                    setQuestionPage={setQuestionPage}
                />
            </UserProvider>)

        cy.get('#searchBar').should('have.value', searchQuery);
        cy.get('#searchBar').should('have.attr', 'placeholder');
        cy.get('.title').contains('Fake Stack Overflow');
        cy.get('button').each(($button, index) => {
            cy.wrap($button).click();
        });
        cy.get('@setQuestionPageSpy').should('have.been.calledTwice');
    });

    //Not working, need to figure out login dupe
    it('Header shows title, search bar, signed in user welcome and handles logout onclick event when user is signed in', () => {
        const setQuestionPage = cy.spy().as('setQuestionPageSpy');
        const searchQuery = '';
        const user = { username: 'woahItMe' };
        localStorage.setItem('user', JSON.stringify({ user }));

        cy.mount(
            <UserProvider>
                <Header
                    search={searchQuery}
                    setQuestionPage={setQuestionPage}
                />
            </UserProvider>
        )

        cy.get('#searchBar').should('have.value', searchQuery);
        cy.get('#searchBar').should('have.attr', 'placeholder');
        cy.get('.title').contains('Fake Stack Overflow');
        cy.get('span').should('contain', `Welcome, ${user.username}!`)
        cy.get('button').click();
        cy.get('@setQuestionPageSpy').should('have.been.called');
    });

});