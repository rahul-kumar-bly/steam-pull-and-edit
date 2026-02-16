import Game from '../models/game.model.js';
import redisClient from '../utils/cache.js';
import {errorHandler} from '../utils/error.js';

export async function addGame (req, res) {
    try {
        const {gameDatabase} = req.body;
        const newGame = await Game.create(gameDatabase);
        if (newGame){
            await redisClient.del('games');
            console.log('newGame data entry ', newGame);
            await redisClient.set(`game:${newGame._id}`, JSON.stringify(newGame), {EX: 60});
            return res.status(201).send(newGame);
        }
    } catch (err){
        if (err.code === 11000){
            console.log('>>> ERROR: Duplicate key error, appId already exist');
            return res.status(409).send(`Game already exist!`);
        }
        console.log(">>> ERROR: ", err);
        return res.status(500).send(err.message);
    }
}

export async function addMany (req, res) {
    const dups = [];
    try {
        const {gameDatabase} = req.body;
        await gameDatabase.map((d)=>{
            const game = Game.findOne({"appId": d.appId})
            if (game){
                dups.push(d.appId);
            }
        });
        const filteredGames = gameDatabase.filter(data => data.appId);
        const newGames = await Game.insertMany(filteredGames);
        if (newGames){
            return res.status(200).send(newGames)
        }
    } catch (err){
        if (err.code === 11000){
            const appIds = err.message;
            console.log('>>> ERROR: Duplicate key error, appId already exist', dups);
            return res.status(409).send(`Games already exist!: ${dups.filter(d=> d!=="")}`);
        }
        console.log(err);
        return res.status(500).send(err.message);
    }
}

// https://mongoosejs.com/docs/queries.html

export async function fetchGame(req, res, next) {
    const documentId = req.params.id
    try{
        const cachedKey = await redisClient.get(`game:${documentId}`);
        if (cachedKey){
            console.log(">>> INFO: using cached data for", documentId);
            return res.status(200).json(JSON.parse(cachedKey)); 
        }
        const game = await Game.findById(documentId)
        if (!game) return res.status(404).send('Game not found');
        await redisClient.set(`game:${documentId}`, JSON.stringify(game), {EX:60});
        return res.status(200).json(game)
    } catch(err){
        console.log(err);
        return next(err);
    }
}

export async function fetchGames (req, res, next) {
    try {
        const cachedGames = await redisClient.get('games');
        if (cachedGames){
            console.log(cachedGames);
            return res.status(200).send(JSON.parse(cachedGames));
        }
        const games = await Game.find();
            await redisClient.set('games', JSON.stringify(games), {EX: 60});
            return res.status(200).json(games)
    } catch(err){
        console.log(err);
        return next(errorHandler(500, err));
    }
}

export async function updateGame (req, res) {
    console.log('updating game')
    try {
        const documentId = req.params.id
        const game = await Game.findById(documentId);
        console.log(`game found`)
        if (game){
            const updatedGame = await Game.findByIdAndUpdate(
                documentId,
                req.body,
                {new:true}
            )
            res.status(200).send(updatedGame)
            redisClient.del(`games`);
            redisClient.del(`game:${documentId}`);
        } else {
            res.status(404).send('Games not found')
        }

    } catch (err){
        console.log(err);
        return res.send(err.message)
    }
}

export async function deleteGame (req, res, next) {
    try {
        const documentId = req.params.id;
        const game = await Game.findByIdAndDelete(documentId);
        redisClient.del(`games`);
        redisClient.del(`game:${documentId}`);
        res.status(200).send(game);
    } catch (err){
        next(errorHandler(404, err));
    }

}

export async function deleteGames(req, res) {
    try{
        const documentIds = req.body;
        console.log(">>> Selected IDs are", documentIds);
        const result = await Game.deleteMany({
            _id: {$in:documentIds.selectedIds}
        })    
        const gameKeys = documentIds.selectedIds.map(id=> `game:${id}`);
        await redisClient.del('games', ...gameKeys);
        console.log(">>> DELETE: deleted count", result.deletedCount);        
        res.status(200).json({message:`games deleted successfully ${result.deletedCount}`})
    } catch (err){
        console.log(">>> Error is", err);
        res.status(404).send('Games not found');
    }
}



