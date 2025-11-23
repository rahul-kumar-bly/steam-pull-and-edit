import {BrowserRouter, Route, Routes} from "react-router-dom";
import Homepage from "./Pages/Homepage.jsx";
import Header from "./Pages/Components/Header.jsx";
import SubmitGame from "./Pages/SubmitGame.jsx";
import Editor from "./Pages/Editor.jsx"
import Footer from "./Pages/Components/Footer.jsx"
import SubmitManualGame from "./Pages/SubmitManualGame.jsx";
import SubmitMultipleGames from "./Pages/SubmitMultipleGames.jsx";

export default function App() {
    return (
        <BrowserRouter>
            <Header />
            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/submit" element={<SubmitGame />} />
                <Route path="/manual" element={<SubmitManualGame />} />
                <Route path="/batch" element={<SubmitMultipleGames />} />
                <Route path="/edit/:id" element={<Editor />} />
            </Routes>
            <Footer/>
        </BrowserRouter>
    )
}