import { Button, Paper, styled, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";

const ImageHolder = styled(Paper)(({theme}) => ({
    flexGrow: 1,
    flexShrink: 1,
    marginTop: '48px',
    minHeight: '75%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
}));

const Image = styled('img')(({theme}) => ({
    maxWidth: '100%',
    maxHeight: '100%',
}));

export default function ImageEditor({ projectExists, image }) {
    if (projectExists) {
        return (
            <Box flexGrow={1} sx={{
                display: 'flex',
            }}
            flexDirection='column'>
                <ImageHolder container>
                    <Image src={`atom://${image.path}`} alt='Currently selected, full size'></Image>
                </ImageHolder>
                <Paper sx={{
                    flexGrow: 1,
                    padding: '10px'
                }}>
                        Image buttons<br/>
                        Image buttons<br/>
                </Paper>
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