//Based off of soa-node-mongo cypress tests repeated from React assignment.

describe("7 | Filter", () => {

    beforeEach(() => {
        // Seed the database before each test
        cy.exec("node ../server/populate_db.js mongodb://127.0.0.1:27017/final_fake_so");
    });

    afterEach(() => {
        // Clear the database after each test
        cy.exec("node ../server/remove_db.js mongodb://127.0.0.1:27017/final_fake_so");
    });

    it('7.1 | Successfully filters based on the Active keyword', () => {
        const qTitles = [
            "Programmatically navigate using React router",
            "android studio save string shared preference, start activity and load the saved string",
            "Quick question about storage on android",
            "Object storage for a web application",
        ];

        cy.visit("http://localhost:3000");
        cy.contains('Active').click();
        cy.get('.postTitle').each(($el, index, $list) => {
            cy.wrap($el).should('contain', qTitles[index]);
        });
    });

    it('7.2 | Successfully filters based on the Unanswered keyword', () => {
        cy.visit("http://localhost:3000");

        // Register new user
        cy.contains("Register").click();
        cy.get("#registerUsernameInput").type("TestUserA");
        cy.get("#registerPasswordInput").type("testuserpasswordA");
        cy.contains("Sign-up").click();

        cy.wait(500);

        // Login previously created user
        cy.contains("Login").click();
        cy.get("#loginUsernameInput").type("TestUserA");
        cy.get("#loginPasswordInput").type("testuserpasswordA");
        cy.contains("Sign-in").click();

        // Check to make sure login was successful
        cy.contains("Welcome, TestUserA!");

        // Add multiple questions
        cy.contains("Ask a Question").click();
        cy.get("#formTitleInput").type("Test Question 1");
        cy.get("#formTextInput").type("Test Question 1 Text");
        cy.get("#formTagInput").type("javascript");
        cy.contains("Post Question").click();

        cy.contains("Ask a Question").click();
        cy.get("#formTitleInput").type("Test Question 2");
        cy.get("#formTextInput").type("Test Question 2 Text");
        cy.get("#formTagInput").type("react");
        cy.contains("Post Question").click();

        cy.contains("Ask a Question").click();
        cy.get("#formTitleInput").type("Test Question 3");
        cy.get("#formTextInput").type("Test Question 3 Text");
        cy.get("#formTagInput").type("java");
        cy.contains("Post Question").click();

        // Verify the questions were posted in most recently added order.
        cy.contains("Fake Stack Overflow");
        const qTitles = [
            "Test Question 3",
            "Test Question 2",
            "Test Question 1",
            "Quick question about storage on android",
            "Object storage for a web application",
            "android studio save string shared preference, start activity and load the saved string",
            "Programmatically navigate using React router",
        ];
        cy.get(".postTitle").each(($el, index, $list) => {
            cy.wrap($el).should("contain", qTitles[index]);
        });

        // Verify that clicking "Unanswered" actually only shows the unanswered questions
        cy.contains("Unanswered").click();
        const qTitlesUnanswered = [
            "Test Question 3",
            "Test Question 2",
            "Test Question 1",
        ];
        cy.get(".postTitle").each(($el, index, $list) => {
            cy.wrap($el).should('contain', qTitlesUnanswered[index]);
        });
    });

    it('7.3 | Adds a question, adds answers to some qs, verifies order is correct once filtered via Active keyword', () => {
        cy.visit("http://localhost:3000");

        // Register new user
        cy.contains("Register").click();
        cy.get("#registerUsernameInput").type("TestUserA");
        cy.get("#registerPasswordInput").type("testuserpasswordA");
        cy.contains("Sign-up").click();

        cy.wait(500);

        // Login previously created user
        cy.contains("Login").click();
        cy.get("#loginUsernameInput").type("TestUserA");
        cy.get("#loginPasswordInput").type("testuserpasswordA");
        cy.contains("Sign-in").click();

        // Check to make sure login was successful
        cy.contains("Welcome, TestUserA!");

        // Add question
        cy.contains("Ask a Question").click();
        cy.get("#formTitleInput").type("Test Question A");
        cy.get("#formTextInput").type("Test Question A Text");
        cy.get("#formTagInput").type("javascript");
        cy.contains("Post Question").click();

        // Add an answer to the React Router question
        cy.contains("Programmatically navigate using React router").click();
        cy.contains("Answer Question").click();
        cy.get("#answerTextInput").type("Answer to React Router");
        cy.contains("Post Answer").click();

        // Go back to main page
        cy.contains("Questions").click();

        // Add answer to the Android Studio question
        cy.contains(
            "android studio save string shared preference, start activity and load the saved string"
        ).click();
        cy.contains("Answer Question").click();
        cy.get("#answerTextInput").type("Answer to android studio");
        cy.contains("Post Answer").click();

        // Go back to main page
        cy.contains("Questions").click();

        // Add answer to Question A
        cy.contains("Test Question A").click();
        cy.contains("Answer Question").click();
        cy.get("#answerTextInput").type("Answer Question A");
        cy.contains("Post Answer").click();

        // Go back to main page
        cy.contains("Questions").click();

        // Click Active button
        cy.contains("Active").click();

        const qTitles = [
            "Test Question A",
            "android studio save string shared preference, start activity and load the saved string",
            "Programmatically navigate using React router",
            "Quick question about storage on android",
            "Object storage for a web application",
        ];
        cy.get('.postTitle').each(($el, index, $list) => {
            cy.wrap($el).should('contain', qTitles[index]);
        });
    });
});