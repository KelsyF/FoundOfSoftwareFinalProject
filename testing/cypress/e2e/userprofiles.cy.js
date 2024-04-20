describe("User Profiles", () => {

    beforeEach(() => {
        // Seed the database before each test
        cy.exec("node ../server/populate_db.js mongodb://127.0.0.1:27017/final_fake_so");
    });

    afterEach(() => {
        // Clear the database after each test
        cy.exec("node ../server/remove_db.js mongodb://127.0.0.1:27017/final_fake_so");
    });

    it('Register multiple accounts, check that they all login in correctly', () => {
        cy.visit('http://localhost:3000');

        // Register new user
        cy.contains("Register").click();
        cy.get("#registerUsernameInput").type("TestUserA");
        cy.get("#registerPasswordInput").type("testuserpasswordA");
        cy.contains("Sign-up").click();

        // Register new user
        cy.contains("Register").click();
        cy.get("#registerUsernameInput").type("TestUserB");
        cy.get("#registerPasswordInput").type("testuserpasswordB");
        cy.contains("Sign-up").click();

        // Register new user
        cy.contains("Register").click();
        cy.get("#registerUsernameInput").type("TestUserC");
        cy.get("#registerPasswordInput").type("testuserpasswordC");
        cy.contains("Sign-up").click();

        // Register new user
        cy.contains("Register").click();
        cy.get("#registerUsernameInput").type("TestUserD");
        cy.get("#registerPasswordInput").type("testuserpasswordD");
        cy.contains("Sign-up").click();

        // Register new user
        cy.contains("Register").click();
        cy.get("#registerUsernameInput").type("TestUserE");
        cy.get("#registerPasswordInput").type("testuserpasswordE");
        cy.contains("Sign-up").click();

        // Login previously created user
        cy.contains("Login").click();
        cy.get("#loginUsernameInput").type("TestUserA");
        cy.get("#loginPasswordInput").type("testuserpasswordA");
        cy.contains("Sign-in").click();

        // Check to make sure login was successful
        cy.contains("Welcome, TestUserA!");

        // Logout
        cy.contains("Logout").click();

        // Login previously created user
        cy.contains("Login").click();
        cy.get("#loginUsernameInput").type("TestUserB");
        cy.get("#loginPasswordInput").type("testuserpasswordB");
        cy.contains("Sign-in").click();

        // Check to make sure login was successful
        cy.contains("Welcome, TestUserB!");

        // Logout
        cy.contains("Logout").click();

        // Login previously created user
        cy.contains("Login").click();
        cy.get("#loginUsernameInput").type("TestUserC");
        cy.get("#loginPasswordInput").type("testuserpasswordC");
        cy.contains("Sign-in").click();

        // Check to make sure login was successful
        cy.contains("Welcome, TestUserC!");

        // Logout
        cy.contains("Logout").click();

        // Login previously created user
        cy.contains("Login").click();
        cy.get("#loginUsernameInput").type("TestUserD");
        cy.get("#loginPasswordInput").type("testuserpasswordD");
        cy.contains("Sign-in").click();

        // Check to make sure login was successful
        cy.contains("Welcome, TestUserD!");

        // Logout
        cy.contains("Logout").click();

        // Login previously created user
        cy.contains("Login").click();
        cy.get("#loginUsernameInput").type("TestUserE");
        cy.get("#loginPasswordInput").type("testuserpasswordE");
        cy.contains("Sign-in").click();

        // Check to make sure login was successful
        cy.contains("Welcome, TestUserE!");

        // Logout
        cy.contains("Logout").click();

    });

    it('Login accounts with questions, check user page for questions', () => {
        cy.visit('http://localhost:3000');

        // Login previously created user
        cy.contains("Login").click();
        cy.get("#loginUsernameInput").type("elephantCDE");
        cy.get("#loginPasswordInput").type("p12");
        cy.contains("Sign-in").click();

        // Check to make sure login was successful
        cy.contains("Welcome, elephantCDE!");



    });
});