import { Box, Stack } from "@mui/system";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Typography } from "@mui/material";

import { useState } from "react";
import ProjectInfo from "./ProjectInfo";

export default function NoProjectDialog({width = 300}) {
    const [open, setOpen] = useState(false);
    const [project, setProject] = useState({
        name: '',
        basePath: '',
        exportPath: '',
    });

    const handleCreateButtonClick = (e) => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const handleUpdateProject = (newProject) => {
        setProject(newProject);
    }

    return (
        <>
        <Box sx={{
            display: 'flex',
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <Paper
                elevation={4}
                flexGrow={1}
                sx={{
                    width: width,
                }}
            >
                <Stack direction='column' alignItems='center' padding='20px'>
                    <Typography variant='h6'>Get started</Typography>
                    <Button variant='contained' onClick={handleCreateButtonClick}>Create new project</Button>
                    <Typography variant='subtitle2'>OR</Typography>
                    <Button variant='contained'>Open existing project</Button>
                </Stack>
            </Paper>
        </Box>
        <Dialog
            open={open}
            onClose={handleClose}
        >
            <DialogTitle>
                Create new project
            </DialogTitle>
            <DialogContent>
                <ProjectInfo project={project} onUpdateProject={handleUpdateProject} />
            </DialogContent>
            <DialogActions>
                <Button variant='contained' onClick={handleClose}>Cancel</Button>
                <Button variant='contained' onClick={handleClose}>Create Project</Button>
            </DialogActions>
        </Dialog>
        </>
    );
}