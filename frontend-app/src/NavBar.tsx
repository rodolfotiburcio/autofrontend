import {useState} from 'react';
import type {MouseEvent} from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Menu,
    MenuItem,
    Button,
    Box
} from '@mui/material'

import MenuIcon from '@mui/icons-material/Menu';

export default function NavBar() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const pages = ['Proyectos', 'Reportes', 'Clientes', 'Trabajadores'];
    
    const handleOpenMenu = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar position="static">
            <Toolbar>
                {/* Icono para pantallas pequeñas */}
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    onClick={handleOpenMenu}
                    sx={{ mr: 2, display: {xs: 'flex', md: 'none'} }}
                >
                    <MenuIcon />
                </IconButton>

                {/* Título / Logo */}
                <Typography variant="h6" component="div" sx={{ flexGrow: 1}}>
                    INAMEX AUTOMATION
                </Typography>

                {/* Botones de la pagina para pantallas md+ */}
                <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                    {pages.map(page => (
                        <Button
                            key={page}
                            color="inherit"
                            onClick={() => console.log(`Navegar a ${page}`)}
                        >
                            {page}
                        </Button>
                    ))}
                </Box>
                {/* Menú desplegable para pantallas xs */}
                <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                sx={{ display: { xs: 'block', md: 'none' } }}
                >
                {pages.map(page => (
                    <MenuItem
                    key={page}
                    onClick={() => {
                        console.log(`Navegar a ${page}`);
                        handleCloseMenu();
                    }}
                    >
                    {page}
                    </MenuItem>
                ))}
                </Menu>
            </Toolbar>
        </AppBar>
    )
}