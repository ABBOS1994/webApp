// tests/users.test.js
const request = require('supertest');
const app = require('../app');

describe('POST /users/updateBalance/:userId/:amount', () => {
    it('test 10000 zapros', async () => {
        const promises = [];
        for (let i = 0; i < 10000; i++) {
            promises.push(request(app).post('/users/updateBalance/1/2'));
        }
        const responses = await Promise.all(promises);
        let successCount = 0;
        let errorCount = 0;
        responses.forEach((response) => {
            if (response.status === 200) {
                successCount++;
            }
            if (response.status === 400 && response.body.error === 'Insufficient funds') {
                errorCount++;
            }
        });
        expect(successCount).toBe(5000);
        expect(errorCount).toBe(5000);
    });
    afterAll(() => {
        jest.restoreAllMocks();
    });
});
