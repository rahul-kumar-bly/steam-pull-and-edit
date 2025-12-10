import {useState, useEffect, use} from "react";
import {useParams} from "react-router-dom";
import {Button, TextField, ButtonGroup, IconButton} from "@mui/material";
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Alert from '@mui/material/Alert'
import Divider from '@mui/material/Divider';
import { FaCaretDown } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import UniversalDialog from './Components/UniversalDialog.jsx';
import UniversalDialogForm from './Components/UniversalDialogForm.jsx';
import {useSteamFormInput} from "../hooks/useSteamFormInput.js";
import {useDeleteMedia} from "../hooks/useDeleteMedia.js";
import { usePushMedia } from "../hooks/usePushMedia.js";
import { SmallBlueButton, SmallRedButton } from "./Components/SmallButtons.jsx";



export default function Editor() {
    const [gameId, setGameId] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [steamData, setSteamData] = useState({
        appId: "",
        name: "",
        description: "",
        shortDescription: "",
        price:0,
        devs:[],
        pubs:[],
        website:"",
        headerImage:"",
        capsuleImage:"",
        screenshots:[],
        genres: [],
        trailer:[],
        steamUrl: ""
    });


    const params = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        console.log(params.id);
        async function fetchGame() {
            if (params.id) {
                try {
                    console.log('gameid is', gameId);
                    const res = await fetch(`/api/game/fetch/${params.id}`);
                    if (res.ok){
                        const data = await res.json();
                        console.log(data);
                        setSteamData(data);
                    } else {
                        console.log('error fetching response');
                        setError(`error fetching response from ${res.statusText}`);
                    }
                } catch (error) {
                    console.log('error is', error);
                    setError(error);
                } finally {
                    setLoading(false);
                }
            }
        }
        fetchGame();
    }, [params.id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`/api/game/update/${params.id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(steamData),
            });
            const data = await res.json();
            if (data) {
                console.log(steamData);
                handleGameUpdated();
                // alert('Game Updated Successfully!');
            } else {
                console.log('Error in updating data', data.message);
                setError(`Error in updating data: ${data.message}`);
            }

        } catch (error) {
            console.log('Error encountered while updating game', error);
            setError(`Error encountered while updating game: ${error}`);
        } finally {
            setLoading(false);
        }
    };


    const handleChange = useSteamFormInput(steamData, setSteamData);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogFormOpen, setDialogFormOpen] = useState(false);
    const [dialogTitle, setDialogTitle] = useState(null);
    const [dialogContent, setDialogContent] = useState(null);
    const [dialogFormTitle, setDialogFormTitle] = useState(null);
    const [dialogFormContent, setDialogFormContent] = useState(null);
    const [onAgreeHandler, setOnAgreeHandler] = useState(() => () => {});
    const [mxWidth, setMxWidth] = useState("sm");
    const [dataLabel, setDataLabel] = useState('Value....');


    function handlePreview(){
        navigate(`/preview/${params.id}`);
    }
    
    // Delete Entry
    const handleDeleteEntry = async (e) => {
        e.preventDefault();
        console.log('open the dialog for confirm delete the entry')
        setDialogTitle('Confirm Delete?');
        setDialogContent("Are you sure you want to delete this entry? This can't be undo, but you can re-enter the entry using its steam ID.");
        setDialogOpen(true);
        setLoading(true);

        setOnAgreeHandler(() => async ()  => {
            try {
                const res = await fetch(`/api/game/delete/${params.id}`, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(steamData),
                });
                const data = await res.json();
                if (data) {
                    console.log(steamData);
                    setDialogOpen(false);
                } else {
                    console.log('Error in deleting entry', data.message);
                    setError(`Error in deleting entry: ${data.message}`);
                }

            } catch (error) {
                console.log('Error encountered while deleting game', error);
                setError(`Error encountered while deleting game: ${error}`);
            }
        finally {
            setLoading(false);
            navigate('/');
        }
        })

    };

    // Game updated dialog
    const handleGameUpdated = () => {
        setDialogTitle('Game Updated');
        setDialogContent('Game details have been updated successfully.');
        setDialogOpen(true);
        setMxWidth("xs");
        setOnAgreeHandler(() => () => {
            setDialogOpen(false);
        });
    }

    // Produce dialog to confirm deletion of individual screenshot or trailer
    const handleDeleteHook = useDeleteMedia(steamData, setError, setSteamData)
    const handleDeleteMedia = (index, mediaType) => {
            setDialogTitle('Confirm Delete?');
            setDialogContent(`Are you sure you want to delete ${steamData[mediaType][index]}? This can't be undo.`);
            setDialogOpen(true);
            setMxWidth("xs")
            if (steamData[mediaType].length === 1) {
                setError(`Can not proceed with removing ${steamData[mediaType][index]}, this is the last one!`);
                setDialogTitle('Caution!');
                setDialogContent(`Can not proceed with removing ${steamData[mediaType][index]}, this is the last one!`)
                return 0
            }
            setOnAgreeHandler(() => ()  => {
                handleDeleteHook(mediaType, index);
                setDialogOpen(false);
            })
        }

    // Produce dialog to add new genre or screenshot
    const handlePushHook = usePushMedia(steamData, setError, setSteamData);
    const handlePushMedia = (mediaType) => {
        setDialogFormOpen(true);
        setOnAgreeHandler(()=>(e)=>{
            handlePushHook(e, mediaType);
            setDialogFormOpen(false);
        })
    }     
        
    const handleAddGenre = () => {
        setDialogFormTitle(`Add New Genre`);
        setDialogFormContent(`Please provide the new genre:`);
        handlePushMedia("genres");
    }

    const handleAddDevs = () => {
        setDialogFormTitle(`Add New Developers`);
        setDialogFormContent(`Please provide the new developer name:`);
        handlePushMedia("devs");
    }

        const handleAddPubs = () => {
        setDialogFormTitle(`Add New Genre`);
        setDialogFormContent(`Please provide the new publisher name:`);
        handlePushMedia("pubs");
    }

    const handleAddScreenshot = () => {
        setDialogFormTitle(`Add New Screenshot`);
        setDialogFormContent(`Please provide the image url to be added:`);
        setDataLabel('URL....');
        handlePushMedia("screenshots");
    }

    // TODO: Implement Universal Dialog Form for adding new trailer
    const handleAddTrailer = (e) => {
        e.preventDefault();
        const trailerVidId = prompt('Please provide youtube video ID');
        if (!trailerVidId){
            return 0;
        }
        console.log('thank you for providing the url', trailerVidId);
        const newTrailer = {
            name: 'new trailer',
            thumbnail:`https://img.youtube.com/vi/${trailerVidId}/hqdefault.jpg`,
            trailer: `https://www.youtube.com/watch?v=${trailerVidId}`
        }
        try {
            setSteamData(prev=> ({
                ...prev,
                trailer:[...(prev.trailer || []), newTrailer]
            }))
        } catch (e){
            console.log('error is', e)
        }
    }

    return (
        <div className="max-w-lg mx-auto my-5">

            <UniversalDialog
                open={dialogOpen}
                title={dialogTitle}
                content={dialogContent}
                onClose={() => setDialogOpen(false)}
                onAgree={onAgreeHandler}
                width = {mxWidth}
            />

            <UniversalDialogForm
                open={dialogFormOpen}
                title={dialogFormTitle}
                content={dialogFormContent}
                onClose={() => setDialogFormOpen(false)}
                onAgree={(e)=>onAgreeHandler(e)}
                sentDataLabel={dataLabel}
            />

            {loading ? "Loading...." : ""}
            <div className="my-4">
                {error && (
                    <Alert severity="error">{error}</Alert>
                )}
            </div>
                { steamData && (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5 flex-wrap">
                        <div  className="flex flex-col gap-4 w-2xl">
                            <div className="flex flex-col gap-4 w-2xl p-2" style={{backgroundImage: `linear-gradient(rgba(245, 245, 250, 0.85), rgba(235, 235, 240, 0.85))
                                    , url(${steamData.headerImage})`, backgroundSize: "cover", backgroundPosition: "center"}}>
                                <TextField
                                    required
                                    id="name"
                                    label="Name"
                                    // defaultValue="name"
                                    variant="standard"
                                    value={steamData.name}
                                    onChange={handleChange}
                                    fullWidth
                                    type="text"
                                />
                                <TextField
                                    required
                                    id="steamUrl"
                                    label="Steam Url"
                                    // defaultValue="https://store.steam.com"
                                    variant="standard"
                                    value={steamData.steamUrl}
                                    onChange={handleChange}
                                    fullWidth
                                    type="text"
                                />

                            </div>

                            <Accordion>
                                <AccordionSummary
                                expandIcon={<FaCaretDown />}
                                >
                                    Game Descriptions
                                </AccordionSummary>
                                <AccordionDetails className="flex flex-col gap-5">
                                    <TextField
                                        required
                                        id="description"
                                        label="Description"
                                        // defaultValue="description...."
                                        variant="standard"
                                        value={steamData.description}
                                        onChange={handleChange}
                                        multiline
                                        rows={10}
                                        fullWidth
                                        type="text"
                                    />
                                    <TextField
                                        required
                                        id="shortDescription"
                                        label="Short Description"
                                        // defaultValue="short description...."
                                        variant="standard"
                                        value={steamData.shortDescription}
                                        onChange={handleChange}
                                        multiline
                                        rows={4}
                                        fullWidth
                                        type="text"
                                    />

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
                                        <div className="flex flex-row gap-2 items-center">
                                        <InputLabel htmlFor="genres">Genres</InputLabel>
                                                <SmallBlueButton text="+" tooltip="Add new genre" onClickHandle={handleAddGenre} />
                                        </div>
                                        <div className="p-2 bg-slate-200 flex flex-col gap-2">
                                            {steamData.genres && steamData.genres.map((item, index) => (
                                                <span key={index} className="flex flex-row items-center gap-10 justify-between">
                                                <TextField
                                                    required
                                                    key={index}
                                                    id={`genre-${index}`}
                                                    // defaultValue="genre"
                                                    variant="standard"
                                                    value={item}
                                                    onChange={(e)=> handleChange(e,index)}
                                                />
                                                <SmallRedButton text="&times;" tooltip="Delete this genre" onClickHandle={() => handleDeleteMedia(index, "genres")} />
                                                </span>
                                            ))}
                                        </div>
                                        <div>Reload Genres</div>
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

                                    <div  className="flex flex-col gap-1 flex-wrap">
                                        <div className="flex flex-row gap-2 items-center">
                                        <InputLabel htmlFor="developers">Developers</InputLabel>
                                                <SmallBlueButton text="+" tooltip="Add new developer" onClickHandle={handleAddDevs} />
                                        </div>


                                        <div className="p-2 bg-slate-200 flex flex-col gap-2">
                                            {steamData.devs && steamData.devs.map((item, index) => (
                                            <span key={index} className="flex flex-row items-center gap-10 justify-between">
                                                <TextField
                                                    required
                                                    key={index}
                                                    id={`dev-${index}`}
                                                    // defaultValue="dev"
                                                    variant="standard"
                                                    value={item}
                                                    onChange={(e)=> handleChange(e,index)}
                                                />
                                                <SmallRedButton text="&times;" tooltip="Delete this developer entry" onClickHandle={() => handleDeleteMedia(index, "devs")} />
                                            </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div  className="flex flex-col gap-1 flex-wrap">


                                        <div className="flex flex-row gap-2 items-center">
                                                <InputLabel htmlFor="publishers">Publishers</InputLabel>
                                                <SmallBlueButton text="+" tooltip="Add new publisher" onClickHandle={handleAddPubs} />
                                        </div>


                                        <div className="p-2 flex flex-col bg-slate-200 gap-2">
                                            {steamData.pubs && steamData.pubs.map((item, index) => (
                                                <span key={index} className="flex flex-row items-center gap-10 justify-between">
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
                                                    <SmallRedButton text="&times;" tooltip="Delete this publisher entry" onClickHandle={() => handleDeleteMedia(index, "pubs")} />
                                                </span>
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
                                    <div className="flex flex-row gap-2 items-center">
                                        <InputLabel htmlFor="screenshots">Screenshots</InputLabel>
                                        <SmallBlueButton text="+" tooltip="Add new screenshot" onClickHandle={handleAddScreenshot} />
                                    </div>

                                    <div className="flex flex-row gap-3 flex-wrap">
                                        {steamData.screenshots.length === 0 &&(
                                            <p>No screenshots are available.</p>
                                        )}
                                        {steamData.screenshots && steamData.screenshots.map((screenshot, index) => (
                                            <div key={index}  className="w-1/4 h-auto cursor-pointer transition-transform hover:scale-105 relative">
                                                <img src={screenshot} alt=""/>
                                                <SmallRedButton 
                                                    classProps="absolute top-1 right-1 flex items-center justify-center " 
                                                    text="&times;" 
                                                    tooltip="Delete this screenshot" 
                                                    onClickHandle={() => handleDeleteMedia(index, "screenshots")} 
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <Divider />
                                    <InputLabel htmlFor="trailers">Trailers</InputLabel>
                                    <div className="flex flex-col flex-wrap gap-2 max-w-full">
                                        {steamData.trailer && steamData.trailer.map((item,index) => (
                                            <div className="w-1/3 h-auto relative" key={index}>
                                                {(item.trailer.includes('youtube.com')) &&(
                                                    <iframe className="w-full" src={`${item.trailer.replace('watch?v=', 'embed/')}`} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                                                )}
                                                {(!item.trailer.includes('youtube.com'))&&(
                                                <video poster={item.thumbnail}  src={item.trailer} controls title={item.name}/>
                                                )}
                                                <SmallRedButton 
                                                    classProps="absolute top-1 right-1 flex items-center justify-center cursor-pointer" 
                                                    text="&times;" 
                                                    tooltip="Delete this Trailer" 
                                                    onClickHandle={() => handleDeleteMedia(index, "trailer")} 
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <Button type="button" variant="contained" onClick={handleAddTrailer}>Add New Trailer</Button>
                                </AccordionDetails>
                            </Accordion>

                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<FaCaretDown />}
                                >
                                    Additional Media
                                </AccordionSummary>
                                <AccordionDetails className="flex flex-col gap-5">
                                    <div>
                                        <InputLabel htmlFor="header image">Header Image</InputLabel>
                                        {
                                            steamData.headerImage &&(
                                                <img src={steamData.headerImage} alt=""/>
                                            )
                                        }

                                        <TextField
                                            required
                                            id="headerImage"
                                            variant="standard"
                                            value={steamData.headerImage}
                                            onChange={handleChange}
                                            fullWidth
                                            type="text"
                                        />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="publishers">Capsule Image</InputLabel>
                                        {steamData.capsuleImage &&(
                                            <img src={steamData.capsuleImage} alt=""/>
                                        )}
                                        <TextField
                                            required
                                            id="capsuleImage"
                                            variant="standard"
                                            value={steamData.capsuleImage}
                                            onChange={handleChange}
                                            fullWidth
                                            type="text"
                                        />
                                    </div>

                                </AccordionDetails>
                            </Accordion>
                            <div  className="flex flex-row gap-10">
                                <ButtonGroup variant="contained" aria-label="Basic button group">
                                <Button variant="contained" color="success" type="submit" className="rounded-sm p-2 bg-green-500 w-1/2 cursor-pointer hover:opacity-90">Update</Button>
                                <Button onClick={handleDeleteEntry} variant="contained" color="error" type="delete" className="rounded-sm p-2 bg-red-500 w-1/2 cursor-pointer hover:opacity-90">Delete</Button>
                                <Button onClick={handlePreview} variant="contained" color="info" type="button" className="rounded-sm p-2 bg-blue-500 w-1/2 cursor-pointer hover:opacity-90">Preview</Button>
                                </ButtonGroup>
                            </div>
                        </div>
                    </form>
                )}
        </div>

    )
}