
import {
    AppBar,
    Toolbar,
    Typography,
    MenuItem, Menu, Button
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import {Link} from "react-router-dom";
import React from "react";

const Header: React.FC = () => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };



    return (
        <div style={{minWidth: "100%"}}>
            <AppBar position="sticky">
                <Toolbar>
                    <Button
                        color="inherit"
                        aria-label="menu"
                        onClick={handleClick}
                    >
                        <MenuIcon sx={{ mr: 1 }} /> {/* Add margin to space out text and icon */}
                        <Typography variant="body1">Tools</Typography>
                    </Button>
                    <Link to="/" style={{ textDecoration: 'none', color: 'inherit', width: "100%" }}>
                        <Typography variant="h2" sx={{ flexGrow: 1, textAlign: "center"}}>
                            Tools and Utilities
                        </Typography>
                    </Link>
                </Toolbar>
            </AppBar>
            <Menu
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <MenuItem component={Link} to="/parallel-testing-tool" onClick={handleClose}>Parallel Testing tool</MenuItem>
                <MenuItem component={Link} to="/data-uploader" onClick={handleClose}>Data load</MenuItem>
            </Menu>
        </div>
    );
};

export default Header;
