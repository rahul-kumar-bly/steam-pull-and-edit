import {BrowserRouter, Route, Routes} from "react-router-dom";
import Homepage from "./Pages/Homepage.jsx";
import Product from "./Pages/Product.jsx"
import Header from "./Pages/Components/Header.jsx";
import { Provider } from "./components/ui/provider.jsx"


export default function App() {
return (
    <Provider>
        <BrowserRouter>
            <Header />
            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/product/:id" element={<Product />} />
            </Routes>
        </BrowserRouter>
    </Provider>
)
}