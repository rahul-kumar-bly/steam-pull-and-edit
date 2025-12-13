import {useState} from "react";
import {Button, ButtonGroup} from "@mui/material";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import InputAdornment from "@mui/material/InputAdornment";
import { FaSteamSymbol } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function SubmitMultipleGames() {

    const [gameId, setGameId] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [gameDatabase, setGameDatabase] = useState([])
    const [idFailedToFetch, setIdFailedToFetch] = useState([])

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            for (const gData of gameDatabase){
            const res = await fetch(`/api/game/add`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(gData),
            });            
        }
        const data = await res.json();
            if (data) {
                console.log(data);
                alert('Game Added Successfully!');
            } else {
                console.log('Error in fetching data', data.message);
                setError(`Error in fetching data: ${data.message}`);
            }

        } catch (error) {
            console.log('Error encountered while creating game', error);
            setError(`Error encountered while creating game: ${error}`);
        } finally {
            setLoading(false);
            navigate('/');
        }

    };

    const handleIdChange = async (e)   => {
        const ids = e.target.value;
        console.log(">>> Entered Ids are", ids);
        setGameId(ids);
    }

    const handleClick = async () =>{
        setLoading(true);
        setError(null);
        if (gameId){
            try {
                const res = await axios.get(`/api/steam/getbatch/${encodeURIComponent(gameId)}`, {
                    timeout: 60000
                })
                for (const d of res.data){
                    console.log(">> Data fetched", d)
                }
                res.data.forEach(d=> {
                    if (d.message === null){
                        console.log(">>> Unable to fetch data for ID:", d.appId);
                        setIdFailedToFetch(prev => [...prev, d.appId]);
                    }
                })
                console.log(">>> Res.Data is",res.data);
                const fetchedData = await res.data;
                console.log(">>> FetchedData is", fetchedData);
                if(!fetchedData){
                    setError(`>>> Error in fetching data`);
                    return;
                }
                const sanitized = fetchedData.filter(data => !data.message).map(data => sanitizeData(data));
                setGameDatabase(sanitized);

            } catch (error) {
                console.log('error is', error);
                setError(error);
            } finally {
                setLoading(false);
            }
        } else {
            setError(`Enter an ID to begin fetching data`);
            setLoading(false);
        }

    }
    const sanitizeData = (gData) => ({
        appId: gData.steam_appid || "",
        name: gData.name || "",
        description: gData.detailed_description || "",
        shortDescription: gData.short_description || "",
        price: parseInt(
            gData.price_overview?.final_formatted?.replace("₹", "").replace(",", "")
        ) || 0,
        devs: gData.developers || [],
        pubs: gData.publishers || [],
        website: gData.website || "",
        headerImage: gData.header_image || "",
        capsuleImage: gData.capsule_image || "",
        screenshots: gData.screenshots?.map(s => s.path_thumbnail) || [],
        genres: gData.genres?.map(g => g.description) || [],
        trailer: gData.movies?.map(m => ({
            thumbnail: m.thumbnail,
            trailer: m.dash_h264,
            name: m.name
        })) || [],
        releaseDate: gData.release_date || [],
        steamUrl: `https://store.steampowered.com/app/${gData.steam_appid}`
    });

    return (
        <div className="max-w-lg mx-auto my-5">
            {error && (
                <Alert severity="error" className="text-red-700 font-semibold my-2">{error}</Alert>
            )}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 flex-wrap">
                <div  className="flex flex-col gap-4 w-2xl">
                    <TextField
                        required
                        label="Enter Multiple Steam ID seperated by commas."
                        id="steamId"
                        variant="standard"
                        onChange={handleIdChange}
                        fullWidth
                        type="text"
                        slotProps={{
                            input: {
                                startAdornment: <InputAdornment position="start"><FaSteamSymbol /></InputAdornment>,
                            },
                        }}
                    />
                    <Button variant="contained" onClick={handleClick} color="success" className="w-1/2">Fetch Data</Button>
                    {loading ? <img src="https://gifdb.com/images/high/classic-pacman-game-white-dots-beit7v8icaisz3d4.gif" className="w-[40px] h-auto" alt=""/> : null}

                </div>
            </form>

                <div className="my-4">
                    <ButtonGroup className="gap-1">
                        <Button type="submit" variant="contained" color="success" onClick={handleSubmit}>Add All</Button>
                        <Button type="reset" variant="contained" color="error" onClick={()=> setGameDatabase([])}>Reset</Button>
                    </ButtonGroup>
                </div>
            
        {gameDatabase.map((game, index) => (
            <>
            <div key={index}>
            <h2 key={index}>{game.name}</h2>
            <img src={game.capsuleImage} />
            </div>
            </>
    ))}

        {idFailedToFetch.map((game, index) => (
            <>
            <span key={index}>Failed to Fetch: <p>{game}</p></span>
            </>
        ))}

     </div>
    )
}