import { Request, Response } from 'express';
import crypto from 'crypto';

import { collections } from '../services/database';
import { ObjectId } from 'mongodb';

export async function createSessionID(req: Request, res: Response) { // POST
    try {
        const userid = await req.body.userid; // User ID
        const verificatorid = await req.body.verificatorid; // Verificating ID
        const apikey = await req.body.apikey; // API key

        if (apikey == null) {
            res.status(400).json({ message: "Missing [apikey]" });
            return;
        }

        const verificator = await collections.verification?.findOne({
            verificatorid: String(verificatorid)
        })

        if (verificator?.completed == "SUCCESS") {
            res.status(200).json({ message: "This user has already verified." });
            return;
        }

        if (verificator != null) {
            res.status(401).json({ message: "User already has a session." });
            return;
        }

        const user = await collections.users?.findOne({
            apikeys: {
                $in: [ apikey ]
            },
        })

        // user.

        if (user == null) {
            res.status(403).json({ message: "Invalid User ID or API Key" });
            return;
        }

        if (user.userid != userid) {
            res.status(403).json({ message: "Invalid User ID or API Key" });
            return;
        }

        if (!userid) {
            res.status(400).json({ message: "Missing [userid]" });
            return;
        }

        if (!verificatorid) {
            res.status(400).json({ message: "Missing [userid]" });
            return;
        }

        // const sessionid = crypto.createHash('sha1').update((uid * vid * Date.now()).toString()).digest('hex');

        const id = await collections.verification?.insertOne({ // Get
            userid: String(userid),
            verificatorid: String(verificatorid),
            completed: "INCOMPLETE",
            timestamp: new Date()
        })

        await collections.verification?.createIndex({ "timestamp": 1 }, { expireAfterSeconds: 120 })

        res.json({ sessionid: id?.insertedId })
    } catch (e) {
        res.status(500);
        console.error(e);
    }
}

export async function verifyByID(req: Request, res: Response) { // GET -> /:uid/:sid
    try {
        const userid = req.params.uid as String; // User ID
        const sessionid = req.params.sid; // Session ID

        // Check if Session ID is valid

        let id;

        try {
            id = new ObjectId(sessionid);
        } catch (e) {
            res.status(404).send("Invalid session or user ID");
            console.error(e)
            return;
        }

        const session = await collections.verification?.findOne({
            _id: new ObjectId(sessionid)
        })

        if (session == null) {
            res.status(404).send("Invalid Session or user ID");
            return;
        }

        if (session?.userid != userid) {
            res.status(404).send("Invalid Session or User ID");
            return;
        }

        if (session?.completed == "SUCCESS") {
            res.status(200).send("This user has already been verified.");
            return;
        }

        // Do captcha stuff 

        const success = true; // simulating success (Temporary)

        // Send Results back
        if (success) {
            await collections.verification?.updateOne({ _id: new ObjectId(sessionid) }, { $set: { completed: "SUCCESS" } });
            res.status(202).send("Successfully verified. You may now close this tab.");
            return;
        }

    } catch (e) {
        res.sendStatus(500)
        console.error(e)
    }
}