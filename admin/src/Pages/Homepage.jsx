import {useState, useEffect} from "react";
import {useNavigate, Link} from "react-router-dom";
import {Button, ButtonGroup, Checkbox} from "@mui/material";
import UniversalDialog from "./Components/UniversalDialog";
import Divider from '@mui/material/Divider';
import axios from "axios";

export default function AllGames() {

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [games, setGames] = useState([]);
    const navigate = useNavigate();
    const [selectedIds, setSelectedIds] = useState([])
    const [trigger, setTrigger] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogTitle, setDialogTitle] = useState(null);
    const [dialogContent, setDialogContent] = useState(null);
    const [onAgreeHandler, setOnAgreeHandler] = useState(() => () => {});
    const [mxWidth, setMxWidth] = useState("sm");

    const API_BASE = import.meta.env.VITE_API_BASE || "";
    
    const gameAPI = axios.create({
        baseURL: `${API_BASE}/game`,
        timeout: 10000,
    })

    useEffect(() => {
        async function fetchAllGames () {
            setLoading(true);
            try {
                const {data} = await gameAPI.get('/fetchall');
                console.log('data is ====================>', data);
                setGames(data);
            } catch (error) {
                setError(error)
            } finally {
                setLoading(false);
            }
        }
        fetchAllGames();
        if (trigger){
            fetchAllGames();
        }
        setTrigger(false);
    }, [])

    const navigateTo = (location) => {
        navigate(location)
    }


    const refreshData = async () => {
        setLoading(true);
        try {
            const {data} = gameAPI.get('/fetchall');
            setGames(data);
        } finally {
            setLoading(false);
        }
    }

    const handleReset = () => {
        if (!selectedIds.length){
            console.info('>>> WARNING: Nothing to reset!');
            return;
        }
        setSelectedIds([]);
    }

    const handleDelete = async (e) => {
        if (!selectedIds.length){
            console.info('>>> WARNING: No selected items to delete!');
            return;
        }
        e.preventDefault();
        console.log('>>> Delete entries confirmation popup opened')
        setDialogTitle('Confirm Delete');
        setDialogContent("Are you sure to delete selected entries?");
        setDialogOpen(true);
        setOnAgreeHandler(() => async ()  => {
        try {
            setLoading(true);
            setGames(prev => prev.filter(game => !selectedIds.includes(game._id)));
            const {data} = await gameAPI.delete('/deletemany', {data: {selectedIds}});
            console.log(">>> UPDATE: deleted successfully", data);
            setSelectedIds([]);
            setTrigger(prev => !prev);
        } catch (err) {
            console.log(">>> ERROR:", err);
            refreshData();
        } finally{
            setLoading(false);
            setDialogOpen(false);
        }
        })
    }

    const handleClose = () => {
        if (dialogOpen){
            setDialogOpen(false);
            console.log(">>> INFO: Dialog box closed")
        }
    }

    const handleCheckboxChange=(event)=>{
        const checked = event.target.checked;
        const gameId = event.target.name;
        setSelectedIds(prev => {
            if (checked) {
                return [...prev, gameId];
            } else {
                return prev.filter(id=> id !== gameId)
            }
        })
    }

    const handleSelectAll = () => { 
        if (selectedIds.length === games.length){
            console.info('>>> WARNING: All items are already selected!');
            return;
        }
        const allIds = games.map(game => game._id);
        setSelectedIds(allIds);
    }

    if (loading) {
        return (
        <div className="max-w-lg mx-auto my-5 text-center p-4 text-xl"> 
            Loading....
        </div> 
    )}

    if (!games.length) {
        return (
        <div className="max-w-lg mx-auto my-5 text-center p-4 text-xl"> 
            No game found
        </div> 
    )}



    console.log('>>> Targets are', selectedIds);
    return (
         <div className="p-4">
            <UniversalDialog
                open={dialogOpen}
                title={dialogTitle}
                content={dialogContent}
                onClose={handleClose}
                onAgree={onAgreeHandler}
                width = {mxWidth}
            />
            <div>
                <h1 className="text-5xl p-1 text-center font-semibold">SteamFetchAPI Editor</h1>
                <Divider className="p-1"/>
            <div className="grid ms:grid-cols-1 lg:grid-cols-5 md:grid-cols-3 gap-4 place-items-center my-4">
                {games && games.map((item,index) => (
                    <div className="p-2" key={index}>
                        <div className="flex flex-row items-center justify-between font-bold text-sm">
                            <h2 className="overflow-ellipsis truncate w-[210px]">{item.name}</h2>
                            <Checkbox checked={selectedIds.includes(item._id)} name={item._id} onChange={handleCheckboxChange} />
                        </div>
                            <img src={item.capsuleImage} className="w-[250px]" title={item?.appId} alt={item.name}/>
                        <div className="justify-center flex mt-1">
                        <ButtonGroup variant="contained" aria-label="Basic button group">
                            <Button onClick={()=>navigateTo(`/edit/${item._id}`)} variant="contained" color="success" type="submit" className="rounded-sm p-2 bg-green-500 w-1/2 cursor-pointer hover:opacity-90">Update</Button>
                            <Button onClick={()=>navigateTo(`/preview/${item._id}`)} variant="contained" color="info" type="button" className="rounded-sm p-2 bg-blue-500 w-1/2 cursor-pointer hover:opacity-90">Preview</Button>
                        </ButtonGroup>
                        </div>
                    </div>
                ))}
            </div>
        {selectedIds.length > 0 && (
            <div className="flex flex-row p-2 fixed right-0 bottom-0 mx-5 border-1 border-b-0 bg-white">
                <ButtonGroup className="flex-row gap-1">
                    <Button variant="contained" type="button" color="error" onClick={handleDelete}>Delete Selected</Button>
                    <Button variant="contained" color="info" type="reset" onClick={handleSelectAll} >Select All</Button>
                    <Button variant="contained" color="info" type="reset" onClick={handleReset} >Clear Selection</Button>

                </ButtonGroup>
            </div>
            )}
        </div>
        </div>

    )
}