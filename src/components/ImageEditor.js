import { Button, Paper, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";

export default function ImageEditor({ projectExists, image }) {
    if (projectExists) {
        return (
            <Box>
                {image.id} - {image.path}
            </Box>
        );
    } else {
        return (
            <Box flexGrow={1} alignContent='center' alignItems='center'>
                <Paper
                    elevation={4}
                    sx={{
                        width: '300px',
                        alignContent: 'center',
                        flexGrow: 1
                    }}
                >
                    <Stack direction='column' alignItems='center' padding='20px'>
                        <Typography>No project currently open, please:</Typography>
                        <Button variant='contained'>Create project from folder</Button>
                        <Typography variant='subtitle2'>OR</Typography>
                        <Button variant='contained'>Open existing project</Button>
                    </Stack>
                </Paper>
            </Box>
        );
    }
}