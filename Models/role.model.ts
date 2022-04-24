import * as mongoose from "mongoose";
import {Schema, Document} from 'mongoose';

export interface RoleProps {
    _id: string;
    name: string;
    accessList: string[];
    parent: string|RoleProps;
}

export type RoleDocument = RoleProps & Document;

const roleSchema = new Schema({
    name: {
        type: Schema.Types.String,
        required: true,
        unique: true
    },
    accessList: [{
        type: Schema.Types.String,
        required: true,
    }],
    parent: {
        type: Schema.Types.ObjectId,
        ref: "Role"
    }
}, {
    versionKey: false
});

export const RoleModel = mongoose.models.Role || mongoose.model<RoleDocument>("Role", roleSchema);
