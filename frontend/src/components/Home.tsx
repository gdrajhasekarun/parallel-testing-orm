// src/pages/Home.tsx
import React from 'react';
import {Box, Card, CardActionArea, CardContent, Typography} from "@mui/material";
import {Link} from "react-router-dom";

const Home: React.FC = () => {
    return (
        <>
            <Typography variant="h4">
                React Learning with Python for Large Data comparison.
            </Typography>
            <Box sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center", // Center both horizontally and vertically
                paddingTop: "2%"
            }}>

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", // Ensure responsive behavior
                        gap: 3,
                        width: "70%", // Adjust width to properly center the content
                        maxWidth: "700px", // Limit max width for better alignment
                    }}
                >
                    <Card>
                        <CardActionArea
                            component={Link}
                            to="/parallel-testing-tool" // Add your route path here
                            sx={{
                                height: '100%',
                                '&[data-active]': {
                                    backgroundColor: 'action.selected',
                                    '&:hover': {
                                        backgroundColor: 'action.selectedHover',
                                    },
                                },
                            }}
                        >
                            <CardContent sx={{ height: '100%' }}>
                                <Typography variant="h5" component="div">
                                    Parallel Testing Tool
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Parallel Testing tool help us with comparing two data sources.
                                    This tool is very helpful with the system migration testing.
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                    <Card>
                        <CardActionArea
                            component={Link}
                            to="/data-uploader" // Add your route path here
                            sx={{
                                height: '100%',
                                '&[data-active]': {
                                    backgroundColor: 'action.selected',
                                    '&:hover': {
                                        backgroundColor: 'action.selectedHover',
                                    },
                                },
                            }}
                        >
                            <CardContent sx={{ height: '100%' }}>
                                <Typography variant="h5" component="div">
                                    Data Load
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    This Module helps with the data load for Various testing.
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Box>
            </Box>
        </>
    )
};

export default Home;
