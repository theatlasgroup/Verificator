import { ObjectId } from "mongodb";

export default class Verification {
    constructor(
        public userid: string,
        public verificatorid: string,
        public completed: "SUCCESS" | "INCOMPLETE",
        public timestamp: Date,
        public _id?: ObjectId,
    ) {}
}