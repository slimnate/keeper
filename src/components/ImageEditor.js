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

const MainContainer = styled(Box)(({theme}) => ({
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
}));

export default function ImageEditor({ projectExists, image }) {
    if (projectExists) {
        return (
            <MainContainer>
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
            </MainContainer>
        );
    } else {
        return (
            <MainContainer sx={{
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <Paper
                    elevation={4}
                    flexGrow={1}
                    sx={{
                        width: '300px',
                    }}
                >
                    <Stack direction='column' alignItems='center' padding='20px'>
                        <Typography>No project currently open, please:</Typography>
                        <Button variant='contained'>Create project from folder</Button>
                        <Typography variant='subtitle2'>OR</Typography>
                        <Button variant='contained'>Open existing project</Button>
                    </Stack>
                </Paper>
            </MainContainer>
        );
    }
}