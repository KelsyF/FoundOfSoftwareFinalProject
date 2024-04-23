const supertest = require("supertest")
const Tag = require('../models/tags');
const Question = require('../models/questions');
const { default: mongoose } = require("mongoose");


const mockTags = [
  { name: 'tag1' },
  { name: 'tag2' },
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
        await mongoose.disconnect()
    });

    it('should return tags with question numbers', async () => {
        Tag.find = jest.fn().mockResolvedValueOnce(mockTags);
    
        Question.find = jest.fn().mockImplementation(() => ({ populate: jest.fn().mockResolvedValueOnce(mockQuestions)}));

        const response = await supertest(server).get('/tag/getTagsWithQuestionNumber');

        expect(response.status).toBe(200);

        expect(response.body).toEqual([
            { name: 'tag1', qcnt: 2 },
            { name: 'tag2', qcnt: 1 },
      
        ]);
        expect(Tag.find).toHaveBeenCalled();
        expect(Question.find).toHaveBeenCalled();
  });

  it('should handle error when failed to fetch tags', async () => {
    Tag.find = jest.fn().mockRejectedValueOnce(new Error('Failed to fetch tags'));

    const response = await supertest(server).get('/tag/getTagsWithQuestionNumber');

    expect(response.status).toBe(500);

    expect(response.body).toEqual({ message: "Failed to fetch tags", error: "Failed to fetch tags" });

    expect(Tag.find).toHaveBeenCalled();
});

});




describe('GET /deleteTag/:tagName', () => {

    beforeEach(() => {
        server = require("../server");
    })

    afterEach(async() => {
        await mongoose.disconnect()
    });

    it('should delete a tag successfully', async () => {
        const tagName = 'tagToDelete';
    
        Tag.findOne = jest.fn().mockResolvedValueOnce({ _id: 'tagId' });
    
        Question.updateMany = jest.fn().mockResolvedValueOnce({ nModified: 1 });
        Tag.deleteOne = jest.fn().mockResolvedValueOnce({ deletedCount: 1 });
    
        const response = await supertest(server).delete(`/tag/deleteTag/${tagName}`);
    
        expect(response.status).toBe(200);
    
        expect(response.text).toBe('Tag deleted successfully');
    
        expect(Tag.findOne).toHaveBeenCalledWith({ name: tagName });
        expect(Question.updateMany).toHaveBeenCalledWith({}, { $pull: { tags: 'tagId' } });
        expect(Tag.deleteOne).toHaveBeenCalledWith({ _id: 'tagId' });
    });
    
    it('should return 404 if tag not found', async () => {
        const tagName = 'nonExistentTag';
    
        Tag.findOne = jest.fn().mockResolvedValueOnce(null);
    
        const response = await supertest(server).delete(`/tag/deleteTag/${tagName}`);
    
        expect(response.status).toBe(404);
    
        expect(response.text).toBe('Tag not found');
    });
    
    it('should return 404 if failed to delete tag from Tag collection', async () => {
        const tagName = 'tagToDelete';
    
        Tag.findOne = jest.fn().mockResolvedValueOnce({ _id: 'tagId' });
    
        Question.updateMany = jest.fn().mockResolvedValueOnce({ nModified: 1 });
    
        Tag.deleteOne = jest.fn().mockResolvedValueOnce({ deletedCount: 0 });
    
        const response = await supertest(server).delete(`/tag/deleteTag/${tagName}`);
    
        expect(response.status).toBe(404);
    
        expect(response.text).toBe('Tag not found in Tag collection');
    });
    
    it('should handle internal server error', async () => {
        const tagName = 'tagToDelete';
    
        Tag.findOne = jest.fn().mockRejectedValueOnce(new Error('Database error'));
    
        const response = await supertest(server).delete(`/tag/deleteTag/${tagName}`);
    
        expect(response.status).toBe(500);
    
        expect(response.body).toEqual({ message: "Failed to delete tag", error: "Database error" });
    });
    


});
