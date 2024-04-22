describe("1 | User Profiles", () => {

    beforeEach(() => {
        // Seed the database before each test
        cy.exec("node ../server/populate_db.js mongodb://127.0.0.1:27017/final_fake_so");
    });

    afterEach(() => {
        // Clear the database after each test
        cy.exec("node ../server/remove_db.js mongodb://127.0.0.1:27017/final_fake_so");
    });

    it('1.1 | Register multiple accounts, check that they all login in correctly', () => {
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

        // Check to make sure login was successful
        cy.contains("Welcome, TestUserA!");

        // Logout
        cy.contains("Logout").click();

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

        // Check to make sure login was successful
        cy.contains("Welcome, TestUserB!");

        // Logout
        cy.contains("Logout").click();

        // Register new user
        cy.contains("Register").click();
        cy.get("#registerUsernameInput").type("TestUserC");
        cy.get("#registerPasswordInput").type("testuserpasswordC");
        cy.contains("Sign-up").click();

        cy.wait(500);

        // Login previously created user
        cy.contains("Login").click();
        cy.get("#loginUsernameInput").type("TestUserC");
        cy.get("#loginPasswordInput").type("testuserpasswordC");
        cy.contains("Sign-in").click();

        // Check to make sure login was successful
        cy.contains("Welcome, TestUserC!");

        // Logout
        cy.contains("Logout").click();

        // Test to see if TestUserA can still login
        cy.contains("Login").click();
        cy.get("#loginUsernameInput").type("TestUserA");
        cy.get("#loginPasswordInput").type("testuserpasswordA");
        cy.contains("Sign-in").click();

        // Check to make sure login was successful
        cy.contains("Welcome, TestUserA!");

        // Logout
        cy.contains("Logout").click();

    });

    it('1.2 | Tests login without username throws error', () => {
        cy.visit('http://localhost:3000');

        // Try Login with no username 1
        cy.contains("Login").click();
        cy.get("#loginPasswordInput").type("testuserpasswordA");
        cy.contains("Sign-in").click();
        cy.contains('Username cannot be empty');

    });

    it('1.3 | Tests login without password throws error', () => {
        cy.visit('http://localhost:3000');

        // Login previously created user
        cy.contains("Login").click();
        cy.get("#loginUsernameInput").type("TestUserB");
        cy.contains("Sign-in").click();
        cy.contains('Password cannot be empty');
    });

    it('1.4 | Tests login without username and password throws errors', () => {
        cy.visit('http://localhost:3000');

        // Login previously created user
        cy.contains("Login").click();
        cy.contains("Sign-in").click();
        cy.contains("Username cannot be empty")
        cy.contains('Password cannot be empty');
    });

    it('1.5 | Attempt registration of username that is already in use', () => {
        cy.visit('http://localhost:3000');

        // Try to register previously created user
        cy.contains("Register").click();
        cy.get("#registerUsernameInput").type("elephantCDE");
        cy.get("#registerPasswordInput").type("p12");
        cy.contains("Sign-up").click();
        cy.contains("Username already in use");

        // Navigate back to question page
        cy.contains("Questions").click();

        // Register new user
        cy.contains("Register").click();
        cy.get("#registerUsernameInput").type("TestUserA");
        cy.get("#registerPasswordInput").type("testuserpasswordA");
        cy.contains("Sign-up").click();
        cy.contains("All Questions");

        // Try to register new user again with different password
        cy.contains("Register").click();
        cy.get("#registerUsernameInput").type("TestUserA");
        cy.get("#registerPasswordInput").type("testpasswordA");
        cy.contains("Sign-up").click();
        cy.contains("Username already in use");

        // Navigate back to question page
        cy.contains("Questions").click();

        // Try to register previously created user
        cy.contains("Register").click();
        cy.get("#registerUsernameInput").type("monkeyABC");
        cy.get("#registerPasswordInput").type("p11");
        cy.contains("Sign-up").click();
        cy.contains("Username already in use");

    });

    it('1.6 | Login accounts with questions, check user page for questions', () => {
        cy.visit('http://localhost:3000');

        // Login previously created user
        cy.contains("Login").click();
        cy.get("#loginUsernameInput").type("elephantCDE");
        cy.get("#loginPasswordInput").type("p12");
        cy.contains("Sign-in").click();

        // Check to make sure login was successful and navigate to User Profile
        cy.contains("Welcome, elephantCDE!").click();

        // Check to make sure User Profile is showing correctly
        cy.contains("User Profile for elephantCDE");

        // Check to make sure posts are showing correctly
        cy.get(".user-profile li h3").should("contain", "Quick question about storage on android");

        const questionA = [
            "I would like to know the best way to go about storing an array on an android phone so that even when the app/activity ended the data remains",
            "Asked: 3/10/2023, 2:28:01 PM",
            "Views: 103",
            "Tags: android-studio, shared-preferences, storage",
        ]

        cy.get(".user-profile p").each(($el, index, $list) => {
            cy.wrap($el).should("contain", questionA[index]);
        });

        // Logout
        cy.contains("Logout").click();

        // Login previously created user
        cy.contains("Login").click();
        cy.get("#loginUsernameInput").type("monkeyABC");
        cy.get("#loginPasswordInput").type("p11");
        cy.contains("Sign-in").click();

        // Check to make sure login was successful and navigate to User Profile
        cy.contains("Welcome, monkeyABC!").click();

        // Check to make sure User Profile is showing correctly
        cy.contains("User Profile for monkeyABC");

        // Check to make sure posts are showing correctly
        cy.get(".user-profile li h3").should("contain", "Object storage for a web application");

        const questionB = [
            "I am currently working on a website where, roughly 40 million documents and images should be served to its users. I need suggestions on which method is the most suitable for storing content with subject to these requirements.",
            "Asked: 2/18/2023, 1:02:15 AM",
            "Views: 200",
            "Tags: storage, website",
        ]

        cy.get(".user-profile p").each(($el, index, $list) => {
            cy.wrap($el).should("contain", questionB[index]);
        });

        // Logout
        cy.contains("Logout").click();
    });

    it('1.7 | Login accounts with answers, check user page for answers', () => {
        cy.visit('http://localhost:3000');

        // Login previously created user
        cy.contains("Login").click();
        cy.get("#loginUsernameInput").type("hamkalo");
        cy.get("#loginPasswordInput").type("p1");
        cy.contains("Sign-in").click();

        // Check to make sure login was successful and navigate to User Profile
        cy.contains("Welcome, hamkalo!").click();

        // Check to make sure User Profile is showing correctly
        cy.contains("User Profile for hamkalo");

        // Check to make sure answers are showing correctly
        cy.get(".user-profile li h3").should("contain", "Question Title: Programmatically navigate using React router");

        const answerA = [
            "Answer Text: React Router is mostly a wrapper around the history library. history handles interaction with the browser\'s window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don\'t have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node.",
            "Answered: 11/20/2023, 3:24:42 AM",
        ]

        cy.get(".user-profile p").each(($el, index, $list) => {
            cy.wrap($el).should("contain", answerA[index]);
        });

        // Logout
        cy.contains("Logout").click();

        // Login previously created user
        cy.contains("Login").click();
        cy.get("#loginUsernameInput").type("azad");
        cy.get("#loginPasswordInput").type("p2");
        cy.contains("Sign-in").click();

        // Check to make sure login was successful and navigate to User Profile
        cy.contains("Welcome, azad!").click();

        // Check to make sure User Profile is showing correctly
        cy.contains("User Profile for azad");

        // Check to make sure answers are showing correctly
        cy.get(".user-profile li h3").should("contain", "Question Title: Programmatically navigate using React router");

        const answerB = [
            "Answer Text: On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn\'t change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router.",
            "Answered: 11/23/2023, 8:24:00 AM",
        ]

        cy.get(".user-profile p").each(($el, index, $list) => {
            cy.wrap($el).should("contain", answerB[index]);
        });
    });

    it('1.8 | Login new account, post question and answer, check user profile for them', () => {
        cy.visit('http://localhost:3000');

        // Register new user
        cy.contains("Register").click();
        cy.get("#registerUsernameInput").type("TestUserA");
        cy.get("#registerPasswordInput").type("testuserpasswordA");
        cy.contains("Sign-up").click();

        cy.wait(500);

        // Login newly registered user
        cy.contains("Login").click();
        cy.get("#loginUsernameInput").type("TestUserA");
        cy.get("#loginPasswordInput").type("testuserpasswordA");
        cy.contains("Sign-in").click();

        // Add a question
        cy.contains('Ask a Question').click();
        cy.get("#formTitleInput").type("Test Question A");
        cy.get("#formTextInput").type("Test Question A Text");
        cy.get("#formTagInput").type("javascript");
        cy.contains('Post Question').click();

        // Navigate to user profile
        cy.contains("Welcome, TestUserA!").click();

        // Check to make sure User Profile is showing correctly
        cy.contains("User Profile for TestUserA");

        // Check to make sure question is showing correctly
        cy.get(".user-profile li h3").should("contain", "Test Question A");

        // Navigate back to question page
        cy.contains("Questions").click();

        // Navigate to new question
        cy.contains("Test Question A").click();

        // Add an answer
        cy.contains("Answer Question").click();
        cy.get("#answerTextInput").type("Test Answer for Test Question A");
        cy.contains("Post Answer").click();

        // Navigate back to question page
        cy.contains("Questions").click();

        // Navigate to other question
        cy.contains("Quick question about storage on android").click();

        // Add a second answer
        cy.contains("Answer Question").click();
        cy.get("#answerTextInput").type("Second Test Answer for Test Question A");
        cy.contains("Post Answer").click();

        // Navigate to user profile
        cy.contains("Welcome, TestUserA!").click();

        // Check to make sure question and answers are showing correctly
        const qAndATitles = [
            "Test Question A",
            "Question Title: Quick question about storage on android",
            "Question Title: Test Question A",
        ]
        cy.get(".user-profile li h3").each(($el, index, $list) => {
            cy.wrap($el).should("contain", qAndATitles[index]);
        });

        // Navigate back to question page
        cy.contains("Questions").click();

        // Add a second question
        cy.contains('Ask a Question').click();
        cy.get("#formTitleInput").type("Test Question B");
        cy.get("#formTextInput").type("Test Question B Text");
        cy.get("#formTagInput").type("javascript");
        cy.contains('Post Question').click();

        // Navigate to user profile
        cy.contains("Welcome, TestUserA!").click();

        // Check to make sure question and answers are showing correctly
        const qAndATitlesB = [
            "Test Question B",
            "Test Question A",
            "Question Title: Quick question about storage on android",
            "Question Title: Test Question A",
        ]
        cy.get(".user-profile li h3").each(($el, index, $list) => {
            cy.wrap($el).should("contain", qAndATitlesB[index]);
        });

        // Logout
        cy.contains("Logout").click();

        // Login
        cy.contains("Login").click();
        cy.get("#loginUsernameInput").type("TestUserA");
        cy.get("#loginPasswordInput").type("testuserpasswordA");
        cy.contains("Sign-in").click();

        // Navigate to user profile
        cy.contains("Welcome, TestUserA!").click();

        // Check to make sure question and answers are still showing correctly
        cy.get(".user-profile li h3").each(($el, index, $list) => {
            cy.wrap($el).should("contain", qAndATitlesB[index]);
        });

        // Logout
        cy.contains("Logout").click();
    });

    it('1.9 | Check if clicking on username in question post directs to correct user profile page', () => {

        cy.visit('http://localhost:3000');

        // Click on username
        cy.contains("elephantCDE").click();

        // Check user profile page for accuracy
        cy.contains("User Profile for elephantCDE");

        cy.get(".user-profile li h3").should("contain", "Quick question about storage on android");

        const questionA = [
            "I would like to know the best way to go about storing an array on an android phone so that even when the app/activity ended the data remains",
            "Asked: 3/10/2023, 2:28:01 PM",
            "Views: 103",
            "Tags: android-studio, shared-preferences, storage",
        ]

        cy.get(".user-profile p").each(($el, index, $list) => {
            cy.wrap($el).should("contain", questionA[index]);
        });

        // Return to question page
        cy.contains("Questions").click();

        // Click on second username
        cy.contains("monkeyABC").click();

        // Check user profile page for accuracy
        cy.contains("User Profile for monkeyABC");

        cy.get(".user-profile li h3").should("contain", "Object storage for a web application");

        const questionB = [
            "I am currently working on a website where, roughly 40 million documents and images should be served to its users. I need suggestions on which method is the most suitable for storing content with subject to these requirements.",
            "Asked: 2/18/2023, 1:02:15 AM",
            "Views: 200",
            "Tags: storage, website",
        ]

        cy.get(".user-profile p").each(($el, index, $list) => {
            cy.wrap($el).should("contain", questionB[index]);
        });

        // Return to question page
        cy.contains("Questions").click();

        // Click on second username
        cy.contains("saltyPeter").click();

        // Check user profile page for accuracy
        cy.contains("User Profile for saltyPeter");

        cy.get(".user-profile li h3").should("contain", "android studio save string shared preference, start activity and load the saved string");

        const questionC = [
            "I am using bottom navigation view but am using custom navigation, so my fragments are not recreated every time i switch to a different view. I just hide/show my fragments depending on the icon selected. The problem i am facing is that whenever a config change happens (dark/light theme), my app crashes. I have 2 fragments in this activity and the below code is what i am using to refrain them from being recreated.",
            "Asked: 1/10/2023, 11:24:30 AM",
            "Views: 121",
            "Tags: android-studio, shared-preferences, javascript",
        ]

        cy.get(".user-profile p").each(($el, index, $list) => {
            cy.wrap($el).should("contain", questionC[index]);
        });

        // Return to question page
        cy.contains("Questions").click();

        // Click on second username
        cy.contains("Joji John").click();

        // Check user profile page for accuracy
        cy.contains("User Profile for Joji John");

        cy.get(".user-profile li h3").should("contain", "Programmatically navigate using React router");

        const questionD = [
            "the alert shows the proper index for the li clicked, and when I alert the variable within the last function Im calling, moveToNextImage(stepClicked), the same value shows but the animation isnt happening. This works many other ways, but Im trying to pass the index value of the list item clicked to use for the math to calculate.",
            "Asked: 1/20/2022, 3:00:00 AM",
            "Views: 10",
            "Tags: react, javascript",
        ]

        cy.get(".user-profile p").each(($el, index, $list) => {
            cy.wrap($el).should("contain", questionD[index]);
        });
    });

    it('1.10 | Check if clicking on question post in user profile takes user to correct question post', () => {

        cy.visit('http://localhost:3000');

        // Click on username
        cy.contains("elephantCDE").click();

        // Check user profile page for accuracy
        cy.contains("User Profile for elephantCDE");

        // Check clicking on post display takes user to actual question post page
        cy.contains("Quick question about storage on android").click();

        cy.contains("1 answers");
        cy.contains("Quick question about storage on android");
        // Check contains correct question
        cy.contains("104 views");
        cy.contains("I would like to know the best way to go about storing an array on an android phone so that even when the app/activity ended the data remains");
        cy.contains("elephantCDE");
        // Check contains correct answer
        cy.contains("Store data in a SQLLite database.");
        cy.contains("ihba001");

        // Return to questions page
        cy.contains("Questions").click();

        // Click on username
        cy.contains("saltyPeter").click();

        // Check user profile page for accuracy
        cy.contains("User Profile for saltyPeter");

        // Check clicking on post display takes user to actual question post page
        cy.contains("android studio save string shared preference, start activity and load the saved string").click();

        cy.contains("3 answers");
        cy.contains("android studio save string shared preference, start activity and load the saved string");
        cy.contains("122 views");
        // Check contains question
        cy.contains("I am using bottom navigation view but am using custom navigation, so my fragments are not recreated every time i switch to a different view. I just hide/show my fragments depending on the icon selected. The problem i am facing is that whenever a config change happens (dark/light theme), my app crashes. I have 2 fragments in this activity and the below code is what i am using to refrain them from being recreated.");
        cy.contains("saltyPeter");
        // Check contains 1st answer
        cy.contains("Consider using apply() instead; commit writes its data to persistent storage immediately, whereas apply will handle it in the background.");
        cy.contains("abaya");
        // Check contains 2nd answer
        cy.contains("YourPreference yourPrefrence = YourPreference.getInstance(context); yourPreference.saveData(YOUR_KEY,YOUR_VALUE);");
        cy.contains("alia");
        // Check contains 3rd answer
        cy.contains("I just found all the above examples just too confusing, so I wrote my own. ");
        cy.contains("sana");
    });

    it('1.11 | Check if clicking on username in answer post directs to correct user profile page', () => {

        cy.visit('http://localhost:3000');

        // Navigate to question page
        cy.contains("Object storage for a web application").click();

        // Click on username in answer metadata
        cy.contains("mackson3332").click();

        // Check user profile is correct
        cy.contains("User Profile for mackson3332");
        cy.contains("Question Title: Object storage for a web application");
        cy.contains("Answer Text: Using GridFS to chunk and store content.");
        cy.contains("Answered: 2/22/2023, 5:19:00 PM");

        // Check if clicking on answer takes user back to question post
        cy.contains("Question Title: Object storage for a web application").click();
        cy.contains("Object storage for a web application");
        cy.contains("monkeyABC");

        //Click on 2nd answer's username in metadata
        cy.contains("abhi3241").click();

        // Check user profile is correct
        cy.contains("User Profile for abhi3241");
        cy.contains("Question Title: Object storage for a web application");
        cy.contains("Answer Text: Storing content as BLOBs in databases.");
        cy.contains("Answered: 2/19/2023, 6:20:59 PM");

        // Check if clicking on answer takes user back to question post
        cy.contains("Question Title: Object storage for a web application").click();
        cy.contains("Object storage for a web application");
        cy.contains("monkeyABC");
    });
});