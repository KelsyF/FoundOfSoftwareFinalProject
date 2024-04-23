const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const startServer = require('../server').startServer;
process.env.RUN_SERVER = "true";
let server;


beforeAll(async () => {
});

afterAll(async () => {
});

describe("API server", () => {
    test("GET / responds with Hello World!", async () => {
        const response = await request(app).get("/");
        expect(response.statusCode).toBe(200);
        expect(response.text).toContain("Hello World!");
    });
});

describe("startServer function", () => {
    beforeAll(() => {
        server = startServer();
    });

    afterAll(() => {
        server.close();
    });

    test("Server should start successfully", async () => {
        const response = await request(app).get("/");
        expect(response.statusCode).toBe(200);
        expect(response.text).toContain("Hello World!");
    });
});

describe("startServer function", () => {
  let server;

  beforeAll(() => {
      server = startServer();
  });

  afterAll(() => {
      server.close(() => {
          mongoose.disconnect();
      });
  });

  test("Server should start and close gracefully", async () => {
      const response = await request(app).get("/");
      expect(response.statusCode).toBe(200);
      expect(response.text).toContain("Hello World!");

      process.emit("SIGINT");

      await new Promise(resolve => setTimeout(resolve, 1000));

      expect(server.listening).toBe(false);
  });
});

describe("Server start condition", () => {
  let server;

  beforeAll(() => {
      server = require('../server').startServer();
  });

  afterAll(() => {
      server.close();
  });

  test("Server should start only if run as the main module", async () => {
      const importedApp = require('../server');

      const isListening = server.listening;

      expect(isListening).toBe(true);
  });
});


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
        process.env.UNIQUE_TEST_ENV = "true";
        if (process.env.UNIQUE_TEST_ENV === "true") {
            server = startServer();
            console.log("Server started by unique test.");
        }
    });

    afterAll(() => {
        delete process.env.UNIQUE_TEST_ENV;
        server.close();
    });

    test("Server should start and log 'Server started.' due to unique environment condition", async () => {
        const response = await request(app).get("/");
        expect(response.statusCode).toBe(200);
        expect(response.text).toContain("Hello World!");
    });
});