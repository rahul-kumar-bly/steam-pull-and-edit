import {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import "../assets/css/style.css"
import { FaShoppingCart } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa6";
import {Spinner} from "@chakra-ui/react";


export default function Homepage() {

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [games, setGames] = useState([]);

    useEffect(() => {
        async function fetchAllGames () {
            setLoading(true);
            try {
                const res = await fetch(`http://localhost:8080/game/fetchall`)
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
        <div>
            <div>{loading && (
                <div  className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50 z-50">
                    <Spinner size={"lg"}/>
                </div>
            )}
            </div>
            <div className="warning"><p></p></div>
            <div className="main-container">
                <div className="shop" id="shop">
                    {games && games.map(item => (
                        <div className="prod" id={`prod-id-${item._id}`}>
                            <div className="prod-image">
                                <Link to={`/product/${item._id}`}>
                                    <img src={item.headerImage} alt=""/>
                                </Link>
                            </div>

                            <div className="prod-info">
                                <div className="prod-details">
                                    <a href="" className="item-title truncate w-50">{item.name}</a>
                                    <span className="item-price">₹{item.price}</span>
                                </div>

                                <div className="prod-action">
                                    <a id="addToCart">
                                        <div className="prod-cart">
                                            <p> <FaShoppingCart /> ADD TO CART</p>
                                        </div>
                                    </a>
                                    <a id="addToWishlist">
                                        <div className="prod-wishlist">
                                            <p><FaRegHeart className="h-[20px]"/></p>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>

    )
}