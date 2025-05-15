import Home from "../components/Home.tsx";
import {Route, Routes} from "react-router-dom";
import React from "react";
import ParallelTesting from "../components/PrallelTesting.tsx";
import DataUploader from "../components/DataUploader.tsx";

const CustomRoute: React.FC = () => {
    return(
        <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/parallel-testing-tool" element={<ParallelTesting/>} />
            <Route path="/data-uploader" element={<DataUploader/>} />
        </Routes>
    )
}

export default CustomRoute;