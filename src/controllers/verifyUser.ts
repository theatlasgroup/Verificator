import { Request, Response } from 'express';
import crypto from 'crypto';

import { collections } from '../services/database';
import { ObjectId } from 'mongodb';
import { VerificationEvents } from '../types/Verification';

export async function createSessionID(req: Request, res: Response) { // POST
    try {
        const userid = await req.body.userid; // User ID
        const verificatorid = await req.body.verificatorid; // Verificating ID
        const apikey = await req.body.apikey; // API key

        if (apikey == null) {
            res.status(400).json({ message: "Missing [apikey]" });
            return;
        }

        const user = await collections.users?.findOne({
            apikeys: {
                $in: [ apikey ]
            },
        })

        if (user == null) {
            res.status(403).json({ message: "Invalid User ID or API Key", event: VerificationEvents.Invalid });
            return;
        }

        if (user.userid != userid) {
            res.status(403).json({ message: "Invalid User ID or API Key", event: VerificationEvents.Invalid });
            return;
        }

        if (!userid) {
            res.status(400).json({ message: "Missing [userid]", event: VerificationEvents.Missing });
            return;
        }

        const verificator = await collections.verification?.findOne({
            verificatorid: String(verificatorid)
        })

        if (verificator?.completed == VerificationEvents.Success) {
            res.status(200).json({ message: "This user has already verified.", event: VerificationEvents.Verified });
            return;
        }

        if (verificator != null) {
            res.status(401).json({ message: "User already has a session.", event: VerificationEvents.SessionInProgress });
            return;
        }

        if (!verificatorid) {
            res.status(400).json({ message: "Missing [userid]", event: VerificationEvents.Missing });
            return;
        }

        // const sessionid = crypto.createHash('sha1').update((uid * vid * Date.now()).toString()).digest('hex');

        const id = await collections.verification?.insertOne({ // Get
            userid: String(userid),
            verificatorid: String(verificatorid),
            completed: VerificationEvents.Incomplete,
            timestamp: new Date()
        })

        await collections.verification?.createIndex({ "timestamp": 1 }, { expireAfterSeconds: 120 })

        res.json({ sessionid: id?.insertedId, event: VerificationEvents.Granted })
    } catch (e) {
        res.status(500).json({ event: VerificationEvents.Error });
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
            return;
        }

        const session = await collections.verification?.findOne({
            _id: id
        })

        if (session == null) {
            res.status(404).send("Invalid Session or user ID");
            return;
        }

        if (session?.userid != userid) {
            res.status(404).send("Invalid Session or User ID");
            return;
        }

        if (session?.completed == VerificationEvents.Success) {
            res.status(200).send("This user has already been verified.");
            return;
        }

        // Do captcha stuff 

        const success = VerificationEvents.Success; // simulating success (Temporary)

        // Send Results back
        if (success == VerificationEvents.Success) {
            await collections.verification?.updateOne({ _id: new ObjectId(sessionid) }, { $set: { completed: VerificationEvents.Success } });
            res.status(202).send("Successfully verified. You may now close this tab.");
            return;
        }

    } catch (e) {
        res.sendStatus(500)
        console.error(e)
    }
}

export async function success(req: Request, res: Response) {

}


export async function failure(req: Request, res: Response) {

}