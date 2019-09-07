import { Router } from "express";

import Auth from './auth/auth.router';

const router = Router();

router.use('/auth',Auth);

export default router;
