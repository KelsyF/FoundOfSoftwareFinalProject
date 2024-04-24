import UserProfile from "../../src/components/main/userProfile";
import {UserProvider} from "../../src/components/context/UserContext";
import { fetchUserPosts, fetchUserAnswers } from "../../src/services/userService";
import {REACT_APP_API_URL} from "../../src/services/config";

describe('User Profile', () => {

    it('renders user profile correctly', () => {

        const user = {username: 'itsachild12'};
        localStorage.setItem('user', JSON.stringify({user}));

        const titles = ['Sample Question Title',
            'Sample Question Title2',
            "Answer Text: Sample Answer Text 1",
            "Answer Text: Sample Answer Text 2"];

        cy.intercept('GET', `${REACT_APP_API_URL}/user/username/itsachild12/posts`, {fixture: 'questions.json'}).as('fetchUserPosts');
        cy.intercept('GET', `${REACT_APP_API_URL}/user/username/itsachild12/answers`, {fixture: 'answer.json'}).as('fetchUserAnswers');
        cy.mount(
            <UserProvider>
            <UserProfile username={user.username}
                         handleAnswer={() => {}}
                         handleQuestions={() => {}} />
            </UserProvider>);

        cy.wait('@fetchUserPosts');
        cy.wait('@fetchUserAnswers');

        // Check if the user profile renders correctly
        cy.get('.user-profile').should('exist');
        cy.get('.error').should('not.exist');
        cy.get('.user-profile li').each(($li, index) => {
            cy.wrap($li).contains(titles[index])
        });
    });
});