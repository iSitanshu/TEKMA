import mongoose, {Schema} from "mongoose";

const projectSchema = new Schema(
    {
        name: { 
            type: String, 
            required: true 
        },
        host: {
            type: String
        },
        members: 
        [{
            type: String
        }],
        description: {
            type: String
        },
        department: { 
            type: String, 
            required: true 
        }
    },{timestamps: true})

export const Project = mongoose.model("Project", projectSchema)