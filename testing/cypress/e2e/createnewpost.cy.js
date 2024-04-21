//Based off of soa-node-mongo cypress tests repeated from React assignment.

describe('New Question Form', () => {

    beforeEach(() => {
        // Seed the database before each test
        cy.exec("node ../server/populate_db.js mongodb://127.0.0.1:27017/final_fake_so");
    });

    afterEach(() => {
        // Clear the database after each test
        cy.exec("node ../server/remove_db.js mongodb://127.0.0.1:27017/final_fake_so");
    });

    it('Ask Question button creates and displays new post in All Questions', () => {
        cy.visit('http://localhost:3000');

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

        // First added question
        cy.contains('Ask a Question').click();
        cy.get("#formTitleInput").type("Test Question A");
        cy.get("#formTextInput").type("Test Question A Text");
        cy.get("#formTagInput").type("javascript");
        cy.contains('Post Question').click();

        // Second added question
        cy.contains("Ask a Question").click();
        cy.get("#formTitleInput").type("Test Question B");
        cy.get("#formTextInput").type("Test Question B Text");
        cy.get("#formTagInput").type("javascript");
        cy.contains('Post Question').click();

        // Third added question
        cy.contains("Ask a Question").click();
        cy.get("#formTitleInput").type("Test Question C");
        cy.get("#formTextInput").type("Test Question C Text");
        cy.get("#formTagInput").type("javascript");
        cy.contains('Post Question').click();

        // Checks questions were posted and display in most recently added order.
        const qTitles = [
            "Test Question C",
            "Test Question B",
            "Test Question A",
            "Quick question about storage on android",
            "Object storage for a web application",
            "android studio save string shared preference, start activity and load the saved string",
            "Programmatically navigate using React router",
        ];
        cy.get(".postTitle").each(($el, index, $list) => {
            cy.wrap($el).should("contain", qTitles[index]);
        });
    })

    it('Ask Question button creates and displays expected Metadata', () => {
        cy.visit('http://localhost:3000');

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

        cy.contains('Ask a Question').click();
        cy.get("#formTitleInput").type("Test Question A");
        cy.get("#formTextInput").type("Test Question A Text");
        cy.get("#formTagInput").type("javascript");
        cy.contains('Post Question').click();

        cy.contains('Fake Stack Overflow');
        cy.contains('5 questions');
        cy.contains('TestUserA asked 0 seconds ago');
        const answers = [
            '0 answers',
            '1 answers',
            '2 answers',
            '3 answers',
            '2 answers',
        ];
        const views = [
            '0 views',
            '103 views',
            '200 views',
            '121 views',
            '10 views',
        ];
        cy.get('.postStats').each(($el, index, $list) => {
            cy.wrap($el).should("contain", answers[index]);
            cy.wrap($el).should("contain", views[index]);
        });
    });

    it('Ask a Question with empty title shows error', () => {
        cy.visit('http://localhost:3000');

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

        cy.contains('Ask a Question').click();
        cy.get("#formTextInput").type("Test Question A Text");
        cy.get("#formTagInput").type("javascript");
        cy.contains('Post Question').click();
        cy.contains('Title cannot be empty');
    });

    it('Ask a Question with empty text shows error', () => {
        cy.visit('http://localhost:3000');

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

        cy.contains('Ask a Question').click();
        cy.get("#formTitleInput").type("Test Question A");
        cy.get("#formTagInput").type("javascript");
        cy.contains('Post Question').click();
        cy.contains('Question text cannot be empty');
    });

    it('Ask a Question with more than 5 tags shows error', () => {
        cy.visit('http://localhost:3000');

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

        // Add a question with tags
        cy.contains('Ask a Question').click();
        cy.get("#formTitleInput").type("Test Question A");
        cy.get("#formTextInput").type("Test Question A Text");
        cy.get("#formTagInput").type("test1 test2 test3 test4 test5 test6");
        cy.contains('Post Question').click();
        cy.contains('Cannot have more than 5 tags')
    })

    it('Ask a question with tags, check to see tags exist', () => {
        cy.visit('http://localhost:3000');

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

        // Add a question with tags
        cy.contains('Ask a Question').click();
        cy.get("#formTitleInput").type("Test Question A");
        cy.get("#formTextInput").type("Test Question A Text");
        cy.get("#formTagInput").type("test1 test2 test3");
        cy.contains('Post Question').click();

        // Clicks tags
        cy.contains("Tags").click();
        cy.contains('test1');
        cy.contains('test2');
        cy.contains('test3');
    });
})