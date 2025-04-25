import { Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';
import { Signup } from '../../application/use-cases/auth/SignUp';
import { Signin } from '../../application/use-cases/auth/SignIn';
import { MongoUserRepository } from '../repositories/MongoUserRepository';
import { userVerification } from '../middleware/AuthMiddleware';

const router = Router();
router.post("/signup", Signup);
router.post("/signin", Signin);
router.post("/", userVerification);

// const userRepo = new MongoUserRepository();

// router.post('/signup', async (req: Request, res: Response) => {
//   try {
//     const { email, password } = req.body;
//     const signUp = new SignUp(userRepo);
//     await signUp.execute(email, password);
//     res.status(201).json({ message: 'User created' });
//   } catch (err: any) {
//     res.status(400).json({ error: err.message });
//   }
// });


// router.post('/login', async (req: Request, res: Response) => {
//   try {
//     const { email, password } = req.body;
//     const signIn = new SignIn(userRepo);
//     const user = await signIn.execute(email, password);

//     const accessToken = jwt.sign(
//       { userId: user.id },
//       process.env.JWT_SECRET!,
//       { expiresIn: '15m' }
//     );



//     // template refresh token 
//     res.cookie('refreshToken', 'dummy-refresh-token', {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: 'strict',
//     });

//     res.json({ token: accessToken });
//   } catch (err: any) {
//     res.status(401).json({ error: err.message });
//   }
// });

// router.post('/logout', (req, res) => {
//   res.clearCookie('refreshToken');
//   res.json({ message: 'Logged out' });
// });

export default router;
