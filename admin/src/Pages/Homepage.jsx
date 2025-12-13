import {useState, useEffect} from "react";
import {useNavigate, Link} from "react-router-dom";
import {Button, ButtonGroup, Checkbox} from "@mui/material";

export default function AllGames() {

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [games, setGames] = useState([]);
    const navigate = useNavigate();
    const [selectedIds, setSelectedIds] = useState([])
    const [trigger, setTrigger] = useState(false);

    useEffect(() => {
        async function fetchAllGames () {
            setLoading(true);
            try {
                const res = await fetch(`/api/game/fetchall`)
                const games = await res.json()
                setGames(games)
                console.log(games)
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
    }, [trigger])

    const navigateTo = (location) => {
        navigate(location)
    }

    const handleReset = async => {
        if (!selectedIds.length){
            console.info('>>> WARNING: Nothing to reset!');
            return;
        }
        setSelectedIds([]);
    }

    const handleDelete = async () => {
        if (!selectedIds.length){
            console.info('>>> WARNING: No selected items to delete!');
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(`/api/game/deletemany`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({selectedIds}),
            });
            const data = await res.json();
            console.log(">>> UPDATE: deleted successfully", data);
            setTrigger(true);
            setSelectedIds([]);
            setLoading(false);
        } catch (err) {
            console.log(">>> ERROR:", err);
            setLoading(false);
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

    if (games.length === 0) {
        return (
            <p>No Data found, add something.</p>
        )
    }

    console.log('>>> Targets are', selectedIds);
    return (
        <div className="flex flex-row gap-3 flex-wrap p-5 mx-50 justify-center">
            <div className="flex flex-col">
            <h1 className="text-5xl text-center">SteamFetchAPI</h1>
            <div className="flex flex-row gap-3 flex-wrap">
            {games && games.map((item,index) => (
                <div className="p-4" key={index}>
                    <Checkbox checked={selectedIds.includes(item._id)} name={item._id} onChange={handleCheckboxChange} />
                    <Link to={`/edit/${item._id}`}>
                        <img src={item.capsuleImage} className="w-[250px]"/>
                    </Link>
                    <div className="flex flex-row justify-center gap-5 mt-1">
                    <ButtonGroup variant="contained" aria-label="Basic button group">
                        <Button onClick={()=>navigateTo(`/edit/${item._id}`)} variant="contained" color="success" type="submit" className="rounded-sm p-2 bg-green-500 w-1/2 cursor-pointer hover:opacity-90">Update</Button>
                        <Button onClick={()=>navigateTo(`/preview/${item._id}`)} variant="contained" color="info" type="button" className="rounded-sm p-2 bg-blue-500 w-1/2 cursor-pointer hover:opacity-90">Preview</Button>
                    </ButtonGroup>
                    </div>
                </div>
            ))}

            </div>
            <div className="flex flex-row gap-3 flex-wrap p-5 mx-20 justify-center">
            {selectedIds && (
                <ButtonGroup>
                    <Button variant="contained" type="button" color="success" onClick={handleDelete} className="w-[200px]">Delete Selected</Button>
                    <Button variant="contained" color="warning" type="reset" onClick={handleReset} className="w-[200px]">Clear Selection</Button>
                </ButtonGroup>
            )}
        </div>
        </div>
        </div>

    )
}