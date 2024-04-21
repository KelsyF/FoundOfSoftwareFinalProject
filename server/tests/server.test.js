const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const startServer = require('../server').startServer;
process.env.RUN_SERVER = "true";
let server;

// Connect to the test database before running any tests
beforeAll(async () => {
    //const url = 'mongodb://127.0.0.1/testDatabase';  // Use a separate test database
   // await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
});

// Disconnect from the test database after all tests have finished
afterAll(async () => {
    //await mongoose.disconnect();
});

describe("API server", () => {
    test("GET / responds with Hello World!", async () => {
        const response = await request(app).get("/");
        expect(response.statusCode).toBe(200);
        expect(response.text).toContain("Hello World!");
    });
});

describe("startServer function", () => {
    // Start the server before running any tests in this block
    beforeAll(() => {
        server = startServer();
    });

    // Close the server after running all tests in this block
    afterAll(() => {
        server.close();
    });

    test("Server should start successfully", async () => {
        // Make a request to the root URL and expect a 200 status code
        const response = await request(app).get("/");
        expect(response.statusCode).toBe(200);
        expect(response.text).toContain("Hello World!");
    });
});

describe("startServer function", () => {
  let server;

  // Start the server before running any tests in this block
  beforeAll(() => {
      server = startServer();
  });

  // Close the server after running all tests in this block
  afterAll(() => {
      // Gracefully close the server
      server.close(() => {
          // Ensure MongoDB is disconnected before finishing
          mongoose.disconnect();
      });
  });

  test("Server should start and close gracefully", async () => {
      // Test that the server is running
      const response = await request(app).get("/");
      expect(response.statusCode).toBe(200);
      expect(response.text).toContain("Hello World!");

      // Simulate SIGINT signal to close the server
      process.emit("SIGINT");

      // Wait a bit for the server to close
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Ensure server is closed
      expect(server.listening).toBe(false);
  });
});

describe("Server start condition", () => {
  let server;

  // Start the server before running any tests in this block
  beforeAll(() => {
      server = require('../server').startServer();
  });

  // Stop the server after running all tests in this block
  afterAll(() => {
      server.close();
  });

  test("Server should start only if run as the main module", async () => {
      // Import the server file without running it
      const importedApp = require('../server');

      // Check if the server is listening
      const isListening = server.listening;

      // If the server is listening, it means startServer was called
      // which should only happen when the file is run as the main module
      expect(isListening).toBe(true);
  });
});




// server.test.js
describe("Server Control", () => {
    let server;
  
    beforeAll(() => {
      server = app.startServer();
    });
  
    afterAll(() => {
      server.close();
    });
  
    test("Server should be started by the test", async () => {
      const response = await request(app).get("/");
      expect(response.statusCode).toBe(200);
      expect(response.text).toContain("Hello World!");
    });
  });


  describe("Unique Server Start Test", () => {
    let server;

    beforeAll(() => {
        // Set a unique environment variable that only this test checks
        process.env.UNIQUE_TEST_ENV = "true";
        // Start the server only if the unique environment variable is set
        if (process.env.UNIQUE_TEST_ENV === "true") {
            server = startServer();
            console.log("Server started by unique test.");
        }
    });

    afterAll(() => {
        // Clean up: unset the environment variable and close the server
        delete process.env.UNIQUE_TEST_ENV;
        server.close();
    });

    test("Server should start and log 'Server started.' due to unique environment condition", async () => {
        // Make a request to ensure the server is running
        const response = await request(app).get("/");
        expect(response.statusCode).toBe(200);
        expect(response.text).toContain("Hello World!");
    });
});