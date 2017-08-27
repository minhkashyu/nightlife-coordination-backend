import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        github: {
            id           : String,
            username     : String,
            displayName  : String,
            email        : String
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model('User', UserSchema);