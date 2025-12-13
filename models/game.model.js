import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
    appId:{
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    shortDescription: {
        type: String,
        required: true
    },
    genres:{
        type: Array,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    devs: {
        type: Array,
        required: true
    },
    pubs: {
        type: Array,
        required: true
    },
    screenshots:{
        type: Array,
        required: true
    },
    steamUrl: {
        type: String,
        required: true,
    },
    headerImage: {
        type: String,
        required: true,
    },
    trailer:{
        type: Array,
    },
    website: {
        type: String,
    },
    capsuleImage: {
        type: String,
    },
    releaseDate:{
        type: Array
    },
}, {timestamps: true});

const Game = mongoose.model('Game', gameSchema);
export default Game;