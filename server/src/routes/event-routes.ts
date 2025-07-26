import { Router } from 'express';
import { createEvent, saveEvent } from '../controllers/event-controller';

const router = Router();

router.post('/createEvent', createEvent);

router.post('/saveEvent', saveEvent);

export default router;
