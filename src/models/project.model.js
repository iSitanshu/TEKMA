import mongoose, {Schema} from "mongoose";

const projectSchema = new Schema(
    {
        name: { 
            type: String, 
            required: true 
        },
        description: { 
            type: String, 
            required: true 
        },
        created_by: {
            type: Schema.Types.ObjectId, 
            ref: 'User', 
            required: true 
        },
    },{timestamps: true})

export const Project = mongoose.model("Project", projectSchema)