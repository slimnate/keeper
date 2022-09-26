import { Box, Stack } from "@mui/system";
import { Button, Paper, Typography } from "@mui/material";

export default function NoProjectPrompt({width = 300, setShowCreateDialog, onOpenProject }) {

    const handleCreateButtonClick = (e) => {
        setShowCreateDialog(true);
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
                sx={{
                    width: width,
                }}
            >
                <Stack direction='column' alignItems='center' padding='20px'>
                    <Typography variant='h6'>Get started</Typography>
                    <Button variant='contained' onClick={handleCreateButtonClick}>Create new project</Button>
                    <Typography variant='subtitle2'>OR</Typography>
                    <Button variant='contained' onClick={onOpenProject}>Open existing project</Button>
                </Stack>
            </Paper>
        </Box>
    );
}