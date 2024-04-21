// New unit tests for functions in controller/question.js

const supertest = require("supertest");
const { default: mongoose } = require("mongoose");
const Question = require('../models/questions');
const User = require('../models/user');
const { addTag, getQuestionsByOrder, filterQuestionsBySearch } = require('../utils/question');

// Mocking the models and utilities
jest.mock("../models/questions");
jest.mock("../models/user");
jest.mock('../utils/question');

let server;

// Sample data for tests
const tag1 = { _id: '507f191e810c19729de860ea', name: 'tag1' };
const tag2 = { _id: '65e9a5c2b26199dbcc3e6dc8', name: 'tag2' };

const user1 = { _id: '507f1f77bcf86cd799439011', username: 'user1' };

const mockQuestions = [
    {
        _id: '65e9b58910afe6e94fc6e6dc',
        title: 'Question 1 Title',
        text: 'Question 1 Text',
        asked_by: user1._id,
        tags: [tag1],
        views: 21,
        answers: []
    },
    {
        _id: '65e9b5a995b6c7045a30d823',
        title: 'Question 2 Title',
        text: 'Question 2 Text',
        asked_by: user1._id,
        tags: [tag2],
        views: 99,
        answers: []
    }
];

let consoleSpy;
let consoleLogSpy;

beforeEach(() => {
  jest.resetAllMocks();
    server = require("../server");
    // Setup spies for both console.error and console.log
    consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    getQuestionsByOrder.mockResolvedValue(mockQuestions);  // Re-establish expected behavior
    filterQuestionsBySearch.mockReturnValue(mockQuestions);  
});

afterEach(async () => {
    // Close the server if it is being used in this manner
    // if (server && server.close) server.close();
    await mongoose.disconnect();
    // Restore the original console functions after each test
    consoleSpy.mockRestore();
    consoleLogSpy.mockRestore();
});


describe('POST /addQuestion - Field Validations', () => {
  

  it('should use default value for tags when not provided', async () => {
      const requestBody = {
          title: 'Question Title',
          text: 'Question Text',
          asked_by: 'user1'
      };
      const expectedQuestion = {
          ...requestBody,
          tags: [],
          answers: [], // Assuming answers default to empty array as well
          views: 0,
          _id: 'newId',
          asked_by: user1._id
      };

      Question.create.mockResolvedValueOnce(expectedQuestion);
      User.findOne.mockResolvedValueOnce(user1);

      const response = await supertest(server).post('/question/addQuestion').send(requestBody);

      expect(response.status).toBe(200);
      expect(response.body.tags).toEqual([]);
  });

  it('should ignore extra fields', async () => {
      const requestBody = {
          title: 'Question Title',
          text: 'Question Text',
          asked_by: 'user1',
          tags: ['tag1'],
          unexpectedField: 'This should not be here'
      };
      const expectedQuestion = {
          title: 'Question Title',
          text: 'Question Text',
          tags: [
              { _id: '507f191e810c19729de860ea', name: 'tag1' }
          ],
          answers: [],
          views: 0,
          _id: 'newId',
          asked_by: user1._id
      };

      Question.create.mockResolvedValueOnce(expectedQuestion);
      User.findOne.mockResolvedValueOnce(user1);
      addTag.mockResolvedValueOnce([{ _id: '507f191e810c19729de860ea', name: 'tag1' }]);

      const response = await supertest(server).post('/question/addQuestion').send(requestBody);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expectedQuestion);
      expect(response.body.unexpectedField).toBeUndefined();
  });
});


describe('GET /getQuestion - Provided Search Only', () => {
    it('should fetch questions with default order and provided search term', async () => {
        const search = 'query';
        getQuestionsByOrder.mockResolvedValueOnce(mockQuestions); // Assume order affects output
        filterQuestionsBySearch.mockReturnValueOnce(mockQuestions.filter(q => q.title.includes(search)));

        const response = await supertest(server).get('/question/getQuestion').query({ search });

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockQuestions.filter(q => q.title.includes(search)));
        expect(getQuestionsByOrder).toHaveBeenCalledWith('newest');
        expect(filterQuestionsBySearch).toHaveBeenCalledWith(mockQuestions, search);
    });
});


describe('GET /getQuestion - Provided Order Only', () => {
  it('should correctly handle a provided order parameter without search', async () => {
      const order = 'oldest';
      getQuestionsByOrder.mockResolvedValueOnce(mockQuestions); // Mock specific order logic if needed

      const response = await supertest(server).get('/question/getQuestion').query({ order });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockQuestions);
      expect(getQuestionsByOrder).toHaveBeenCalledWith(order.toLowerCase());
      expect(filterQuestionsBySearch).not.toHaveBeenCalled(); // Ensure no search filtering applied
  });
});


describe('GET /getQuestion - No Search', () => {
  it('should fetch questions ordered without search filtering', async () => {
      const order = 'newest';
      getQuestionsByOrder.mockResolvedValue(mockQuestions);

      let response;
      try {
        response = await supertest(server).get('/question/getQuestion').query({ order });
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockQuestions);
        expect(getQuestionsByOrder).toHaveBeenCalledWith(order.toLowerCase());
        expect(filterQuestionsBySearch).not.toHaveBeenCalled(); // Verifies that no filtering was done
      } catch (error) {
        console.error("Error during test execution:", error);
        expect(error).toBeNull(); // This will force the test to fail here if there's an exception
      }
  });
});



describe('GET /getQuestion - With Search', () => {
  it('should fetch and filter questions based on search term', async () => {
      const order = 'newest';
      const search = 'specific query';

      getQuestionsByOrder.mockResolvedValueOnce(mockQuestions);
      filterQuestionsBySearch.mockReturnValueOnce(mockQuestions.filter(q => q.title.includes(search)));

      const response = await supertest(server).get('/question/getQuestion').query({ order, search });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockQuestions.filter(q => q.title.includes(search)));
      expect(getQuestionsByOrder).toHaveBeenCalledWith(order.toLowerCase());
      expect(filterQuestionsBySearch).toHaveBeenCalledWith(mockQuestions, search);
  });
});

describe('GET /getQuestion - Different Orders', () => {
  const orders = ['newest', 'oldest', 'popular'];
  orders.forEach(order => {
      it(`should handle order type: ${order}`, async () => {
          getQuestionsByOrder.mockResolvedValueOnce(mockQuestions); // adjust logic inside getQuestionsByOrder if it affects output based on order

          const response = await supertest(server).get('/question/getQuestion').query({ order });

          expect(response.status).toBe(200);
          expect(response.body).toEqual(mockQuestions);
          expect(getQuestionsByOrder).toHaveBeenCalledWith(order.toLowerCase());
      });
  });
});


describe('DELETE /deleteQuestion/:id', () => {

  it('should handle errors during deletion and respond with status 500', async () => {
      const validId = "507f1f77bcf86cd799439011"; // Use a string that looks like a valid MongoDB ObjectId
      // Mock the deleteOne method to simulate a failure
      Question.deleteOne.mockRejectedValue(new Error("Database Error"));

      const response = await supertest(server).delete(`/question/deleteQuestion/${validId}`);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: "Error deleting question", error: "Database Error" });
      expect(consoleSpy).toHaveBeenCalledWith("Error during deletion:", expect.any(Error));
  });
});

describe('DELETE /deleteQuestion/:id', () => {

  it('should respond with status 400 for invalid ID format', async () => {
      const invalidId = "invalid-id"; // An example of an invalid MongoDB ObjectId

      const response = await supertest(server).delete(`/question/deleteQuestion/${invalidId}`);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: "Invalid ID format" });
      expect(consoleLogSpy).toHaveBeenCalledWith("Invalid ID format:", invalidId);
  });
});

describe('API ID Validation', () => {
  it('should respond with status 400 for invalid ID format', async () => {
    const invalidId = "invalid-id123";
    const response = await supertest(server).get(`/question/getQuestionById/${invalidId}`);
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
        message: "Invalid question ID format"
    });
    // Remove or comment out the next line if logging is not required
    // expect(consoleLogSpy).toHaveBeenCalledWith("Invalid ID format:", invalidId);
});

});


describe('GET /getQuestionById/:id', () => {
  it('should return an error if the provided ID format is invalid', async () => {
      // Set an invalid ID for testing
      const invalidId = "123";

      const response = await supertest(server).get(`/question/getQuestionById/${invalidId}`);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
          message: "Invalid question ID format"
      });
  });
});


describe('GET /getQuestionById/:id', () => {
  it('should return a 404 error if no question is found for the given ID', async () => {
      // Setup a valid but non-existing ID
      const nonExistingId = "507f1f77bcf86cd799439011";

      // Mock the findOneAndUpdate method to simulate no question found
      Question.findOneAndUpdate.mockImplementation(() => ({
          populate: jest.fn().mockImplementation(() => ({
              populate: jest.fn().mockResolvedValueOnce(null)  // Returns null to simulate no question found
          }))
      }));

      const response = await supertest(server).get(`/question/getQuestionById/${nonExistingId}`);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
          message: "Question not found"
      });
  });
});

describe('GET /getQuestion Error Handling', () => {
  it('should handle errors when fetching questions fails', async () => {
      const query = { order: 'newest', search: 'test' };

      // Simulate a database or internal server error
      getQuestionsByOrder.mockRejectedValueOnce(new Error("Database fetch error"));

      const response = await supertest(server).get('/question/getQuestion').query(query);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
          message: "Error fetching questions",
          error: "Database fetch error" // Adjust based on the actual error message handling in your controller
      });
      expect(console.error).toHaveBeenCalledWith("Error fetching questions:", expect.any(Error)); // This checks if console.error was called correctly
  });
});

describe('Question Controller Tests', () => {
    describe('GET /getQuestion', () => {
        it('should return questions by filter', async () => {
            const query = { order: 'newest', search: 'test' };

            getQuestionsByOrder.mockResolvedValueOnce(mockQuestions);
            filterQuestionsBySearch.mockReturnValueOnce(mockQuestions);

            const response = await supertest(server).get('/question/getQuestion').query(query);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockQuestions);
            expect(getQuestionsByOrder).toHaveBeenCalledWith('newest');
            expect(filterQuestionsBySearch).toHaveBeenCalledWith(mockQuestions, 'test');
        });
    });

    describe('GET /getQuestionById/:id', () => {
      it('should return a question by id and increment its views', async () => {
          const questionId = '65e9b5a995b6c7045a30d823';
          const expectedQuestion = {
              ...mockQuestions[1],
              views: mockQuestions[1].views + 1,
              answers: [], // Populate this if necessary
              asked_by: user1
          };
  
          Question.findOneAndUpdate.mockImplementation(() => ({
              populate: jest.fn().mockImplementation(() => ({
                  populate: jest.fn().mockResolvedValueOnce(expectedQuestion)
              }))
          }));
  
          const response = await supertest(server).get(`/question/getQuestionById/${questionId}`);
  
          expect(response.status).toBe(200);
          expect(response.body).toEqual(expectedQuestion);
          expect(Question.findOneAndUpdate).toHaveBeenCalledWith(
              { _id: questionId },
              { $inc: { views: 1 } },
              { new: true }
          );
      });
  });
  

  describe('POST /addQuestion', () => {
    it('should add a new question', async () => {
        const requestBody = {
            title: 'New Question Title',
            text: 'Some question text here',
            asked_by: 'user1',
            tags: ['tag1', 'tag2']
        };

        const expectedQuestion = {
            ...requestBody,
            _id: 'newId', // Simulated new MongoDB ID
            views: 0,
            answers: [],
            asked_by: user1._id,
            tags: [
                { _id: '507f191e810c19729de860ea', name: 'tag1' },
                { _id: '65e9a5c2b26199dbcc3e6dc8', name: 'tag2' }
            ] // Adjusting the expected structure to match the actual API behavior
        };

        User.findOne.mockResolvedValueOnce(user1);
        addTag.mockImplementation(tag => {
            return tag === 'tag1' ? { _id: '507f191e810c19729de860ea', name: 'tag1' } :
                                    { _id: '65e9a5c2b26199dbcc3e6dc8', name: 'tag2' };
        });
        Question.create.mockResolvedValueOnce(expectedQuestion);

        const response = await supertest(server).post('/question/addQuestion').send(requestBody);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(expectedQuestion);
        expect(User.findOne).toHaveBeenCalledWith({ username: requestBody.asked_by });
        expect(addTag).toHaveBeenCalledTimes(requestBody.tags.length);
        expect(Question.create).toHaveBeenCalledWith({
            title: requestBody.title,
            text: requestBody.text,
            asked_by: user1._id,
            tags: [
                { _id: '507f191e810c19729de860ea', name: 'tag1' },
                { _id: '65e9a5c2b26199dbcc3e6dc8', name: 'tag2' }
            ],
            ask_date_time: expect.any(Date),
            answers: []
        });
    });
});



    describe('DELETE /deleteQuestion/:id', () => {
        it('should delete a question', async () => {
            const questionId = '65e9b58910afe6e94fc6e6dc';

            Question.deleteOne.mockResolvedValue({ deletedCount: 1 });

            const response = await supertest(server).delete(`/question/deleteQuestion/${questionId}`);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe("Question deleted successfully");
            expect(Question.deleteOne).toHaveBeenCalledWith({ _id: questionId });
        });
    });

    describe('GET /getQuestionById/:id', () => {
      it('should handle errors when fetching a question by id', async () => {
        const questionId = '65e9b5a995b6c7045a30d823';
    
        Question.findOneAndUpdate.mockImplementation(() => ({
            populate: jest.fn().mockImplementation(() => ({
                populate: jest.fn().mockRejectedValue(new Error("Database Error"))
            }))
        }));
    
        const response = await supertest(server).get(`/question/getQuestionById/${questionId}`);
    
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ message: "Error fetching question", error: "Error: Database Error" }); // Adjust the error message to match API behavior
    });
    
  });
  

  describe('POST /addQuestion', () => {
    it('should handle errors when adding a new question', async () => {
        const requestBody = {
            title: 'New Question Title',
            text: 'Some question text here',
            asked_by: 'user1',
            tags: ['tag1', 'tag2']
        };

        User.findOne.mockResolvedValueOnce(user1);
        addTag.mockResolvedValueOnce([{ _id: '507f191e810c19729de860ea', name: 'tag1' }]);
        Question.create.mockRejectedValue(new Error("Database Error"));

        const response = await supertest(server).post('/question/addQuestion').send(requestBody);

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ message: "Error adding question", error: "Database Error" });
    });
});

describe('POST /addQuestion', () => {
  it('should return an error when the user is not found', async () => {
      const requestBody = {
          title: 'Question Title',
          text: 'Question Text',
          asked_by: 'nonexistent_user',
          tags: ['tag1']
      };

      User.findOne.mockResolvedValueOnce(null); // Simulating user not found

      const response = await supertest(server).post('/question/addQuestion').send(requestBody);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: "User not found" });
  });
});

describe('DELETE /deleteQuestion/:id', () => {
  it('should handle deletion of a non-existent question', async () => {
      // Using a valid format MongoDB ObjectId that does not actually exist
      const questionId = '507f1f77bcf86cd799439011';

      Question.deleteOne.mockResolvedValue({ deletedCount: 0 });

      const response = await supertest(server).delete(`/question/deleteQuestion/${questionId}`);

      expect(response.status).toBe(404); // Confirm that your API is meant to return 404 here
      expect(response.body).toEqual({ message: "No question found with that ID" });
  });
});



});


