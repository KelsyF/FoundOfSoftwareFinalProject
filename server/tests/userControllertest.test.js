const supertest = require("supertest");
const mongoose = require("mongoose");

const User = require("../models/user");
const Post = require("../models/questions");
const Answer = require("../models/answers");
const server = require("../server");

jest.mock("../models/user");
jest.mock("../models/questions");
jest.mock("../models/answers");

describe("UserController Operations", () => {
    let app;

    beforeAll(() => {
        app = supertest(server);
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    beforeEach(() => {
        jest.spyOn(console, 'log').mockImplementation(() => {});
        jest.spyOn(console, 'error').mockImplementation(() => {});  
    });
    
    afterEach(() => {
        console.error.mockRestore();  
        jest.clearAllMocks();
    });
    

    describe("POST /addUser", () => {
        it("should create a user if username is not taken", async () => {
            const userData = { username: "newuser", password: "password123" };
            User.findOne.mockResolvedValue(null);
            User.create.mockResolvedValue({ username: "newuser", _id: "user123", password: "password123" });

            const response = await app.post("/user/addUser").send(userData);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ success: true, user: { username: "newuser", _id: "user123" } });
            expect(User.findOne).toHaveBeenCalledWith({ username: "newuser" });
        });

        it("should return error if username is already taken", async () => {
            const userData = { username: "existinguser", password: "password123" };
            User.findOne.mockResolvedValue(userData);

            const response = await app.post("/user/addUser").send(userData);

            expect(response.status).toBe(409);
            expect(response.body).toEqual({ success: false, message: "Username already in use" });
        });

        it("should return a 400 error if required fields are missing", async () => {
            const missingData = [{}, { username: "user" }, { password: "pass" }];
    
            for (const data of missingData) {
                const response = await app.post("/user/addUser").send(data);
    
                expect(response.status).toBe(400);
                expect(response.body).toEqual({ success: false, msg: 'Bad request: Missing required fields' });
            }
        });

        it("should return a 500 internal server error if the server encounters an exception", async () => {
            const userData = { username: "newuser", password: "securepassword" };
            User.findOne.mockResolvedValue(null);
            User.create.mockRejectedValue(new Error("Simulated database failure"));
    
            const response = await app.post("/user/addUser").send(userData);
    
            expect(response.status).toBe(500);
            expect(response.body).toEqual({
                success: false, 
                msg: 'Internal server error', 
                error: "Simulated database failure"
            });
            expect(User.findOne).toHaveBeenCalledWith({ username: "newuser" });
            expect(User.create).toHaveBeenCalledWith({ username: "newuser", password: "securepassword" });
        });
    });

    describe("POST /login", () => {
        it("should authenticate user with correct credentials", async () => {
            const loginData = { username: "user", password: "password" };
            User.findOne.mockResolvedValue(loginData);

            const response = await app.post("/user/login").send(loginData);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ success: true, message: "Logged in successfully", user: loginData });
        });

        it("should reject login with incorrect credentials", async () => {
            const loginData = { username: "user", password: "password" };
            User.findOne.mockResolvedValue(null);

            const response = await app.post("/user/login").send(loginData);

            expect(response.status).toBe(401);
            expect(response.body).toEqual({ success: false, message: "Invalid credentials" });
        });
    });


    describe("GET /username/:username/posts", () => {
        it("should return 404 if no user is found for the given username", async () => {
            const username = "nonexistentUser";
            User.findOne.mockResolvedValue(null);  
    
            const response = await app.get(`/user/username/${username}/posts`);
    
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ success: false, message: "User not found" });
            expect(User.findOne).toHaveBeenCalledWith({ username });
        });
    
        it("should return user posts if user is found", async () => {
            const username = "existingUser";
            const mockUser = { _id: "user123" };
            const mockPosts = [{
                _id: "post123",
                title: "Sample Post",
                text: "This is a sample post.",
                ask_date_time: new Date(),
                views: 150,
                tags: [{ _id: "tag123", name: "Node.js" }]
            }];
        
            User.findOne.mockResolvedValue(mockUser);
        
            const populateMock = jest.fn().mockResolvedValue(mockPosts);
            Post.find.mockReturnValue({ populate: populateMock });  
            const response = await app.get(`/user/username/${username}/posts`);
        
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.posts).toHaveLength(1);
            expect(response.body.posts[0]).toHaveProperty("title", "Sample Post");
            expect(response.body.posts[0].tags).toEqual(["Node.js"]);
            expect(populateMock).toHaveBeenCalledWith('tags', 'name'); 
        });
        
    
        it("should handle errors during fetching posts", async () => {
            const username = "userWithError";
            User.findOne.mockResolvedValue({ _id: "user456" });  
            Post.find.mockImplementation(() => {
                throw new Error("Simulated database error");  
            });
    
            const response = await app.get(`/user/username/${username}/posts`);
    
            expect(response.status).toBe(500);
            expect(response.body).toEqual({
                success: false,
                message: "Simulated database error"
            });
            expect(console.error).toHaveBeenCalledWith("Error fetching posts:", "Simulated database error");
        });
    });
    
    describe("GET /username/:username/answers", () => {
        it("should return 404 if no user is found for the given username when fetching answers", async () => {
            const username = "nonexistentUser";
            User.findOne.mockResolvedValue(null);  
        
            const response = await app.get(`/user/username/${username}/answers`);
        
            expect(response.status).toBe(404);
            expect(response.body).toEqual({
                success: false,
                message: "User not found"
            });
            expect(console.log).toHaveBeenCalledWith("No user found with username:", username);
        });

        it("should return user answers if user is found", async () => {
            const username = "existingUser";
            const mockUser = { _id: "user123" };
            const mockAnswers = [{ _id: "answer123", text: "Sample answer", ans_date_time: new Date() }];
            const mockPosts = [{ _id: "post123", title: "Sample Post", answers: mockAnswers }];
    
            User.findOne.mockResolvedValue(mockUser);
            Answer.find.mockResolvedValue(mockAnswers);
            Post.find.mockReturnValue({
                populate: jest.fn().mockResolvedValue(mockPosts)  
            });
    
            const response = await app.get(`/user/username/${username}/answers`);
    
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.answers).toHaveLength(1);
            expect(response.body.answers[0]).toMatchObject({
                questionId: "post123",
                questionTitle: "Sample Post",
                answerId: "answer123",
                text: "Sample answer"
            });
        });
    
        
        it("should handle errors during fetching answers", async () => {
            const username = "userWithError";
            User.findOne.mockResolvedValue({ _id: "user123" });  
            Answer.find.mockImplementation(() => {
                throw new Error("Simulated database error");  
            });
    
            const response = await app.get(`/user/username/${username}/answers`);
    
            expect(response.status).toBe(500);
            expect(response.body).toEqual({
                success: false,
                message: "Simulated database error"
            });
            expect(console.error).toHaveBeenCalledWith("Error fetching answers:", "Simulated database error");
        });
        
    });



    describe("DELETE /deleteUser/:username", () => {
        it("should delete a user and related data", async () => {
            const mockUser = { _id: "user123", username: "userToDelete" };
            User.findOne.mockResolvedValue(mockUser);
            Post.deleteMany.mockResolvedValue({ deletedCount: 2 });
            Answer.deleteMany.mockResolvedValue({ deletedCount: 3 });
            User.deleteOne.mockResolvedValue({ deletedCount: 1 });

            const response = await app.delete(`/user/deleteUser/${mockUser.username}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ success: true, message: "User and all related data deleted successfully" });
        });

        it("should handle deletion when user is not found", async () => {
            User.findOne.mockResolvedValue(null);

            const response = await app.delete("/user/deleteUser/nonexistentUser");

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ success: false, message: "User not found" });
        });

        it("should handle errors during user deletion", async () => {
            const username = "userWithDeletionError";
            const mockUser = { _id: "user123", username: username };
            User.findOne.mockResolvedValue(mockUser);  
            User.deleteOne.mockImplementation(() => {
                throw new Error("Simulated deletion error");  
            });
    
            const response = await app.delete(`/user/deleteUser/${username}`);
    
            expect(response.status).toBe(500);
            expect(response.body).toEqual({
                success: false,
                message: "Simulated deletion error"
            });
            expect(console.error).toHaveBeenCalledWith(`Error deleting user: Error: Simulated deletion error`);
        });

    });

    
});
