
describe("8 | Post Moderation", () => {

    beforeEach(() => {
        // Seed the database before each test
        cy.exec("node ../server/populate_db.js mongodb://127.0.0.1:27017/final_fake_so");
    });

    afterEach(() => {
        // Clear the database after each test
        cy.exec("node ../server/remove_db.js mongodb://127.0.0.1:27017/final_fake_so");
    });

    it('8.1 | Register moderator, check delete post on homepage works', () => {
        cy.visit('http://localhost:3000');

        // Register moderator
        cy.contains("Register").click();
        cy.get("#registerUsernameInput").type("moderator");
        cy.get("#registerPasswordInput").type("mod123");
        cy.contains("Sign-up").click();

        cy.wait(500);

        // Login previously created user
        cy.contains("Login").click();
        cy.get("#loginUsernameInput").type("moderator");
        cy.get("#loginPasswordInput").type("mod123");
        cy.contains("Sign-in").click();

        // Check to make sure login was successful
        cy.contains("Welcome, moderator!");

        // Check delete question button works
        cy.contains("Delete").click();

        cy.contains("3 questions");

        const qTitles = [
            "Object storage for a web application",
            "android studio save string shared preference, start activity and load the saved string",
            "Programmatically navigate using React router",
        ]
        cy.get(".postTitle").each(($el, index, $list) => {
            cy.wrap($el).should("contain", qTitles[index]);
        });

        // Logout from moderator account
        cy.contains("Logout").click();

        // Login user account whose post was deleted
        cy.contains("Login").click();
        cy.get("#loginUsernameInput").type("elephantCDE");
        cy.get("#loginPasswordInput").type("p12");
        cy.contains("Sign-in").click();

        // Check user profile to make sure post isn't there
        cy.contains("Welcome, elephantCDE!").click();
        cy.get('.user-profile li h3').should('not.exist');
    });

    it('8.2 | Register moderator, check delete post on questionpage works', () => {
        cy.visit('http://localhost:3000');

        // Register moderator
        cy.contains("Register").click();
        cy.get("#registerUsernameInput").type("moderator");
        cy.get("#registerPasswordInput").type("mod123");
        cy.contains("Sign-up").click();

        cy.wait(500);

        // Login previously created user
        cy.contains("Login").click();
        cy.get("#loginUsernameInput").type("moderator");
        cy.get("#loginPasswordInput").type("mod123");
        cy.contains("Sign-in").click();

        // Check to make sure login was successful
        cy.contains("Welcome, moderator!");

        // Navigate to question
        cy.contains("Quick question about storage on android").click()

        // Check delete question button works
        cy.contains("Delete").click();

        cy.contains("3 questions");

        const qTitles = [
            "Object storage for a web application",
            "android studio save string shared preference, start activity and load the saved string",
            "Programmatically navigate using React router",
        ]
        cy.get(".postTitle").each(($el, index, $list) => {
            cy.wrap($el).should("contain", qTitles[index]);
        });

        // Logout from moderator account
        cy.contains("Logout").click();

        // Login user account whose post was deleted
        cy.contains("Login").click();
        cy.get("#loginUsernameInput").type("elephantCDE");
        cy.get("#loginPasswordInput").type("p12");
        cy.contains("Sign-in").click();

        // Check user profile to make sure post isn't there
        cy.contains("Welcome, elephantCDE!").click();
        cy.get('.user-profile li h3').should('not.exist');
    });

    it('8.3 | Register moderator, check delete answer works', () => {
        cy.visit('http://localhost:3000');

        // Register moderator
        cy.contains("Register").click();
        cy.get("#registerUsernameInput").type("moderator");
        cy.get("#registerPasswordInput").type("mod123");
        cy.contains("Sign-up").click();

        cy.wait(500);

        // Login previously created user
        cy.contains("Login").click();
        cy.get("#loginUsernameInput").type("moderator");
        cy.get("#loginPasswordInput").type("mod123");
        cy.contains("Sign-in").click();

        // Check to make sure login was successful
        cy.contains("Welcome, moderator!");

        // Navigate to question page
        cy.contains("Object storage for a web application").click();

        // Click delete for first answer
        cy.get(".moderator_action_button").each(($el, index, $list) => {
            if (index === 1) {
                cy.wrap($el).click();
            }
        });

        // Check answer deleted
        cy.contains("1 answers");
        cy.get(".answerText").should("contain", "Storing content as BLOBs in databases.");

        // Logout moderator
        cy.contains("Logout").click();

        // Login user whose answer was deleted
        cy.contains("Login").click();
        cy.get("#loginUsernameInput").type("mackson3332");
        cy.get("#loginPasswordInput").type("p7");
        cy.contains("Sign-in").click();

        // Check user profile to make sure answer isn't there
        cy.contains("Welcome, mackson3332!").click();
        cy.get('.user-profile li h3').should('not.exist');
    });

    it('8.4 | Register moderator, check delete user works', () => {
        cy.visit('http://localhost:3000');

        // Register moderator
        cy.contains("Register").click();
        cy.get("#registerUsernameInput").type("moderator");
        cy.get("#registerPasswordInput").type("mod123");
        cy.contains("Sign-up").click();

        cy.wait(500);

        // Login previously created user
        cy.contains("Login").click();
        cy.get("#loginUsernameInput").type("moderator");
        cy.get("#loginPasswordInput").type("mod123");
        cy.contains("Sign-in").click();

        // Navigate to user profile of user to be deleted
        cy.contains("elephantCDE").click();

        // Delete user
        cy.contains("Delete User").click();

        // Check delete user worked
        cy.contains("3 questions");

        const qTitles = [
            "Object storage for a web application",
            "android studio save string shared preference, start activity and load the saved string",
            "Programmatically navigate using React router",
        ]
        cy.get(".postTitle").each(($el, index, $list) => {
            cy.wrap($el).should("contain", qTitles[index]);
        });

        // Logout of moderator account
        cy.contains("Logout").click();

        // Attempt Login for user that was deleted
        cy.contains("Login").click();
        cy.get("#loginUsernameInput").type("elephantCDE");
        cy.get("#loginPasswordInput").type("p12");
        cy.contains("Sign-in").click();
        cy.contains("Username/Password combination not found");
    });

    it('8.5 | Register moderator, check delete tag works', () => {
        cy.visit('http://localhost:3000');

        // Register moderator
        cy.contains("Register").click();
        cy.get("#registerUsernameInput").type("moderator");
        cy.get("#registerPasswordInput").type("mod123");
        cy.contains("Sign-up").click();

        cy.wait(500);

        // Login previously created user
        cy.contains("Login").click();
        cy.get("#loginUsernameInput").type("moderator");
        cy.get("#loginPasswordInput").type("mod123");
        cy.contains("Sign-in").click();

        // Navigate to tag page
        cy.contains("Tags").click();

        //Delete tag
        cy.contains("Delete").click();

        //Check if tag was deleted correctly
        cy.contains("5 Tags");

        const tags = [
            "javascript",
            "android-studio",
            "shared-preferences",
            "storage",
            "website",
        ]

        cy.get(".tag_list").children().each(($child, index, $children) => {
            cy.wrap($child).should("contain", tags[index]);
        })

        cy.contains("Questions").click();

        // Check delete tag worked
        cy.contains("4 questions");

        cy.get(".question_tag_button").should("not.contain", "react");
    });
});