import { Check, Clear } from "@mui/icons-material";
import { Button, ButtonGroup, Paper, styled } from "@mui/material";
import { Box } from "@mui/system";

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

export default function ImageEditor({ image , onUpdateImage, onRotateSelectedImage }) {
    const handleAction = action => () => {
        if(action === 'keep') {
            // update image to keep
            onUpdateImage({
                ...image,
                keep: true,
            });
        } else if (action === 'discard') {
            // update image to discard
            onUpdateImage({
                ...image,
                keep: false,
            });
        }
        onRotateSelectedImage();
    }

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
                    <KeepButton variant='contained' color='error' onClick={handleAction('discard')}>
                        <Clear></Clear>
                    </KeepButton>
                    <KeepButton variant='contained' color='success' onClick={handleAction('keep')}>
                        <Check></Check>
                    </KeepButton>
                </ButtonGroup>
            </Paper>
        </MainContainer>
    );
}