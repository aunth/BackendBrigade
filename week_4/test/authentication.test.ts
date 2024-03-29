import request from 'supertest';
import { app } from '../src/app';
import { dbWorker } from '../src/database_integration/DataBaseWorker';


describe('Authentication System', () => {
    
    describe('POST /login', () => {
      it('should reject login with incorrect email', async () => {
          const response = await request(app)
          .post('/login')
          .send({ email: 'nonexistent@example.com', password: '1111' });
        
        expect(response.headers.location).toContain('/?error=Email does not match!');
      });
  
      it('should reject login with incorrect password', async () => {
          const response = await request(app)
          .post('/login')
          .send({ email: 'biletskyi.game@gmail.com', password: '1234' });
        
        expect(response.headers.location).toContain('/?error=Password does not match!');
      });
  
      it('should redirect to verify 2FA for users with 2FA enabled', async () => {
          const mockEmployee = {
              id: 1,
              email: "biletskyi.game@gmail.com",
              password: '1111',
              employee_id: 1,
              two_fa_code: null
          };
          
          const stub = jest.spyOn(dbWorker, 'getEmployeeByEmail').mockResolvedValue(mockEmployee);
          
          const response = await request(app)
            .post('/login')
            .send({ email: 'biletskyi.game@gmail.com', password: '1111' });
          
          expect(response.headers.location).toContain(`/verify-2fa?employeeId=${encodeURIComponent(mockEmployee.employee_id)}`);
          
          stub.mockRestore();
        });
  
    });
  
    describe('POST /verify-2fa', () => {
      it('should reject with invalid 2FA code', async () => {
        const response = await request(app)
          .post('/verify-2fa')
          .send({ twoFactorCode: '0000', employeeId: '1' });
  
        expect(response.headers.location).toContain('/verify-2fa?error=Invalid 2FA code!');
      });
    });
  });