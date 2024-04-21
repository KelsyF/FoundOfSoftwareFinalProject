// Unit tests for getTagsWithQuestionNumber in controller/tags.js

const supertest = require("supertest")

const Tag = require('../models/tags');
const Question = require('../models/questions');
const { default: mongoose } = require("mongoose");

// Mock data for tags
const mockTags = [
  { name: 'tag1' },
  { name: 'tag2' },
  // Add more mock tags if needed
];
 
const mockQuestions = [
    { tags: [mockTags[0], mockTags[1]] },
    { tags: [mockTags[0]] },
]

let server;
describe('GET /getTagsWithQuestionNumber', () => {

    beforeEach(() => {
        server = require("../server");
    })
    afterEach(async() => {
        //server.close();
        await mongoose.disconnect()
    });

    it('should return tags with question numbers', async () => {
        // Mocking Tag.find() and Question.find()
        Tag.find = jest.fn().mockResolvedValueOnce(mockTags);
    
        Question.find = jest.fn().mockImplementation(() => ({ populate: jest.fn().mockResolvedValueOnce(mockQuestions)}));

        // Making the request
        const response = await supertest(server).get('/tag/getTagsWithQuestionNumber');

        // Asserting the response
        expect(response.status).toBe(200);

        // Asserting the response body
        expect(response.body).toEqual([
            { name: 'tag1', qcnt: 2 },
            { name: 'tag2', qcnt: 1 },
      
        ]);
        expect(Tag.find).toHaveBeenCalled();
        expect(Question.find).toHaveBeenCalled();
  });

  it('should handle error when failed to fetch tags', async () => {
    // Mocking Tag.find() to throw an error
    Tag.find = jest.fn().mockRejectedValueOnce(new Error('Failed to fetch tags'));

    // Making the request
    const response = await supertest(server).get('/tag/getTagsWithQuestionNumber');

    // Asserting the response status
    expect(response.status).toBe(500);

    // Asserting the response body
    expect(response.body).toEqual({ message: "Failed to fetch tags", error: "Failed to fetch tags" });

    // Asserting that Tag.find() was called
    expect(Tag.find).toHaveBeenCalled();
});

});




describe('GET /deleteTag/:tagName', () => {

    beforeEach(() => {
        server = require("../server");
    })

    afterEach(async() => {
        //server.close();
        await mongoose.disconnect()
    });

    it('should delete a tag successfully', async () => {
        const tagName = 'tagToDelete';
    
        // Mocking Tag.findOne() to return a tag
        Tag.findOne = jest.fn().mockResolvedValueOnce({ _id: 'tagId' });
    
        // Mocking Question.updateMany() and Tag.deleteOne() to return deletion results
        Question.updateMany = jest.fn().mockResolvedValueOnce({ nModified: 1 });
        Tag.deleteOne = jest.fn().mockResolvedValueOnce({ deletedCount: 1 });
    
        // Making the request
        const response = await supertest(server).delete(`/tag/deleteTag/${tagName}`);
    
        // Asserting the response status
        expect(response.status).toBe(200);
    
        // Asserting the response body
        expect(response.text).toBe('Tag deleted successfully');
    
        // Asserting the database operations
        expect(Tag.findOne).toHaveBeenCalledWith({ name: tagName });
        expect(Question.updateMany).toHaveBeenCalledWith({}, { $pull: { tags: 'tagId' } });
        expect(Tag.deleteOne).toHaveBeenCalledWith({ _id: 'tagId' });
    });
    
    it('should return 404 if tag not found', async () => {
        const tagName = 'nonExistentTag';
    
        // Mocking Tag.findOne() to return null
        Tag.findOne = jest.fn().mockResolvedValueOnce(null);
    
        // Making the request
        const response = await supertest(server).delete(`/tag/deleteTag/${tagName}`);
    
        // Asserting the response status
        expect(response.status).toBe(404);
    
        // Asserting the response body
        expect(response.text).toBe('Tag not found');
    });
    
    it('should return 404 if failed to delete tag from Tag collection', async () => {
        const tagName = 'tagToDelete';
    
        // Mocking Tag.findOne() to return a tag
        Tag.findOne = jest.fn().mockResolvedValueOnce({ _id: 'tagId' });
    
        // Mocking Question.updateMany() to return deletion result
        Question.updateMany = jest.fn().mockResolvedValueOnce({ nModified: 1 });
    
        // Mocking Tag.deleteOne() to return deletion result of 0
        Tag.deleteOne = jest.fn().mockResolvedValueOnce({ deletedCount: 0 });
    
        // Making the request
        const response = await supertest(server).delete(`/tag/deleteTag/${tagName}`);
    
        // Asserting the response status
        expect(response.status).toBe(404);
    
        // Asserting the response body
        expect(response.text).toBe('Tag not found in Tag collection');
    });
    
    it('should handle internal server error', async () => {
        const tagName = 'tagToDelete';
    
        // Mocking Tag.findOne() to throw an error
        Tag.findOne = jest.fn().mockRejectedValueOnce(new Error('Database error'));
    
        // Making the request
        const response = await supertest(server).delete(`/tag/deleteTag/${tagName}`);
    
        // Asserting the response status
        expect(response.status).toBe(500);
    
        // Asserting the response body
        expect(response.body).toEqual({ message: "Failed to delete tag", error: "Database error" });
    });
    


});
