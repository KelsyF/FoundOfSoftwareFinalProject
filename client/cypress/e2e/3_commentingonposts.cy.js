//Based off of soa-node-mongo cypress tests repeated from React assignment.

describe('3 | New Comment Page', () => {

    beforeEach(() => {
        // Seed the database before each test
        cy.exec("node ../server/populate_db.js mongodb://127.0.0.1:27017/final_fake_so");
    });

    afterEach(() => {
        // Clear the database after each test
        cy.exec("node ../server/remove_db.js mongodb://127.0.0.1:27017/final_fake_so");
    });

    it('3.1 | Created new comment should be displayed at the top of the answers page', () => {
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
        cy.visit('http://localhost:3000');

        // Register new user
        cy.contains("Register").click();
        cy.get("#registerUsernameInput").type("TestUserB");
        cy.get("#registerPasswordInput").type("testuserpasswordB");
        cy.contains("Sign-up").click();

        cy.wait(500);

        // Login previously created user
        cy.contains("Login").click();
        cy.get("#loginUsernameInput").type("TestUserB");
        cy.get("#loginPasswordInput").type("testuserpasswordB");
        cy.contains("Sign-in").click();

        cy.contains("Programmatically navigate using React router").click();
        cy.contains("Answer Question").click();
        cy.get("#answerTextInput").type(comments[0]);
        cy.contains("Post Answer").click();

        cy.get(".answerText").each(($el, index) => {
            cy.contains(comments[index]);
        });

        cy.contains("TestUserB");
        cy.contains('0 seconds ago');
    });

    it('3.2 | Text is mandatory when creating a new comment', () => {
        cy.visit('http://localhost:3000');

        // Register new user
        cy.contains("Register").click();
        cy.get("#registerUsernameInput").type("TestUserB");
        cy.get("#registerPasswordInput").type("testuserpasswordB");
        cy.contains("Sign-up").click();

        cy.wait(500);

        // Login previously created user
        cy.contains("Login").click();
        cy.get("#loginUsernameInput").type("TestUserB");
        cy.get("#loginPasswordInput").type("testuserpasswordB");
        cy.contains("Sign-in").click();

        cy.contains("Programmatically navigate using React router").click();
        cy.contains("Answer Question").click();
        cy.contains("Post Answer").click();
        cy.contains("Answer text cannot be empty");
    });

    it('3.3 | Checks if a6 and a7 exist in q3 answers page', () => {
        const answers = [
            "Using GridFS to chunk and store content.",
            "Storing content as BLOBs in databases.",
        ];
        cy.visit('http://localhost:3000');

        // Register new user
        cy.contains("Register").click();
        cy.get("#registerUsernameInput").type("TestUserB");
        cy.get("#registerPasswordInput").type("testuserpasswordB");
        cy.contains("Sign-up").click();

        cy.wait(500);

        // Login previously created user
        cy.contains("Login").click();
        cy.get("#loginUsernameInput").type("TestUserB");
        cy.get("#loginPasswordInput").type("testuserpasswordB");
        cy.contains("Sign-in").click();

        cy.contains("Object storage for a web application").click();
        cy.get(".answerText").each(($el, index) => {
            cy.contains(answers[index]);
        });
    });

    it('3.4 | Checks if a8 exists in q4 answers page', () => {
        cy.visit('http://localhost:3000');

        // Register new user
        cy.contains("Register").click();
        cy.get("#registerUsernameInput").type("TestUserB");
        cy.get("#registerPasswordInput").type("testuserpasswordB");
        cy.contains("Sign-up").click();

        cy.wait(500);

        // Login previously created user
        cy.contains("Login").click();
        cy.get("#loginUsernameInput").type("TestUserB");
        cy.get("#loginPasswordInput").type("testuserpasswordB");
        cy.contains("Sign-in").click();

        cy.contains("Quick question about storage on android").click();
        cy.contains("Store data in a SQLLite database.");
    });

    it('3.5 | Checks to make sure a newly created comment is displayed at the top of the answers page', () => {
        cy.visit('http://localhost:3000');

        // Register new user
        cy.contains("Register").click();
        cy.get("#registerUsernameInput").type("TestUserB");
        cy.get("#registerPasswordInput").type("testuserpasswordB");
        cy.contains("Sign-up").click();

        cy.wait(500);

        // Login previously created user
        cy.contains("Login").click();
        cy.get("#loginUsernameInput").type("TestUserB");
        cy.get("#loginPasswordInput").type("testuserpasswordB");
        cy.contains("Sign-in").click();

        cy.contains("Programmatically navigate using React router").click();
        cy.contains("Answer Question").click();
        cy.get("#answerTextInput").type(
            "I wish there was a link I could check for more info."
        );
        cy.contains("Post Answer").click();
        cy.get(".answerText")
            .first()
            .within(() => {
                cy.contains('I wish there was a link I could check for more info.');
            });
        cy.contains("TestUserB");
        cy.contains("0 seconds ago");
    });

    it('3.6 | Attempt to answer a question without login, check alert box is thrown', () => {

        cy.visit('http://localhost:3000');

        cy.contains("Quick question about storage on android").click();
        cy.contains("Answer Question").click();
        cy.on('window:alert', (str) => {
            expect(str).to.equal("Please log in to answer a question.")
        });
    });
});