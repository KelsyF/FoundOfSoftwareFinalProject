import Header from '../../src/components/main/answerPage/header';
import QuestionBody from '../../src/components/main/answerPage/questionBody'
import Answer from '../../src/components/main/answerPage/answer';
import AnswerPage from '../../src/components/main/answerPage';
import {REACT_APP_API_URL} from "../../src/services/config";
import { UserProvider } from '../../src/components/context/UserContext';

describe('Answer Page', () => {
    // Answer page - Header
    it('Answer Header component shows question title, answer count and onclick function', () => {
        const answerCount = 3;
        const title = 'android studio save string shared preference, start activity and load the saved string';
        const handleNewQuestion = cy.spy().as('handleNewQuestionSpy');

        cy.mount(<Header
            ansCount={answerCount}
            title={title}
            handleNewQuestion={handleNewQuestion}/>);

        cy.get('.bold_title').contains(answerCount + " answers");
        cy.get('.answer_question_title').contains(title);
        cy.get('.bluebtn').click();
        cy.get('@handleNewQuestionSpy').should('have.been.called');
    });

    // Answer Page - Question Body
    it('Component should have a question body which shows question text, views, asked by, asked, and onclick function', () => {
        const questionBody = 'Sample Question Body';
        const views = '150';
        const user = {username: 'vanshitatilwani'};
        const askedBy = 'vanshitatilwani';
        const date = new Date().toLocaleString();
        localStorage.setItem('user', JSON.stringify({ user }));

        const handleUsername = cy.spy().as('handleUsernameSpy');

        cy.mount(
            <UserProvider>
                <QuestionBody
                    views={views}
                    text={questionBody}
                    askby={user}
                    meta={date}
                    handleUsername={handleUsername}
                    onDelete={handleDeleteAnswer}
                />
            </UserProvider>)

        cy.get('.answer_question_text').contains(questionBody);
        cy.get('.answer_question_view').contains(views + ' views');
        cy.get('.question_author').contains(askedBy);
        cy.get('.answer_question_meta').contains('asked ' + date);
        cy.get('.answer_question_right').click();
        cy.get('@handleUsernameSpy').should('have.been.called');
    });

    // Answer Page - Question Body while Moderator
    it('Component should have a question body which shows question text, views, asked by, asked, and delete shows when signed in user is moderator', () => {
        const questionBody = 'Sample Question Body';
        const views = '150';
        const user = { username: 'moderator' };
        const user2 = { username: 'vanshitatilwani' };
        const askedBy = 'vanshitatilwani';
        const date = new Date().toLocaleString();
        localStorage.setItem('user', JSON.stringify({ user }));

        const handleUsername = cy.spy().as('handleUsernameSpy');

        cy.mount(
            <UserProvider>
                <QuestionBody
                    qid={'testQ'}
                    views={views}
                    text={questionBody}
                    askby={user2}
                    meta={date}
                    handleUsername={handleUsername}
                    onDelete={handleDeleteAnswer}
                />
            </UserProvider>)

        cy.get('.answer_question_text').contains(questionBody);
        cy.get('.answer_question_view').contains(views + ' views');
        cy.get('.question_author').contains(askedBy);
        cy.get('.answer_question_meta').contains('asked ' + date);
        cy.get('.answer_question_right').click();
        cy.get('@handleUsernameSpy').should('have.been.called');
        cy.get('.moderator_action_button').should('exist');
    });

    // Answer Page - Answer component
    it('Component should have an answer text, answered by and answered date', () => {
        const answerText = 'Sample Answer Text'
        const user = {username: 'joydeepmitra'};
        const answeredBy = 'joydeepmitra'
        const date = new Date().toLocaleString()
        localStorage.setItem('user', JSON.stringify({ user }));


        cy.mount(
            <UserProvider>
                <Answer
                    text={answerText}
                    ansBy={user}
                    meta={date}
                />
            </UserProvider>)

        cy.get('.answerText').contains(answerText)
        cy.get('.answer_author').contains(answeredBy)
        cy.get('.answer_question_meta').contains(date)
    });

// Answer Page  - Main Component
    it('Render a Answer Page Component and verify all details', () => {
        const handleNewQuestion = cy.spy().as('handleNewQuestionSpy');
        const handleNewAnswer = cy.spy().as('handleNewAnswerSpy');
        const handleUsername = cy.spy().as('handleUsernameSpy');
        const handleQuestions = cy.spy().as('handleQuestionsSpy')
        const user = {username: 'itsachild12'};
        const usernames = ['sampleanswereduser2', 'sampleanswereduser1'];
        const answerText = ['Sample Answer Text 2', 'Sample Answer Text 1'];
        const answerDate = ['Apr 25 at 06:10:00', 'Apr 25 at 06:05:00'];
        localStorage.setItem('user', JSON.stringify({ user }));

        let question = {
            _id: 1,
            title: 'Sample Question Title',
            text: 'Sample Question Text',
            asked_by: user,
            ask_date_time: new Date(),
            views: 150,
        };

        cy.intercept('GET', `${REACT_APP_API_URL}/question/getQuestionById/*`, {fixture: 'question.json'}).as('getQuestionById');

        cy.mount(
            <UserProvider>
                <AnswerPage
                    qid={question._id}
                    handleNewQuestion={handleNewQuestion}
                    handleNewAnswer={handleNewAnswer}
                    handleUsername={handleUsername}
                    handleQuestions={handleQuestions}
                />
            </UserProvider>
        )

        cy.wait('@getQuestionById');

        cy.get('.bold_title').contains(2 + " answers")
        cy.get('.answer_question_title').contains(question.title)
        cy.get('#answersHeader > .bluebtn').click()
        cy.get('@handleNewQuestionSpy').should('have.been.called');

        cy.get('.answer_question_text').contains(question.text)
        cy.get('.answer_question_view').contains(question.views + ' views')
        cy.get('.question_author').contains(user.username)

        cy.get('.answer').each(($answer, index) => {
            cy.wrap($answer).within(() => {
                cy.get('.answerText').should('contain', answerText[index]);
                cy.get('.answer_author').should('contain', usernames[index]);
                cy.get('.answer_question_meta').should('contain', answerDate[index]);
            })
        })

        cy.get('.ansButton').click();
        cy.get('@handleNewAnswerSpy').should('have.been.called');

    });
});