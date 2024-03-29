import express, { Response, Request } from 'express';
import jwt from 'jsonwebtoken'
import { dbHandler } from '../database_integration/DataBaseWorker';
import { Types } from 'mongoose';

import dotenv from 'dotenv';
dotenv.config();



const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  const error = req.query.error;
  const employeeId = req.query.employeeId as string | Types.ObjectId;
  res.render('verify-2fa', { error: error, employeeId: employeeId });
});


router.post('/', async (req, res) => {
    const { twoFactorCode, employeeId } = req.body;

    try {

        const isValid2FA = await dbHandler.verify2FACode(employeeId, twoFactorCode);
        if (!isValid2FA) {
          return res.redirect(`/verify-2fa?error=Invalid 2FA code!&employeeId=${employeeId}`);
        }

        const jwtToken = jwt.sign(
          { id: employeeId, email: isValid2FA.email },
          process.env.JWT_SECRET as string,
          { expiresIn: '20s' }
        );
  
        res.cookie('token', jwtToken, {
          httpOnly: true,
          secure: false, 
          sameSite: 'strict',
          maxAge: 3600000,
        });

        return res.redirect('main');
    } catch (error) {
        console.error("Login error: ", error);
        res.status(500).json({ message: "Server error during login" });
      }
  });


export default router;