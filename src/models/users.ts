import { ObjectId } from "mongodb";

export default class Users {
    constructor(
        public userid: string,
        public apikeys: string[],
        public token: string,
        public account_type: "standard" | "premium",
        public _id?: ObjectId,
    ) {}
}