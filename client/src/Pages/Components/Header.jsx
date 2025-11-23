import {Link} from 'react-router-dom'
import logo from '../../assets/logo.png'

export default function Header(){
    return (
        <>
            <div>
                <Link to="/">
                    <img src={logo} alt="header logo" width="150px" height="auto"/>
                </Link>


            </div>
        </>
    )
}