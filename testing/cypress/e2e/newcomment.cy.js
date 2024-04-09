//Based off of soa-node-mongo cypress tests repeated from React assignment.

describe('New Comment Page', () => {
    beforeEach(() => {
        // Seed the database before each test
        cy.exec("node ../server/init.js");
        cy.login(0);
    });

    afterEach( () => {
        //Clear the database after each test
        cy.exec("node ../server/destroy.js");
    })

    it('Created new comment should be displayed at the top of the answers page', () => {
        const comments = [
            "Test Answer 1",
            "React Router is mostly a wrapper around the history library. history handles interaction with the browser's " +
            "window.history for you with its browser and hash histories. It also provides a memory history which is useful " +
            "for environments that don't have a global history. This is particularly useful in mobile app development " +
            "(react-native) and unit testing with Node.",
            "On my end, I like to have a single history object that I can carry even outside components. I like to have " +
            "a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter " +
            "to Router, and specify the history prop. This doesn't change anything for you, except that you have your " +
            "own history object that you can manipulate as you want. You need to install history, the library used " +
            "by react-router.",
        ];
        cy.visit("http://localhost:3000");
        cy.contains("Programmatically navigate using React router").click();
        cy.contains("Answer Question").click();

        // How are we handling username now that we have a logged in profile?
        // If the login function in beforeEach works, will we even need to grab the username
        // since we'll grab the username in the question creation and won't have to input it?
        cy.get(".username")
        cy.get("#answerTextInput").type(comments[0]);
        cy.contains("Post Answer").click();
        cy.get(".answerText").each(($el, index) => {
            cy.contains(comments[index]);
        });
        cy.contains(".username");
        cy.contains('0 seconds ago');
    });

    it('Text is mandatory when creating a new comment', () => {
        cy.visit("http://localhost:3000");
        cy.contains("Programatically navigate using React router").click();
        cy.contains("Answer Question").click();

        //see line 32
        cy.get(".username");
        cy.contains("Post Answer").click();
        cy.contains("Answer text cannot be empty");
    });

    it('Checks if a6 and a7 exist in q3 answers page', () => {
        const answers = [
            "Using GridFS to chunk and store content.",
            "Storing content as BLOBs in databases.",
        ];
        cy.visit("http://localhost:3000");
        cy.contains("Object storage for a web application").click();
        cy.get(".answerText").each(($el, index) => {
            cy.contains(answers[index]);
        });
    });

    it('Checks if a8 exists in q4 answers page', () => {
        cy.visit("http://localhost:3000");
        cy.contains("Quick question about storage on android").click();
        cy.contains("Store data in a SQLLite database.");
    });

    it('Checks to make sure a newly created comment is displayed at the top of the answers page', () => {
        cy.visit("http://localhost:3000");
        cy.contains("Programmatically navigate using React router").click();
        cy.contains("Answer Question").click();

        //see line 32
        cy.get(".username");
        cy.get("#answerTextInput").type(
            "I wish there was a link I could check for more info."
        );
        cy.contains("Post Answer").click();
        cy.get(".answerText")
            .first()
            .within(() => {
                cy.contains('I wish there was a link I could check for more info.');
            });
        cy.contains(".username");
        cy.contains("0 seconds ago");
    });
});