import './App.css'
import {BrowserRouter as Router} from "react-router-dom";
import Header from "./components/Header.tsx";
import CustomRoute from "./router/Router.tsx";

const App: React.FC = () => {
    return (
        <div className="fullscreen-container">
            <Router>
                <Header />
                <div style={{ padding: '20px', height: '85%' }}>
                    <CustomRoute/>
                </div>
            </Router>
        </div>
    );
};

export default App
