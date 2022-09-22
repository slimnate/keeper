import { Check, Clear } from "@mui/icons-material";
import { Button, ButtonGroup, Paper, styled, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";

const ImageHolder = styled(Paper)(() => ({
    flexGrow: 1,
    flexShrink: 1,
    marginTop: '48px',
    minHeight: '75%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
}));

const Image = styled('img')(() => ({
    maxWidth: '100%',
    maxHeight: '100%',
}));

const MainContainer = styled(Box)(() => ({
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
    justifyContent:'stretch',
}));

const KeepButton = styled(Button)(() => ({
    flexGrow: '1',
}));

export default function ImageEditor({ projectExists, image }) {
    if (projectExists) {
        return (
            <MainContainer>
                <ImageHolder>
                    <Image src={`atom://${image.path}`} alt='Currently selected, full size'></Image>
                </ImageHolder>
                <Paper sx={{
                    flexGrow: 1,
                    display: 'flex',
                    paddingBottom: '10px',
                    height: '40px',
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                }}>
                    <ButtonGroup>
                        <KeepButton variant='contained' color='error'>
                            <Clear></Clear>
                        </KeepButton>
                        <KeepButton variant='contained' color='success'>
                            <Check></Check>
                        </KeepButton>
                    </ButtonGroup>
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