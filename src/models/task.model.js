import mongoose, {Schema} from "mongoose";

const taskSchema = new Schema(
    {
        project_id: { 
            type: Schema.Types.ObjectId, 
            ref: 'Project', 
            required: true 
        },
        assigned_to: { 
            type: Schema.Types.ObjectId, 
            ref: 'User', 
            required: true 
        },
        description: {
             type: String, 
            required: true 
        },
        deadline: { 
            type: Date, 
            required: true 
        },
        status: { 
            type: String, 
            enum: ['pending', 'completed'], 
            default: 'pending' 
        },
    },{timestamps: true})

export const Task = mongoose.model("Task", taskSchema)  