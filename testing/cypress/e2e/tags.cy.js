//Based off of soa-node-mongo cypress tests repeated from React assignment.

describe("Tag page", () => {

    beforeEach(() => {
        // Seed the database before each test
        cy.exec("node ../server/populate_db.js mongodb://127.0.0.1:27017/final_fake_so");
    });

    afterEach(() => {
        // Clear the database after each test
        cy.exec("node ../server/remove_db.js mongodb://127.0.0.1:27017/final_fake_so");
    });

    it('Check if all tags exist', () => {
        cy.visit('http://localhost:3000');

        // Check the tags that should have been seeded exist in the page
        cy.contains("Tags").click();
        cy.contains("react", { matchCase: false });
        cy.contains("javascript", { matchCase: false });
        cy.contains("android-studio", { matchCase: false });
        cy.contains("shared-preferences", { matchCase: false });
        cy.contains("storage", { matchCase: false });
        cy.contains("website", { matchCase: false });
    });

    it('Checks if the correct number of questions are populating within tags', () => {
        cy.visit('http://localhost:3000');

        // Check that the question numbers are correct in the page
        cy.contains("Tags").click();
        cy.contains("6 Tags");
        const tag_qNums = [
            "1 question",
            "2 questions",
            "2 questions",
            "2 questions",
            "2 questions",
            "1 questions",
        ];
        cy.get(".tagQcnt").each(($el, index, $list) => {
            cy.wrap($el).should("contain", tag_qNums[index]);
        });
    });

    it('Navigate to question in React tag', () => {
        cy.visit('http://localhost:3000');

        // Check the correct question is within the React tag
        cy.contains("Tag").click();
        cy.contains("react").click();
        cy.contains("Programmatically navigate using React router");
    });

    it('Navigate to questions in Storage tag', () => {
        cy.visit('http://localhost:3000');

        // Check the correct questions are within the Storage tag
        cy.contains("Tags").click();
        cy.contains("storage").click();
        cy.contains("Quick question about storage on android");
        cy.contains("Object storage for a web application");
    });

    it('Create a new question with a new tag and find the question through navigating to that tag page', () => {
        cy.visit('http://localhost:3000');

        // Register new user
        cy.contains("Register").click();
        cy.get("#registerUsernameInput").type("TestUserA");
        cy.get("#registerPasswordInput").type("testuserpasswordA");
        cy.contains("Sign-up").click();

        // Login previously created user
        cy.contains("Login").click();
        cy.get("#loginUsernameInput").type("TestUserA");
        cy.get("#loginPasswordInput").type("testuserpasswordA");
        cy.contains("Sign-in").click();

        // New user writes question with new tag
        cy.contains("Ask a Question").click();
        cy.get("#formTitleInput").type("Test Question A");
        cy.get("#formTextInput").type("Test Question A Text");
        cy.get("#formTagInput").type("test1-tag1");
        cy.contains("Post Question").click();

        // Navigate to Tags page
        cy.contains('Tags').click();

        // Navigate to newly created test1-tag1 tag
        cy.contains("test1-tag1").click();
        cy.contains('Test Question A');
    });

    it('Clicks on a tag and verifies it is displayed', () => {
       const tagName = 'javascript';

        cy.visit('http://localhost:3000');
        cy.contains('Tags').click();

        cy.contains(tagName).click();
        cy.get(".question_tags").each(($el, index, $list) => {
            cy.wrap($el).should('contain', tagName);
        });
    });

    it('Clicks on a tag in the homepage and verifies the questions displayed are actually related to the tag', () => {
        const tagName = 'storage';

        cy.visit('http://localhost:3000');

        //Clicks the 3rd tag associated with the question
        cy.get('.question_tag_button').eq(2).click();

        cy.get('.question_tags').each(($el, index, $list) => {
            cy.wrap($el).should('contain', tagName);
        });
    });
});