import {useState, useEffect, use} from "react";
import {useParams} from "react-router-dom";
import {Button, ButtonGroup} from "@mui/material";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Alert from '@mui/material/Alert'
import { FaCaretDown } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import {useDeleteMedia} from "../hooks/useDeleteMedia.js";
import UniversalDialog from './Components/UniversalDialog.jsx';
import UniversalDialogForm from './Components/UniversalDialogForm.jsx';
import {useSteamFormInput} from "../hooks/useSteamFormInput.js";
import { usePushMedia } from "../hooks/usePushMedia.js";
import NameInfo from "./Components/Editor UI/NameInfo.jsx";
import GameDesc from "./Components/Editor UI/GameDesc.jsx";
import MetaInfo from "./Components/Editor UI/MetaInfo.jsx";
import MediaComponents from "./Components/Editor UI/MediaComponents.jsx";
import AdditionalMedia from "./Components/Editor UI/AdditionalMedia.jsx";

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
        steamUrl: "",
        releaseDate: []
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
    const [dialogFormOpen, setDialogFormOpen] = useState(false);
    const [dialogFormTitle, setDialogFormTitle] = useState(null);
    const [dialogFormContent, setDialogFormContent] = useState(null);
    const [dataLabel, setDataLabel] = useState('Value....');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogTitle, setDialogTitle] = useState(null);
    const [dialogContent, setDialogContent] = useState(null);
    const [onAgreeHandler, setOnAgreeHandler] = useState(() => () => {});
    const [mxWidth, setMxWidth] = useState("sm");



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
                    console.log('>>> ERROR: Unable to delete entry', data.message);
                    setError(`Error in deleting entry: ${data.message}`);
                }

            } catch (error) {
                console.log('ERROR: Unable to delete entry', error);
                setError(`Error encountered while deleting game: ${error}`);
            }
        finally {
            setLoading(false);
            navigate('/');
        }
        })

    };

    // Produce dialog to confirm deletion of individual screenshot or trailer
    const handleDeleteHook = useDeleteMedia(steamData, setError, setSteamData)
    const handleDeleteMedia = (index, mediaType) => {
            setDialogTitle('Confirm');
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
        console.log('>>> INFO: Your ID is', trailerVidId);
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
                                    <MetaInfo gameDb={steamData} handleChange={handleChange} handleDeleteMedia={handleDeleteMedia} handleAddDevs={handleAddDevs} handleAddGenre={handleAddGenre} handleAddPubs={handleAddPubs}/>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<FaCaretDown />}
                                >
                                    Media (Screenshots & Trailers)
                                </AccordionSummary>
                                <AccordionDetails className="flex flex-col gap-5">
                                    <MediaComponents gameDb={steamData} handleAddScreenshot={handleAddScreenshot} handleAddTrailer={handleAddTrailer} handleDeleteMedia={handleDeleteMedia} />
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
                            <div className="flex flex-row p-2 fixed right-0 bottom-0 mx-5 border-1 border-b-0 bg-white">
                            {/* <div  className="flex flex-row gap-10"> */}
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