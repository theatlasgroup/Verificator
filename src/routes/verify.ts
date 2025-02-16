import { createSessionID, verifyByID } from '../controllers/verifyUser';

import { Router } from 'express';

const routes = Router();

console.log("Loading - /verify route");

routes.post("/createsession", createSessionID);

routes.get("/:uid/:sid", verifyByID);

export default routes;