import {useState, useEffect} from "react";
import {Link} from "react-router-dom";



export default function AllGames() {

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [games, setGames] = useState([]);

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


    return (
        <div className="flex flex-row gap-3 flex-wrap p-5">
            {loading && (
                <p>Loading.....</p>
            )}
        {!games && (
            <p>No games found, add new!</p>
        )}
            {games && games.map((item,index) => (
                <div className="" key={index}>
                    <Link to={`/edit/${item._id}`}>
                        <img src={item.capsuleImage} className="w-[200px]"/>
                    </Link>
                </div>
            ))}
        </div>
    )
}