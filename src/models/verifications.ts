import { ObjectId } from "mongodb";

export default class Verification {
    constructor(
        public userid: string,
        public verificatorid: string,
        public completed: number,
        public timestamp: Date,
        public _id?: ObjectId,
    ) {}
}