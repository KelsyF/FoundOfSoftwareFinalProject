// This is the update version of the cypress test

// 9 sections. 33 tests total

describe("All tests from separate specs for code coverage purposes", () => {

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

  it('2.1 | Ask Question button creates and displays new post in All Questions', () => {
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
  });

  it('2.2 | Ask Question button creates and displays expected Metadata', () => {
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

  it('2.3 | Ask a Question with empty title shows error', () => {
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

  it('2.4 | Ask a Question with title longer than 100 characters shows error', () => {
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
    cy.get("#formTitleInput").type("I have this huge question but I want to put all of it in the title just in case someone doesn't actually want to read the text of the question so I'm going to put it all here and it'll be fine");
    cy.get("#formTextInput").type("Test Question A Text");
    cy.get("#formTagInput").type("javascript");
    cy.contains('Post Question').click();
    cy.contains('Title cannot be more than 100 characters');
  });

  it('2.5 | Ask a Question with empty text shows error', () => {
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

  it('2.6 | Ask a Question with more than 5 tags shows error', () => {
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
  });

  it('2.7 | Ask a question with tags, check to see tags exist', () => {
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

  it('2.8 | Attempt to ask a question without login, check alert box is thrown', () => {

    cy.visit('http://localhost:3000');

    cy.contains("Ask a Question").click();
    cy.contains("Post Question").click();
    cy.on('window:alert', (str) => {
      expect(str).to.equal("Please log in to post a question.")
    });
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

  it('4.1 | successfully shows All Questions string', () => {
    cy.visit('http://localhost:3000');
    cy.contains('All Questions');
  });

  it('4.2 | successfully shows Ask a Question button', () => {
    cy.visit('http://localhost:3000');
    cy.contains('Ask a Question');
  });

  it('4.3 | successfully shows total questions number', () => {
    cy.visit('http://localhost:3000');
    cy.contains('4 questions');
  });

  it('4.4 | successfully shows filter buttons', () => {
    cy.visit('http://localhost:3000');
    cy.contains('Newest');
    cy.contains('Active');
    cy.contains('Unanswered');
  });

  it('4.5 | successfully shows menu items', () => {
    cy.visit('http://localhost:3000');
    cy.contains('Questions');
    cy.contains('Tags');
  });

  it('4.6 | successfully shows search bar', () => {
    cy.visit('http://localhost:3000');
    cy.get('#searchBar');
  });

  it('4.7 | successfully shows page title', () => {
    cy.visit('http://localhost:3000');
    cy.contains('Fake Stack Overflow');
  });

  it('4.8 | successfully shows all questions in model', () => {
    const qTitles = ['Quick question about storage on android','Object storage for a web application','android studio save string shared preference, start activity and load the saved string', 'Programmatically navigate using React router'];
    cy.visit('http://localhost:3000');
    cy.get('.postTitle').each(($el, index, $list) => {
      cy.wrap($el).should('contain', qTitles[index]);
    });
  });

  it('4.9 | successfully shows all question stats', () => {
    const answers = ['1 answers','2 answers','3 answers','2 answers'];
    const views = ['103 views','200 views','121 views','10 views'];
    cy.visit('http://localhost:3000');
    cy.get('.postStats').each(($el, index, $list) => {
      cy.wrap($el).should('contain', answers[index]);
      cy.wrap($el).should('contain', views[index]);
    });
  });

  it('4.10 | successfully shows all question authors and date time', () => {
    const authors = ['elephantCDE', 'monkeyABC', 'saltyPeter', 'Joji John'];
    const date = ['Mar 10', 'Feb 18', 'Jan 10', 'Jan 20'];
    const times = ['14:28', '01:02', '11:24', '03:00'];
    cy.visit('http://localhost:3000');
    cy.get('.lastActivity').each(($el, index, $list) => {
      cy.wrap($el).should('contain', authors[index]);
      cy.wrap($el).should('contain', date[index]);
      cy.wrap($el).should('contain', times[index]);
    });
  });

  it('4.11 | successfully shows all questions in model in active order', () => {
    const qTitles = ['Programmatically navigate using React router','android studio save string shared preference, start activity and load the saved string', 'Quick question about storage on android','Object storage for a web application'];
    cy.visit('http://localhost:3000');
    cy.contains('Active').click();
    cy.get('.postTitle').each(($el, index, $list) => {
      cy.wrap($el).should('contain', qTitles[index]);
    });
  });

  it('4.12 | successfully shows all unanswered questions in model', () => {
    cy.visit('http://localhost:3000');
    cy.contains('Unanswered').click();
    cy.contains('0 questions');
  });

  it('4.13 | successfully highlights "Questions" link when on the home page', () => {
    cy.visit('http://localhost:3000');
    cy.get('.sideBarNav').contains('Questions').should('have.css', 'background-color', 'rgb(100, 149, 237)');
  });

  it('4.14 | successfully highlights "Tags" link when on the Tags page', () => {
    cy.visit('http://localhost:3000');
    cy.contains('Tags').click();
    cy.get('.sideBarNav').contains('Tags').should('have.css', 'background-color', 'rgb(100, 149, 237)');
  });

  it('5.1 | Check if all tags exist', () => {
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

  it('5.2 | Checks if the correct number of questions are populating within tags', () => {
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

  it('5.3 | Navigate to question in React tag', () => {
    cy.visit('http://localhost:3000');

    // Check the correct question is within the React tag
    cy.contains("Tag").click();
    cy.contains("react").click();
    cy.contains("Programmatically navigate using React router");
  });

  it('5.4 | Navigate to questions in Storage tag', () => {
    cy.visit('http://localhost:3000');

    // Check the correct questions are within the Storage tag
    cy.contains("Tags").click();
    cy.contains("storage").click();
    cy.contains("Quick question about storage on android");
    cy.contains("Object storage for a web application");
  });

  it('5.5 | Create a new question with a new tag and find the question through navigating to that tag page', () => {
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

  it('5.6 | Clicks on a tag and verifies it is displayed', () => {
    const tagName = 'javascript';

    cy.visit('http://localhost:3000');
    cy.contains('Tags').click();

    cy.contains(tagName).click();
    cy.get(".question_tags").each(($el, index, $list) => {
      cy.wrap($el).should('contain', tagName);
    });
  });

  it('5.7 | Clicks on a tag in the homepage and verifies the questions displayed are actually related to the tag', () => {
    const tagName = 'storage';

    cy.visit('http://localhost:3000');

    //Clicks the 3rd tag associated with the question
    cy.get('.question_tag_button').eq(2).click();

    cy.get('.question_tags').each(($el, index, $list) => {
      cy.wrap($el).should('contain', tagName);
    });
  });

  it('6.1 | Search string in question text', () => {
    const qTitles = ['android studio save string shared preference, start activity and load the saved string'];
    cy.visit('http://localhost:3000');
    cy.get('#searchBar').type('navigation{enter}');
    cy.get('.postTitle').each(($el, index, $list) => {
      cy.wrap($el).should('contain', qTitles[index]);
    })
  })

  it('6.2 | Search string matches tag and text', () => {
    const qTitles = ['android studio save string shared preference, start activity and load the saved string', "Programmatically navigate using React router"];
    cy.visit('http://localhost:3000');
    cy.get('#searchBar').type('navigation [React]{enter}');
    cy.get('.postTitle').each(($el, index, $list) => {
      cy.wrap($el).should('contain', qTitles[index]);
    })
  })

  it('6.3 | Output of the search should be in newest order by default', () => {
    const qTitles = ['Quick question about storage on android','android studio save string shared preference, start activity and load the saved string', "Programmatically navigate using React router"];
    cy.visit('http://localhost:3000');
    cy.get('#searchBar').type('android [react]{enter}');
    cy.get('.postTitle').each(($el, index, $list) => {
      cy.wrap($el).should('contain', qTitles[index]);
    });
  });

  it('6.4 | Output of the search should show number of results found', () => {
    const qTitles = ['Quick question about storage on android',"Programmatically navigate using React router", 'android studio save string shared preference, start activity and load the saved string'];
    cy.visit('http://localhost:3000');
    cy.get('#searchBar').type('android [react]{enter}');
    cy.contains(qTitles.length+" questions");
  });

  it('6.5 | Output of the empty search should show all results ', () => {
    const qTitles = ['Quick question about storage on android','Object storage for a web application',"Programmatically navigate using React router", 'android studio save string shared preference, start activity and load the saved string'];
    cy.visit('http://localhost:3000');
    cy.get('#searchBar').type('{enter}');
    cy.contains(qTitles.length+" questions");
  });

  it('6.6 | Search string with non-existing tag and non-tag word', () => {
    cy.visit('http://localhost:3000');
    cy.get('#searchBar').type('[NonExistingTag] nonexistingword{enter}');
    cy.contains('No Questions Found');
  });

  it('6.7 | Search string with case-insensitive matching', () => {
    cy.visit('http://localhost:3000');
    cy.get('#searchBar').type('AnDrOiD{enter}');
    cy.contains('android');
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
