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

export default function SubmitGame() {

    const [gameId, setGameId] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);


    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogTitle, setDialogTitle] = useState(null);
    const [dialogContent, setDialogContent] = useState(null);
    const [onAgreeHandler, setOnAgreeHandler] = useState(() => () => {});
    const [dialogWidth, setDialogWidth] = useState("sm");


    const [steamData, setSteamData] = useState({
        appId: "",
        name: "",
        description: "",
        shortDescription: "",
        price:0,
        devs:[],
        pubs:[],
        website:[],
        headerImage:"",
        capsuleImage:"",
        screenshots:[],
        genres: [],
        trailer:[],
        releaseDate:[],
        steamUrl: ""
    });

    const navigate = useNavigate();
    const handleChange = useSteamFormInput(steamData, setSteamData);

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
            const res = await fetch(`/api/game/add`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(steamData),
            });
            const data = await res.json();
            if (res.status === 200) {
                console.log(data);
                handleGamePushed();
            } else {
                handleGamePushedError(data.message + ". Click Agree to go back to Homepage.");
                console.log('Error in fetching data', data.message);
                setError(`Error in fetching data: ${data.message}`);
            }
        } catch (error) {
            console.log('Error encountered while creating game', error);
            setError(`Error encountered while creating game: ${error}`);
        } finally {
            setLoading(false);
        }

    };

    const handleIdChange = async (e)   => {
        const id = e.target.value;
        console.log(id);
        setGameId(id);
    }

    const handleClick = async () =>{
        setLoading(true);
        setError(null);
        if (gameId){
            try {
                const res = await fetch(`/api/steam/get/${gameId}`)
                if (!res.ok){
                    setError(`Error in getting response: ${res.statusText}`);
                    return;
                }
                const gameData = await res.json();
                if(!gameData){
                    setError(`Error in fetching data`);
                    return;
                }
                const fetchData = gameData[gameId].data
                setSteamData({
                    appId: gameId || "",
                    name: fetchData.name || "",
                    description: fetchData.detailed_description || "",
                    shortDescription: fetchData.short_description || "",
                    price: parseInt(fetchData.price_overview?.final_formatted?.replace("₹", "").replace(",", "")) || 0,
                    devs: fetchData.developers || [],
                    pubs: fetchData.publishers || [],
                    website: fetchData.website || "",
                    headerImage: fetchData.header_image || "",
                    capsuleImage: fetchData.capsule_image || "",
                    screenshots: fetchData.screenshots?.map(s => s.path_thumbnail) || [],
                    genres: fetchData.genres?.map(g => g.description) || [],
                    trailer: fetchData.movies?.map(m => ({ thumbnail: m.thumbnail, trailer: m.dash_h264, name: m.name })) || [],
                    releaseDate: fetchData.release_date || [],
                    steamUrl: `https://store.steampowered.com/app/${gameId}`
                });
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
            console.log(steamData)
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
                {loading ? <img src="https://www.wpfaster.org/wp-content/uploads/2013/06/loading-gif.gif" className="w-[40px] h-auto" alt=""/> : null}
                    </div>
                    </form>

                {loading ? "Loading...." : ""}


                { steamData.name !== "" && (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5 flex-wrap my-3">
                        <div  className="flex flex-col gap-4 w-2xl">
                        <NameInfo gameDb={steamData} handleChange={handleChange} />

                                <Accordion>
                                    <AccordionSummary expandIcon={<FaCaretDown />}>
                                    Game Descriptions
                                    </AccordionSummary>
                                    <AccordionDetails className="flex flex-col gap-5">
                                        <GameDesc gameDb={steamData} handleChange={handleChange} />
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
                                        // defaultValue="https://store.steam.com"
                                        variant="standard"
                                        value={steamData.website}
                                        onChange={handleChange}
                                        fullWidth
                                        type="text"
                                    />
                                    <div className="flex flex-col gap-1 flex-wrap">
                                        <InputLabel htmlFor="genres">Genres</InputLabel>
                                        <div className="p-2 bg-slate-200 flex flex-col gap-2">
                                            {steamData.genres && steamData.genres.map((item, index) => (
                                                <TextField
                                                    required
                                                    key={index}
                                                    id={`genre-${index}`}
                                                    // defaultValue="genre"
                                                    variant="standard"
                                                    value={item}
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
                                            value={steamData.price}
                                            onChange={handleChange}
                                            startAdornment={<InputAdornment position="start">₹</InputAdornment>}/>
                                    </div>

                                    <div className="flex flex-col gap-1 flex-wrap">
                                        <InputLabel htmlFor="Release Date">Release Date</InputLabel>

                                        {steamData.releaseDate?.date && (
                                        <>
                                        {
                                            steamData.releaseDate.coming_soon ? <p> Coming Soon </p> :
                                            <Input
                                                id="date"
                                                type="date"
                                                label="date"
                                                value={dayjs(steamData.releaseDate?.date).format("YYYY-MM-DD")}
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
                                            {steamData.devs && steamData.devs.map((item, index) => (
                                                <TextField
                                                    required
                                                    key={index}
                                                    id={`dev-${index}`}
                                                    // defaultValue="dev"
                                                    variant="standard"
                                                    value={item}
                                                    onChange={(e)=> handleChange(e,index)}

                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <div  className="flex flex-col gap-1 flex-wrap">
                                        <InputLabel htmlFor="publishers">Publishers</InputLabel>
                                        <div className="p-2 flex flex-col bg-slate-200 gap-2">
                                            {steamData.pubs && steamData.pubs.map((item, index) => (
                                                <TextField
                                                    required
                                                    fullWidth
                                                    key={index}
                                                    id={`pub-${index}`}
                                                    // defaultValue="dev"
                                                    variant="standard"
                                                    value={item}
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
                                        {steamData.screenshots && steamData.screenshots.map((screenshot, index) => (
                                            <div key={index} className="w-1/4 h-auto cursor-pointer transition-transform hover:scale-105">
                                                <img src={screenshot} alt="" />
                                            </div>

                                        ))}
                                    </div>

                                    <InputLabel htmlFor="trailers">Trailers</InputLabel>
                                    <div className="flex flex-row flex-wrap gap-2">
                                        {steamData.trailer && steamData.trailer.map((item, index) => (
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
                                <AdditionalMedia gameDb={steamData} handleChange={handleChange} />
                                </AccordionDetails>
                            </Accordion>
                            <Button variant="contained" color="success" type="submit" className="w-1/2 ">Add game to the database</Button>
                        </div>
                    </form>
                )}
            </div>
    )
}