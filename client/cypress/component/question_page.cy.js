import {UserProvider} from "../../src/components/context/UserContext";
import QuestionPage from "../../src/components/main/questionPage";
import QuestionHeader from "../../src/components/main/questionPage/header";
import OrderButton from "../../src/components/main/questionPage/header/orderButton";
import Question from "../../src/components/main/questionPage/question";
import {REACT_APP_API_URL} from "../../src/services/config";

describe('Question Home Page', () => {

    it('Renders order buttons', () => {
        const message = '٩(⊙‿⊙)۶';
        const setQuestionOrderSpy = cy.spy().as('setQuestionOrderSpy');

        cy.mount(<OrderButton
            message={message}
            setQuestionOrder={setQuestionOrderSpy}/>)

        cy.get('.btn').click();
        cy.get('@setQuestionOrderSpy').should('have.been.calledWith', message);
    });

    it('Renders Question Header', () => {
        const title = 'ಥ_ಥ';
        const count = 2;
        const setQuestionOrderSpy = cy.spy().as('setQuestionOrderSpy');
        const handleNewQuestionSpy = cy.spy().as('handleNewQuestionSpy');

        cy.mount(<QuestionHeader
            title_text={title}
            qcnt={count}
            setQuestionOrder={setQuestionOrderSpy}
            handleNewQuestion={handleNewQuestionSpy}/>)

        cy.get('.bold_title').contains(title);
        cy.get('.bluebtn').click();
        cy.get('@handleNewQuestionSpy').should('have.been.called');
        cy.get('#question_count').contains(count + ' questions');
        cy.get('.btns .btn').eq(0).should('have.text', 'Newest');
        cy.get('.btns .btn').eq(1).should('have.text', 'Active');
        cy.get('.btns .btn').eq(2).should('have.text', 'Unanswered');
        cy.get('.btns .btn').each(($el, index, $list) => {
            cy.wrap($el).click();
            cy.get('@setQuestionOrderSpy').should('have.been.calledWith', $el.text());
        });
    });

    it('Renders Question Body', () => {
        const clickTag = cy.spy().as('clickTagSpy');
        const handleAnswer = cy.spy().as('handleAnswerSpy');
        const handleUsername = cy.spy().as('handleUsernameSpy');
        const refreshQuestions = cy.spy().as('refreshQuestionsSpy');
        const tags = ['sample', 'sample2'];

        const user = {username: 'itsachild12'};
        localStorage.setItem('user', JSON.stringify({user}));

        cy.fixture('question.json').then((question) => {
            // Mount the component with the fixture data
            cy.mount(
                <UserProvider>
                    <Question
                        q={question}
                        clickTag={clickTag}
                        handleAnswer={handleAnswer}
                        handleUsername={handleUsername}
                        refreshQuestions={refreshQuestions}
                    />
                </UserProvider>
            );

            cy.get('.postTitle').contains(question.title);
            cy.get('.postStats').contains(question.answers.length + ' answers');
            cy.get('.postStats').contains(question.views + ' views');
            cy.get(".question_tags").children().each(($child, index, $children) => {
                cy.wrap($child).should("contain", tags[index]);
                cy.wrap($child).click();
            });
            cy.get("@clickTagSpy").should('have.been.calledTwice');
            cy.get('.lastActivity .question_author').contains(question.asked_by.username);
            cy.get('.lastActivity .question_meta').contains('Apr 25 at 06:00:00');
            cy.get('.lastActivity').click();
            cy.get('@handleUsernameSpy').should('have.been.called');
            // Since user that posted question should be logged in, the delete button should be visible
            cy.get('.moderator_action_button').should('exist');
        });
    });
});