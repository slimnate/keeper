import { Box, Stack } from "@mui/system";
import { Button, Paper, Typography } from "@mui/material";

import { toast } from "react-toastify";

export default function NoProjectPrompt({width = 300, setShowCreateDialog, onOpenProject }) {

    const handleCreateButtonClick = (e) => {
        setShowCreateDialog(true);
    }

    const handleOpenButtonClick = () => {
        window.api.fs.openFile().then(files => {
            if(files === undefined) return;
            const file = files[0];

            console.log(file);

            window.api.fs.openProject(file).then(({err, project}) => {
                console.log(project);
                if(err) {
                    toast(`Error opening project: ${err}`);
                    return;
                }
                onOpenProject(project);
            });
        });
    }

    return (
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
                    <Button variant='contained' onClick={handleOpenButtonClick}>Open existing project</Button>
                </Stack>
            </Paper>
        </Box>
    );
}