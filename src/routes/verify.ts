import { createSessionID, verifyByID, success, failure} from '../controllers/verifyUser';

import express, { Router } from 'express';

const router = Router();

console.log("Loading - /verify route");

// router.use(express.static('../public/verify'))

router.post("/createsession", createSessionID);

router.get("/", (req, res) => res.redirect("/"))

router.get("/:uid/:sid", verifyByID);

router.get("/success", success);

router.get("/fail", failure);

export default router;