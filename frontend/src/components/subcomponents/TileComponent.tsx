import {Box} from "@mui/material";
import React from "react";


const TileComponent: React.FC<{children: React.ReactNode}> = ({children}) =>{
    return(
        <Box sx={{ border: "1px solid #ccc", p: 2, borderRadius: 2, minWidth: "40%", margin: '2%', padding: '2%'}}>
            {children}
        </Box>
    )
}

export default TileComponent;