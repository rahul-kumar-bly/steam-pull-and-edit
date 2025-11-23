export default async function getSteamJsonData(req, res){
    try {
        const appId = req.params.id;
        const steamRes = await fetch(`https://store.steampowered.com/api/appdetails?appids=${appId}`)
        const data = await steamRes.json();
        if(data[appId]['success']){
            res.status(200).send(data)
        } else {
            res.status(404).send(`Unable to fetch data for this game ${appId}`);
        }
    }
    catch (err) {
        console.log(err);
        res.send(err.message)
    }
}


// https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=413150