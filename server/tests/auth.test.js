const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index');
const User = require('../models/User');

describe('Auth API', () => {
    // Generate random email to avoid collisions on real DB
    const testEmail = `test_${Date.now()}@example.com`;
    const testPassword = 'password123';
    let token = '';

    // Clean up slightly dangerous if running on real production DB, 
    // but assuming dev environment. Better to just create new users.
    afterAll(async () => {
        // Optional: Delete the test user
        await User.deleteOne({ email: testEmail });
        // Close mongoose connection to allow Jest to exit
        await mongoose.connection.close();
    });

    it('should register a new user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                email: testEmail,
                password: testPassword
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('token');
        expect(res.body).toHaveProperty('email', testEmail.toLowerCase()); // Model lowercases it

        token = res.body.token; // Save for next tests
    });

    it('should login with valid credentials', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: testEmail,
                password: testPassword
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
        token = res.body.token;
    });

    it('should not login with invalid password', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: testEmail,
                password: 'wrongpassword'
            });

        expect(res.statusCode).toEqual(401);
    });

    it('should access protected profile route', async () => {
        const res = await request(app)
            .get('/api/preferences')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.email).toEqual(testEmail.toLowerCase());
    });
});
