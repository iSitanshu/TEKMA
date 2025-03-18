import mongoose, {Schema} from "mongoose";

const progressSchema = new Schema(
    {
        project_id: { 
            type: Schema.Types.ObjectId, 
            ref: 'Project', 
            required: true 
        },
        completed_tasks: { 
            type: Number, 
            default: 0 
        },
        total_tasks: { 
            type: Number, 
            default: 0 
        },
        progress_percentage: { 
            type: Number, 
            default: 0 
        },
    },{timestamps: true})

export const Progress = mongoose.model("Progress", progressSchema)