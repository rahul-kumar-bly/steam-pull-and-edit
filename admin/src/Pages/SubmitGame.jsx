import {useState} from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import InputLabel from "@mui/material/InputLabel";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import {FaCaretDown} from "react-icons/fa";
import { FaSteamSymbol } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {useSteamFormInput} from "../hooks/useSteamFormInput.js";
import dayjs from "dayjs";
import NameInfo from "./Components/Editor UI/NameInfo.jsx";
import GameDesc from "./Components/Editor UI/GameDesc.jsx";
import AdditionalMedia from "./Components/Editor UI/AdditionalMedia.jsx";
import UniversalDialog from "./Components/UniversalDialog.jsx";
import sanitizedData from "../methods/sanitizedData.js";
import axios from "axios";

export default function SubmitGame() {

    const [gameId, setGameId] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);


    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogTitle, setDialogTitle] = useState(null);
    const [dialogContent, setDialogContent] = useState(null);
    const [onAgreeHandler, setOnAgreeHandler] = useState(() => () => {});
    const [dialogWidth, setDialogWidth] = useState("sm");
    const [gameDatabase, setGameDatabase] = useState([])

    const gameApi = axios.create({
        baseURL: `/api/game`,
        timeout: 3000
    })

    const steamApi = axios.create({
        baseURL: `/api/steam`,
        timeout: 3000
    })


    const navigate = useNavigate();
    const handleChange = useSteamFormInput(gameDatabase, setGameDatabase);

    const handleGamePushed = () => {
        setDialogTitle('Game Added');
        setDialogContent('New game has been pushed successfully.');
        setDialogOpen(true);
        setDialogWidth("xs");
        setOnAgreeHandler(() => () => {
            setDialogOpen(false);
            navigate('/');
        });
    }

    const handleGamePushedError = (message) =>{
        setDialogTitle('Error'); 
        setDialogContent(message);
        setDialogOpen(true);
        setDialogWidth("xs");
        setOnAgreeHandler(() => () => {
            setDialogOpen(false);
            navigate('/');
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const {data} = await gameApi.post(`/add`, {
                gameDatabase
            })
            console.log(">>> INFO: data is", data);
            handleGamePushed();
        } catch (error) {
            handleGamePushedError(
                <>
                Error: {error?.response?.status} {error?.response?.data || error.message} <br />
                Click Agree to go back to Homepage.
                </>
            );
            console.log('Error encountered while creating game', error);
            setError(`Error encountered while creating game: ${error}`);
        } finally {
            setLoading(false);
        }

    };

    const handleIdChange = async (e)   => {
        const id = e.target.value;
        setGameId(id);
    }

    const handleClick = async () =>{
        setLoading(true);
        setError(null);
        if (gameId){
            try {
                const {data} = await steamApi.get(`/get/${gameId}`);
                const fetchedData = data[gameId].data
                console.log(">>> INFO: fetchedData is", fetchedData);
                const sanitized = sanitizedData(fetchedData);
                console.log(">>> INFO: sanitizedData is", sanitized);
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
            console.log(gameDatabase)
    }

    return (
            <div className="max-w-lg mx-auto my-5">
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
                <form onSubmit={handleSubmit} className="flex flex-col gap-5 flex-wrap">
                    <div  className="flex flex-col gap-4 w-2xl">
                    <TextField
                    required
                    label="Enter Steam ID"
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

                {gameDatabase.appId && (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5 flex-wrap my-3">
                        <div  className="flex flex-col gap-4 w-2xl">
                        <NameInfo gameDb={gameDatabase} handleChange={handleChange} />
                                <Accordion>
                                    <AccordionSummary expandIcon={<FaCaretDown />}>
                                    Game Descriptions
                                    </AccordionSummary>
                                    <AccordionDetails className="flex flex-col gap-5">
                                        <GameDesc gameDb={gameDatabase} handleChange={handleChange} />
                                    </AccordionDetails>
                                </Accordion>
                                <Accordion>
                                <AccordionSummary
                                    expandIcon={<FaCaretDown />}
                                >
                                    Meta Information
                                </AccordionSummary>
                                <AccordionDetails className="flex flex-col gap-5">
                                    <TextField
                                        id="website"
                                        label="Website"
                                        variant="standard"
                                        value={gameDatabase.website || ""}
                                        onChange={handleChange}
                                        fullWidth
                                        type="text"
                                    />
                                    <div className="flex flex-col gap-1 flex-wrap">
                                        <InputLabel htmlFor="genres">Genres</InputLabel>
                                        <div className="p-2 bg-slate-200 flex flex-col gap-2">
                                            {gameDatabase.genres && gameDatabase.genres.map((item, index) => (
                                                <TextField
                                                    required
                                                    key={index}
                                                    id={`genre-${index}`}
                                                    variant="standard"
                                                    value={item || ""}
                                                    onChange={(e)=> handleChange(e,index)}

                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1 flex-wrap">
                                        <InputLabel htmlFor="price">Price</InputLabel>
                                        <Input
                                            id="price"
                                            type="number"
                                            label="Price"
                                            value={gameDatabase.price || ""}
                                            onChange={handleChange}
                                            startAdornment={<InputAdornment position="start">₹</InputAdornment>}/>
                                    </div>

                                    <div className="flex flex-col gap-1 flex-wrap">
                                        <InputLabel htmlFor="Release Date">Release Date</InputLabel>

                                        {gameDatabase.releaseDate?.date && (
                                        <>
                                        {
                                            gameDatabase.releaseDate.coming_soon ? <p> Coming Soon </p> :
                                            <Input
                                                id="date"
                                                type="date"
                                                label="date"
                                                value={dayjs(gameDatabase.releaseDate?.date).format("YYYY-MM-DD") || []}
                                                onChange={handleChange}
                                                />

                                        }
                                        </>
                                        )}
                                        {/* 1920290 - barkour not released yet */}
                                    </div> 

                                    <div  className="flex flex-col gap-1 flex-wrap">
                                        <InputLabel htmlFor="developers">Developers</InputLabel>

                                        <div className="p-2 bg-slate-200 flex flex-col gap-2">
                                            {gameDatabase.devs && gameDatabase.devs.map((item, index) => (
                                                <TextField
                                                    required
                                                    key={index}
                                                    id={`dev-${index}`}
                                                    variant="standard"
                                                    value={item || ""}
                                                    onChange={(e)=> handleChange(e,index)}

                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <div  className="flex flex-col gap-1 flex-wrap">
                                        <InputLabel htmlFor="publishers">Publishers</InputLabel>
                                        <div className="p-2 flex flex-col bg-slate-200 gap-2">
                                            {gameDatabase.pubs && gameDatabase.pubs.map((item, index) => (
                                                <TextField
                                                    required
                                                    fullWidth
                                                    key={index}
                                                    id={`pub-${index}`}
                                                    variant="standard"
                                                    value={item || ""}
                                                    onChange={(e)=> handleChange(e,index)}

                                                />
                                            ))}
                                        </div>
                                    </div>

                                </AccordionDetails>
                            </Accordion>
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<FaCaretDown />}
                                >
                                    Media (Screenshots & Trailers)
                                </AccordionSummary>
                                <AccordionDetails className="flex flex-col gap-5">
                                    <InputLabel htmlFor="screenshots">Screenshots</InputLabel>
                                    <div className="flex flex-row gap-3 flex-wrap">
                                        {gameDatabase.screenshots && gameDatabase.screenshots.map((screenshot, index) => (
                                            <div key={index} className="w-1/4 h-auto cursor-pointer transition-transform hover:scale-105">
                                                <img src={screenshot} alt="" />
                                            </div>

                                        ))}
                                    </div>

                                    <InputLabel htmlFor="trailers">Trailers</InputLabel>
                                    <div className="flex flex-row flex-wrap gap-2">
                                        {gameDatabase.trailer && gameDatabase.trailer.map((item, index) => (
                                            <div key={index} className="w-1/3 h-auto">
                                                <video poster={item.thumbnail}  src={item.trailer} controls title={item.name}/>
                                            </div>

                                        ))}
                                    </div>
                                </AccordionDetails>
                            </Accordion>

                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<FaCaretDown />}
                                >
                                    Additional Media
                                </AccordionSummary>
                                <AccordionDetails className="flex flex-col gap-5">
                                <AdditionalMedia gameDb={gameDatabase} handleChange={handleChange} />
                                </AccordionDetails>
                            </Accordion>
                            <Button variant="contained" color="success" type="submit" className="w-1/2 ">Add game to the database</Button>
                        </div>
                    </form>
                )}
            </div>
    )
}