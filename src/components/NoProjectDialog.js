import { Box, Stack } from "@mui/system";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Typography } from "@mui/material";

import { useState } from "react";
import ProjectInfo from "./ProjectInfo";

const projectScaffold = {
    name: '',
    basePath: '',
    exportPath: 'keepers',
}

export default function NoProjectDialog({width = 300, onCreateProject}) {
    const [open, setOpen] = useState(false);
    const [project, setProject] = useState(projectScaffold);

    const handleCreateButtonClick = (e) => {
        setOpen(true);
    }

    const handleAction = action => (e) => {
        if (action === 'close') {
            setOpen(false);
        } else if (action === 'cancel') {
            //reset project skeleton if cancelled
            setProject(projectScaffold);
            setOpen(false);
        } else if (action === 'create') {
            onCreateProject(project);
            setOpen(false);
        }
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
            onClose={handleAction('close')}
        >
            <DialogTitle>
                Create new project
            </DialogTitle>
            <DialogContent>
                <ProjectInfo project={project} onUpdateProject={handleUpdateProject} pathEditable={true} width='400px'/>
            </DialogContent>
            <DialogActions>
                <Button variant='contained' onClick={handleAction('cancel')}>Cancel</Button>
                <Button variant='contained' onClick={handleAction('create')}>Create Project</Button>
            </DialogActions>
        </Dialog>
        </>
    );
}