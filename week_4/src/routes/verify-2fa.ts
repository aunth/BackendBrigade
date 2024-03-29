import express, { Response, Request } from 'express';
import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs';
import passport  from 'passport';
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
    //const employeeId = req.query.employeeId as string | Types.ObjectId;

    console.log(twoFactorCode);
    console.log(employeeId);

    try {

      //if (!twoFactorCode) {
      //  await handle2FACodeRequest(employee.email);
      //  return res.status(200).json({ message: "2FA code sent to your email." });
      //} else {

        const isValid2FA = await dbHandler.verify2FACode(employeeId, twoFactorCode);
        if (!isValid2FA) {
          return res.redirect(`/verify-2fa?error=Invalid 2FA code!&employeeId=${employeeId}`);
          //return res.status(400).json({ message: "Invalid 2FA code." });
        }

        const jwtToken = jwt.sign(
          { id: employeeId, email: isValid2FA.email },
          process.env.JWT_SECRET as string,
          { expiresIn: '15h' }
        );
  
        res.cookie('token', jwtToken, {
          httpOnly: true,
          secure: false,  //process.env.NODE_ENV !== 'development',
          sameSite: 'strict',
          maxAge: 3600000,
        });

        console.log(jwtToken);

        return res.redirect('main');
        //return res.json({ message: "Login successful", token: jwtToken });
      //}
    } catch (error) {
        console.error("Login error: ", error);
        res.status(500).json({ message: "Server error during login" });
      }
  });



  //router.post('/refresh', async (req, res) => {
  //  const { refreshToken } = req.body;
  //
  //  if (!refreshToken) return res.status(401).json({ message: 'No refresh token provided' });
  //
  //  try {
  //    const decoded = jwt.verify(refreshToken, refreshTokenKey);
  //    const user = await User.findById(decoded.id);
  //
  //    if (user.refreshToken !== refreshToken) return res.status(403).json({ message: 'Refresh token mismatch' });
  //
  //    const newPayload = { id: user.id, email: user.email };
  //    const newAccessToken = jwt.sign(newPayload, secretOrKey, { expiresIn: '15m' });
  //
  //    res.json({ success: true, accessToken: newAccessToken });
  //  } catch (err) {
  //    console.error(err);
  //    res.status(403).json({ message: 'Invalid refresh token' });
  //  }
  //});


export default router;