import * as mongoose from "mongoose";
import {Schema, Document} from 'mongoose';
import {UserProps} from "./user.model";

export interface SessionProps {
    _id: string;
    user: UserProps | string;
    platform: string;
    expirationDate: Date;
}

export type SessionDocument = SessionProps & Document;

const sessionSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    platform: {
        type: Schema.Types.String
    },
    expirationDate: {
        type: Schema.Types.Date
    }
}, {
    timestamps: true,
    versionKey: false
});

export const SessionModel = mongoose.models.Session || mongoose.model<SessionDocument>("Session", sessionSchema);

