import {Link} from "react-router-dom";

export default function Header() {
    return (
        <div className="flex border-b-1 text-center gap-2 justify-between p-3 bg-[#5a88af]">
            <Link to={'/'} className="hover:underline">
                Admin Dashboard
            </Link>

            <nav className="flex gap-3">
                <Link to={'/submit'} className="hover:underline">Add Game</Link>
                <Link to={'/batch'} className="hover:underline">Add Batch</Link>
            </nav>
        </div>
    )
}