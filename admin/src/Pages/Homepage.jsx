import {useState, useEffect} from "react";
import {useNavigate, Link} from "react-router-dom";
import {Button, ButtonGroup} from "@mui/material";

export default function AllGames() {

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [games, setGames] = useState([]);
    const navigate = useNavigate();

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
    }, [])

    const navigateTo = (location) => {
        navigate(location)
    }

    if (games.length === 0) {
        return (
            <p>No Data found, add something.</p>
        )
    }
    return (
        <div className="flex flex-row gap-3 flex-wrap p-5 mx-20 justify-center">
            {games && games.map((item,index) => (
                <div className="p-4" key={index}>
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
    )
}