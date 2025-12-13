import {useState, useEffect} from "react";
import {useNavigate, Link} from "react-router-dom";
import {Button, ButtonGroup, Checkbox, selectClasses} from "@mui/material";

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

    const handleDelete = async () => {
            try {
                const res = await fetch(`/api/game/deletemany`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({selectedIds}),
                });
                const data = await res.json();
                console.log(">>> UPDATE: deleted successfully", data);
                // refreshPage();
                setTrigger(true);
                setSelectedIds([]);
            } catch (err) {
                console.log(">>> ERROR:", err);
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
                <div className="flex-wrap flex flex-col gap-2">
                <Button variant="contained" type="button" onClick={()=>handleDelete()} className="w-[200px]">Delete Selected</Button>
                </div>
            )}
        </div>

            </div>


        </div>

    )
}