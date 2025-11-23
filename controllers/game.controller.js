import Game from '../models/game.model.js'

export async function addGame (req, res) {
    console.log('ehhdskjhdkjshfdjkshdkjh')
    try {
        const {
            appId, name, description, shortDescription,
            genres, price, devs,
            pubs, screenshots, trailer, website, headerImage,
            capsuleImage, steamUrl
        } = req.body;

    const newGame = await Game.create({
        appId:appId,
        name:name,
        description:description,
        shortDescription:shortDescription,
        genres:genres,
        price:price,
        devs:devs,
        pubs:pubs,
        screenshots:screenshots,
        trailer:trailer,
        website:website,
        headerImage:headerImage,
        capsuleImage:capsuleImage,
        steamUrl:steamUrl
    })
    res.status(200).send(newGame)
    } catch (err){
        console.log(err);
        res.send(err.message)
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