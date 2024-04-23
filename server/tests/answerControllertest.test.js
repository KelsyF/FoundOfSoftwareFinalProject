// Unit tests for addAnswer in controller/answer.js
const supertest = require("supertest");
const mongoose = require("mongoose");

const Answer = require("../models/answers");
const Question = require("../models/questions");
const User = require('../models/user');
const server = require("../server");

jest.mock("../models/answers");
jest.mock("../models/questions");
jest.mock('../models/user');

describe("POST /addAnswer", () => {
    let app;

    beforeAll(() => {
        app = supertest(server);
        console.error = jest.fn(); // Mock console.error globall
    });

    afterAll(async () => {
        //await server.close();
        await mongoose.disconnect();
        jest.restoreAllMocks(); // Restore all mocks to their original functions
    });

    it("should add a new answer and update the question document", async () => {
      const mockUser = {
          _id: "dummyUserId",
          username: "tester"
      };
      const mockAnswer = {
          _id: "dummyAnswerId",
          text: "This is a test answer",
          ans_by: mockUser._id,
          ans_date_time: new Date().toISOString()  // Use ISO string for direct comparison
      };
      const mockQuestion = {
          _id: "dummyQuestionId",
          answers: [mockAnswer._id]
      };
  
      // Mocking the User, Answer, and Question interactions
      User.findOne.mockResolvedValue(mockUser);
      Answer.create.mockResolvedValue({
          ...mockAnswer,
          ans_date_time: new Date(mockAnswer.ans_date_time)  // Ensure the mock returns a Date object
      });
      Question.findByIdAndUpdate.mockResolvedValue(mockQuestion);
  
      // Mocking the request body
      const mockReqBody = {
          qid: "dummyQuestionId",
          ans: {
              ans: {
                  text: "This is a test answer",
                  ans_by: "tester",
                  ans_date_time: mockAnswer.ans_date_time  // Using the same ISO string
              }
          }
      };
  
      // Making the request
      const response = await app.post("/answer/addAnswer").send(mockReqBody);
  
      // Asserting the response
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
          ...mockAnswer,
          ans_date_time: expect.any(String)  // Expecting a string type for the date
      });
  
      // Verifying interaction with the User model
      expect(User.findOne).toHaveBeenCalledWith({ username: mockReqBody.ans.ans.ans_by });
  
      // Verifying that Answer.create was called with correct arguments
      expect(Answer.create).toHaveBeenCalledWith({
          text: mockReqBody.ans.ans.text,
          ans_by: mockUser._id,
          ans_date_time: expect.any(Date)  // Expecting a Date object during creation
      });
  
      // Verifying that Question.findByIdAndUpdate was called correctly
      expect(Question.findByIdAndUpdate).toHaveBeenCalledWith(
          mockReqBody.qid,
          { $push: { answers: mockAnswer._id } },
          { new: true }
      );
  });
  

    it("should return 404 when user is not found", async () => {
        // Set up User.findOne to return null
        User.findOne.mockResolvedValue(null);

        const mockReqBody = {
            qid: "dummyQuestionId",
            ans: {
                ans: {
                    text: "This is a test answer",
                    ans_by: "nonexistent_user",
                    ans_date_time: "2023-04-15T15:00:00Z"
                }
            }
        };

        const response = await app.post("/answer/addAnswer").send(mockReqBody);
        expect(response.status).toBe(404);
        expect(response.body.message).toBe("User not found");
    });


    it("should return 400 if the answer details or question ID are missing", async () => {
        const testCases = [
            { desc: "missing answer details", body: { qid: "dummyQuestionId" } },
            { desc: "missing question ID", body: { ans: { ans: { text: "This is a test answer", ans_by: "tester", ans_date_time: "2023-04-15T15:00:00Z" } } } },
            { desc: "missing both answer details and question ID", body: {} }
        ];
    
        for (let testCase of testCases) {
            const response = await app.post("/answer/addAnswer").send(testCase.body);
    
            expect(response.status).toBe(400);
            expect(response.body).toEqual({
                msg: 'Bad request: Missing required fields'
            });
        }
    });
   

    it("should handle errors gracefully when adding an answer", async () => {
        // Prepare the mock data and request body
        const mockReqBody = {
            qid: "dummyQuestionId",
            ans: {
                ans: {
                    text: "This is a test answer",
                    ans_by: "tester",
                    ans_date_time: "2023-04-15T15:00:00Z"
                }
            }
        };

        // Setup the mock to throw an error during User.findOne
        User.findOne.mockRejectedValue(new Error("Database error during user lookup"));

        // Making the request
        const response = await app.post("/answer/addAnswer").send(mockReqBody);

        // Asserting the response
        expect(response.status).toBe(500);
        expect(response.body).toEqual({
            msg: 'Internal server error',
            error: 'Database error during user lookup'  // Matching the mocked error message
        });

        // Verify that the error was logged
        expect(console.error).toHaveBeenCalledWith('Error adding an answer:', expect.any(Error));
    });
  
  
});

describe("DELETE /deleteAnswer/:answerId", () => {
    let app;

    beforeAll(() => {
        app = supertest(server);
    });

    afterAll(async () => {
        //await server.close();
        await mongoose.disconnect();
    });

    it("should successfully delete an answer and update the question", async () => {
        const answerId = "dummyAnswerId";
        const questionId = "dummyQuestionId";

        // Mocking database responses
        Question.findOne.mockResolvedValue({
            _id: questionId,
            answers: [answerId]
        });
        Answer.deleteOne.mockResolvedValue({ deletedCount: 1 });
        Question.findByIdAndUpdate.mockResolvedValue({
            _id: questionId,
            answers: []
        });

        // Making the delete request
        const response = await app.delete(`/answer/deleteAnswer/${answerId}`);

        // Asserting the response
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            message: "Answer deleted successfully",
            details: {
                _id: questionId,
                answers: []
            }
        });

        // Verify interaction with models
        expect(Question.findOne).toHaveBeenCalledWith({ answers: { $in: [answerId] } });
        expect(Answer.deleteOne).toHaveBeenCalledWith({ _id: answerId });
        expect(Question.findByIdAndUpdate).toHaveBeenCalledWith(
            questionId,
            { $pull: { answers: answerId } },
            { new: true }
        );
    });

    it("should return 404 if no answer is found for deletion", async () => {
        const answerId = "nonexistentAnswerId";

        // Set up mock to simulate answer not found
        Question.findOne.mockResolvedValue(null);

        // Making the delete request
        const response = await app.delete(`/answer/deleteAnswer/${answerId}`);

        // Asserting the response
        expect(response.status).toBe(404);
        expect(response.body).toEqual({
            message: "Question containing answer not found"
        });
    });

    it("should return 404 if no question contains the answer", async () => {
        const answerId = "orphanAnswerId";

        // Setup mocks
        Question.findOne.mockResolvedValue(null);
        Answer.deleteOne.mockResolvedValue({ deletedCount: 0 });  // Answer not deleted because it's not found

        // Making the delete request
        const response = await app.delete(`/answer/deleteAnswer/${answerId}`);

        // Asserting the response
        expect(response.status).toBe(404);
        expect(response.body).toEqual({
            message: "Question containing answer not found"
        });
    });

    it("should handle server errors gracefully", async () => {
        const answerId = "errorAnswerId";
    
        // Set up mocks to throw an error
        Question.findOne.mockRejectedValue(new Error("Internal server error"));
    
        // Making the delete request
        const response = await app.delete(`/answer/deleteAnswer/${answerId}`);
    
        // Asserting the response
        expect(response.status).toBe(500);
        expect(response.body).toEqual({
            message: "Internal server error",
            error: "Error: Internal server error"  // Correcting the expected error message format
        });
    });

    it("should return 404 if the answer is not found for deletion", async () => {
        const answerId = "nonexistentAnswerId";

        // Setup mocks for database queries
        // Simulate finding the question that might contain the answer
        Question.findOne.mockResolvedValue({
            _id: "dummyQuestionId",
            answers: [answerId]
        });
        // Simulate the deletion attempt that fails to find the answer
        Answer.deleteOne.mockResolvedValue({ deletedCount: 0 });

        // Making the delete request
        const response = await app.delete(`/answer/deleteAnswer/${answerId}`);

        // Asserting the response
        expect(response.status).toBe(404);
        expect(response.body).toEqual({
            message: "Answer not found"
        });

        // Verify interaction with models
        expect(Question.findOne).toHaveBeenCalledWith({ answers: { $in: [answerId] } });
        expect(Answer.deleteOne).toHaveBeenCalledWith({ _id: answerId });
    });

    it("should handle failure to update the question after deleting an answer", async () => {
        const answerId = "dummyAnswerId";
        const questionId = "dummyQuestionId";

        // Setup mocks for database queries
        // Simulate finding the question that includes the answer
        Question.findOne.mockResolvedValue({
            _id: questionId,
            answers: [answerId]
        });
        // Simulate successful deletion of the answer
        Answer.deleteOne.mockResolvedValue({ deletedCount: 1 });
        // Simulate the failure of updating the question
        Question.findByIdAndUpdate.mockResolvedValue(null);

        // Making the delete request
        const response = await app.delete(`/answer/deleteAnswer/${answerId}`);

        // Asserting the response
        expect(response.status).toBe(500);
        expect(response.body).toEqual({
            message: "Failed to update question"
        });

        // Verify interaction with models
        expect(Question.findOne).toHaveBeenCalledWith({ answers: { $in: [answerId] } });
        expect(Answer.deleteOne).toHaveBeenCalledWith({ _id: answerId });
        expect(Question.findByIdAndUpdate).toHaveBeenCalledWith(
            questionId,
            { $pull: { answers: answerId } },
            { new: true }
        );
    });
    
});



