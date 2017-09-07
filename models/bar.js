import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const BarSchema = new Schema(
    {
        placeId: {
            type: String,
            required: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        name: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

//BarSchema.path('createdAt').expires('24h');

export default mongoose.model('Bar', BarSchema);