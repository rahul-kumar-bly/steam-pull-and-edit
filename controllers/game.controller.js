import Game from '../models/game.model.js'


export async function addGame (req, res) {
    try {
        const {gameDatabase} = req.body;
        const newGame = await Game.create(gameDatabase);
        if (newGame){
            console.log('newGame data entry ', newGame);
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

export async function fetchGame(req, res) {
    const documentId = req.params.id
    try{
        const game = await Game.findById(documentId)
        return res.status(200).send(game)
    } catch(err){
        console.log(err);
        return res.send(err.message)
    }
}

export async function fetchGames (req, res) {
    try {
        const games = await Game.find()
        if (games){
            return res.status(200).send(games)
        } else {
            return res.status(404).send('Games not found')
        }
    } catch(err){
        console.log(err);
        return res.send(err.message)
    }
}

export async function updateGame (req, res) {
    console.log('updating game')
    try {
        const documentId = req.params.id
        const game = await Game.findById(documentId)
        console.log(`game found`)
        if (game){
            const updatedGame = await Game.findByIdAndUpdate(
                documentId,
                req.body,
                {new:true}
            )
            res.status(200).send(updatedGame)
        } else {
            res.status(404).send('Games not found')
        }

    } catch (err){
        console.log(err);
        return res.send(err.message)
    }
}

export async function deleteGame (req, res) {
    try {
        const documentId = req.params.id;
        const game = await Game.findByIdAndDelete(documentId)
        res.status(200).send(game);
    } catch (err){
        res.status(404).send('Games not found');
    }

}

export async function deleteGames(req, res) {
    try{
        const documentIds = req.body;
        console.log(">>> Selected IDs are", documentIds);
        const games = await Game.deleteMany({
            _id: {$in:documentIds.selectedIds}
        })
        res.status(200).json({message:`games deleted successfully ${games.deletedCount}`})
    } catch (err){
        console.log(">>> Error is", err);
        res.status(404).send('Games not found');
    }
}