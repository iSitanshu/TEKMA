import mongoose, {Schema} from "mongoose";

const userdepartmentSchema = new Schema(
    {
        user_id: { 
            type: Schema.Types.ObjectId, 
            ref: 'User', 
            required: true 
        },
        department_id: { 
            type: Schema.Types.ObjectId, 
            ref: 'Department', 
            required: true 
        },
    },{timestamps: true})

export const Userdepartment = mongoose.model("Userdepartment", userdepartmentSchema)