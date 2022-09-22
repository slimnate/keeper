import { Box, Stack } from "@mui/system";
import { Button, Paper, Typography } from "@mui/material";

export default function NoProjectDialog({width = 300}) {
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
                    <Button variant='contained'>Create new project</Button>
                    <Typography variant='subtitle2'>OR</Typography>
                    <Button variant='contained'>Open existing project</Button>
                </Stack>
            </Paper>
        </Box>
    );
}