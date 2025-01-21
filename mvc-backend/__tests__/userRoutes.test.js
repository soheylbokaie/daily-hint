import express from 'express';
import router from '../routes/userRoutes.js';
import request from 'supertest';
import app from '../app'; // Adjust the import to your app's entry point

describe('User Routes', () => {
  
  describe('GET /', () => {
    it('should get all users', async () => {
      const res = await request(app).get('/');
      expect(res.statusCode).toBe(200);
    });
  });

  describe('POST /', () => {
    it('should create a new user', async () => {
      const userData = {
        email: 'test@test.com',
        password: 'password123'
      };
      const res = await request(app).post('/').send(userData);
      expect(res.statusCode).toBe(201);
    });
  });

  describe('DELETE /:id', () => {
    it('should delete a user', async () => {
      const res = await request(app).delete('/123');
      expect(res.statusCode).toBe(200);
    });
  });

  describe('PUT routes', () => {
    it('should update user language', async () => {
      const res = await request(app).put('/language/123').send({ language: 'es' });
      expect(res.statusCode).toBe(200);
    });

    it('should toggle user theme', async () => {
      const res = await request(app).put('/theme/123');
      expect(res.statusCode).toBe(200);
    });

    it('should change user password', async () => {
      const res = await request(app).put('/password/123').send({
        oldPassword: 'old123',
        newPassword: 'new123'
      });
      expect(res.statusCode).toBe(200);
    });
  });

  describe('Password reset flow', () => {
    it('should request password reset', async () => {
      const res = await request(app).post('/request-reset-password').send({
        email: 'test@test.com'
      });
      expect(res.statusCode).toBe(200);
    });

    it('should reset password', async () => {
      const res = await request(app).put('/reset-password').send({
        token: 'validToken123',
        newPassword: 'new123'
      });
      expect(res.statusCode).toBe(200);
    });
  });

  describe('Alarm routes', () => {
    it('should add new alarm', async () => {
      const res = await request(app).post('/alarm/123').send({
        time: '08:00',
        days: ['Monday', 'Wednesday']
      });
      expect(res.statusCode).toBe(201);
    });

    it('should modify existing alarm', async () => {
      const res = await request(app).put('/alarm/123/456').send({
        time: '09:00',
        days: ['Tuesday', 'Thursday']
      });
      expect(res.statusCode).toBe(200);
    });
  });

  describe('PUT /change-password', () => {
    it('should change user password', async () => {
      const res = await request(app)
        .put('/change-password')
        .send({ userId: '123', newPassword: 'newpassword' });
      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toEqual('Password changed successfully');
    });
  });
});

describe('GET /', () => {
  it('should return 200 OK', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
  });
});