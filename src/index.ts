// imports //
import express, { Express, Request, Response } from 'express';
import body from 'body-parser';

// routes //
import verify from './routes/verify';
import { connectToDatabase } from './services/database';

const start = async () => {

    const app: Express = express();
    await connectToDatabase()

    app.use(body.json({
        limit: "500kb"
    }))

    app.use('/verify', verify)

    app.get("/", (req: Request, res: Response) => {

        let data = {
            res: "gello",
            dsad: "bye"
        }

        res.status(200).send(data);
    })

    app.listen(process.env.PORT, () => {
        console.log(`Listening at: http://localhost:${process.env.PORT}`);
    })
}

start();