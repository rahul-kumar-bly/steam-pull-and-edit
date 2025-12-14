import {useState} from "react";
import {Button, ButtonGroup, Divider} from "@mui/material";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import InputAdornment from "@mui/material/InputAdornment";
import { FaSteamSymbol } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import sanitizedData from "../methods/sanitizedData.js";
import UniversalDialog from "./Components/UniversalDialog.jsx";
import { SmallRedButton } from "../Pages/Components/SmallButtons.jsx"

export default function SubmitMultipleGames() {

    const [gameId, setGameId] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [gameDatabase, setGameDatabase] = useState([])
    const [idFailedToFetch, setIdFailedToFetch] = useState([])
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogTitle, setDialogTitle] = useState(null);
    const [dialogContent, setDialogContent] = useState(null);
    const [onAgreeHandler, setOnAgreeHandler] = useState(() => () => {});
    const [dialogWidth, setDialogWidth] = useState("sm");


    const navigate = useNavigate();

    const handleGamePushed = () => {
    setDialogTitle('Game Added');
    setDialogContent('New games have been pushed successfully.');
    setDialogOpen(true);
    setDialogWidth("xs");
    setOnAgreeHandler(() => () => {
        setDialogOpen(false);
        navigate('/');
    });
    }


    const gameApi = axios.create({
        baseURL: `/api/game`,
        // timeout: 2000 
    })

    const steamApi = axios.create({
        baseURL: `/api/steam`,
        // timeout: 2000 
    })

    const handleReset = () => {
        setGameDatabase([]);
        setIdFailedToFetch([]);
        setError("");
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const {data} = await gameApi.post(`/addmany`, {
                gameDatabase
            })
            console.log(">>> INFO: data is", data);
            handleGamePushed();
        } catch (error) {
            console.log('>>> Error: ', error?.response?.status, error?.response?.data || error.message);
            setError(`Error ${error?.response?.status}: ${error?.response?.data || error.message}`);
        } finally {
            setLoading(false);
        }

    };

    // TODO: Input data validation
    const handleIdChange = async (e)   => {
        const ids = e.target.value;
        setGameId(ids);
    }

    const handleClick = async () =>{
        setLoading(true);
        setError(null);
        if (gameId){
            try {
                const {data} = await steamApi.get(`/getbatch/${encodeURIComponent(gameId)}`)
                console.log(">>> INFO: Data fetched", data);                
                data.forEach(d=> {
                    if (d.message === null){
                        console.log(">>> Unable to fetch data for ID:", d.appId);
                        setIdFailedToFetch(prev => [...prev, d.appId]);
                    }
                })
                // in case nothing fetched for 1 entry
                if (data.length === 1 && data[0].message === null){
                    console.log(">>> ERROR: Nothing fetched");
                    return;
                }
                const sanitized = data.filter(d => !d.message).map(data => sanitizedData(data));
                setGameDatabase(sanitized);
                console.log(">>> INFO: Sanitized data is", sanitized);
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

    const handleExclude = (game) => {
        console.log(game.name);
        setGameDatabase(gameDatabase.filter(g => g !== game));
    }

    return (
        <div className="max-w-xl mx-auto my-5">        
        <UniversalDialog 
            title={dialogTitle}
            open={dialogOpen}
            onAgree={onAgreeHandler}
            onClose={() => setDialogOpen(false)}
            content={dialogContent}
            width={dialogWidth}
        />

            {error && (
                <Alert severity="error" className="text-red-700 font-semibold my-2">{error}</Alert>
            )}

            {idFailedToFetch.length > 0 && (
                <Alert severity="error" className="text-red-700 font-semibold my-2">Failed to fetch following IDs:
                <div className="flex flex-row flex-wrap gap-1">
                    {idFailedToFetch.map((game, index) => (
                        <div key={index}>
                        <span><p className="">{game}</p></span>
                        </div>
                    ))}

                </div>
                </Alert>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5 flex-wrap">
                <div  className="flex flex-col gap-4 w-2xl">
                    <TextField
                        required
                        name ="steamId"
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
                        <Button type="reset" variant="contained" color="error" onClick={handleReset}>Reset</Button>
                    </ButtonGroup>
                </div>

        {gameDatabase.length > 0 &&( 
            <>
            <Divider />
                <div className="mx-2 font-semibold text-2xl">
                    Returning {gameDatabase.filter(game => game.appId !== "" ).length} Results:
                </div>
                <div className="flex flex-row flex-wrap gap-4 max-h-[750px] overflow-scroll mx-2 my-2">
                    {gameDatabase.filter(game => game.appId !== "" ).map((game, index) => (
                        <div key={index} className="bg-[#1b5e20] p-2 font-semibold text-white">
                            <p className="text-xs">{game.appId}</p>
                            <img src={game.capsuleImage || ""} className="my-1"/>
                            <SmallRedButton  text={"x"} tooltip={"Exclude this entry"} onClickHandle={()=>handleExclude(game)} classProps={""} />
                            <p>Description Length:{game.description.length}</p>
                            <p>Short Description Length: {game.shortDescription.length}</p>
                            <p>Trailers Count: {game.trailer.length}</p>
                            <p>Screenshots Count: {game.screenshots.length}</p>
                        </div>
                    ))}
                </div>            
            </>
        )}
     </div>
    )
}