import mongoose from "mongoose";
const Schema = mongoose.Schema;

const itemSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    stock: {
        type: Number,
        default: 0,
        required: true
    },
    category: {
        type: String,
        required: false
    }
}, { timestamps: true });

const Item = mongoose.model("items", itemSchema);
export default Item;