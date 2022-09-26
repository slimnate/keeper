import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import { CssBaseline, Divider, Drawer, IconButton, Toolbar, Typography, Tooltip, Stack } from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";
import { styled, useTheme } from "@mui/material/styles";
import { Box } from "@mui/system";

import { useState } from "react";

const drawerWidth = 300;

const Main = styled('main', {shouldForwardProp: (prop) => prop !== 'open'})(
    ({ theme, open }) => ({
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        }),
        marginLeft: `-${drawerWidth}px`,
        ...(open && {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen
            }),
            marginLeft: 0,
        }),
        width: '100%',
        height: '100%',
        display: 'flex',
        padding: 0,
    })
);

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({theme, open}) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth})`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    })
}));

export default function Layout({ drawer, main, actionButtons }) {
    const theme = useTheme();
    const [open, setOpen] = useState(true);

    const handleDrawerOpen = () => {
        setOpen(true);
    }

    const handleDrawerClose = () => {
        setOpen(false);
    }

    return (
        <Box sx={{
            display: 'flex',
            height: '100%'
        }}>
            <CssBaseline />
            <AppBar position='fixed' open={open}>
                <Toolbar variant='dense'>
                    <Tooltip title="Show Project Panel" enterDelay={700}>
                        <IconButton
                            color='inherit'
                            aria-label='open drawer'
                            onClick={handleDrawerOpen}
                            edge='start'
                            sx={{
                                mr: 2,
                                ...(open && { display: 'none' })
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                    </Tooltip>
                    <Typography variant='h6' flexGrow={1}>
                        
                    </Typography>
                    <Stack direction='row' spacing={1}>
                        {actionButtons}
                    </Stack>
                </Toolbar>
            </AppBar>

            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                variant='persistent'
                anchor='left'
                open={open}
            >
                <Toolbar variant='dense'>
                    <Typography variant='h6' noWrap component='div' align="center" sx={{
                        flexGrow: 1,
                    }}>Project</Typography>
                    <Tooltip title='Hide Project Panel' enterDelay={700}>
                        <IconButton onClick={handleDrawerClose}>
                            {theme.direction === 'ltr' ? <ChevronLeft /> : <ChevronRight />}
                        </IconButton>
                    </Tooltip>
                </Toolbar>
                <Divider />
                {drawer}
            </Drawer>
            <Main open={open} sx={{height: '100%'}}>
                <Box flexGrow={0}><Box sx={{ width: '100%', height: '64px'}} /></Box>
                {main}
            </Main>
        </Box>
    );
};