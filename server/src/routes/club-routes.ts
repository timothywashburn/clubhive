import { Router } from 'express';
import { createClub, joinClub } from '../controllers/club-controller';

const router = Router();

router.post('/createClub', createClub);

router.post('/joinClub', joinClub);

export default router;
