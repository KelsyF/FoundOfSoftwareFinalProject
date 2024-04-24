import UserProfile from "../../src/components/main/userProfile";
import {UserProvider} from "../../src/components/context/UserContext";
import { fetchUserPosts, fetchUserAnswers } from "../../src/services/userService";
import {REACT_APP_API_URL} from "../../src/services/config";

describe('User Profile', () => {

    it('renders user profile correctly', () => {

        const user = {username: 'itsachild12'};
        localStorage.setItem('user', JSON.stringify({user}));

        cy.intercept('GET', `${REACT_APP_API_URL}/user/username/itsachild12/posts`, {fixture: 'questions.json'}).as('fetchUserPosts');
        cy.intercept('GET', `${REACT_APP_API_URL}/user/username/itsachild12/answers`, {fixture: 'answer.json'}).as('fetchUserAnswers');
        cy.mount(
            <UserProvider>
            <UserProfile username={user.username}
                         handleAnswer={() => {}}
                         handleQuestions={() => {}} />
            </UserProvider>);

        // Check if the user profile renders correctly
        cy.get('.user-profile').should('exist');
        cy.get('.error').should('not.exist');

    });
});