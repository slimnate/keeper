import { Check, Clear } from "@mui/icons-material";
import { Button, ButtonGroup, Paper, styled } from "@mui/material";
import { Box } from "@mui/system";
import { atomize } from "../lib/helpers";

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

export default function ImageEditor({ image , onImageAction }) {

    return (
        <MainContainer>
            <ImageHolder>
                <Image src={atomize(image.previewPath)} alt='Currently selected, full size'></Image>
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
                    <KeepButton variant='contained' color='error' onClick={onImageAction('discard', image)}>
                        <Clear></Clear>
                    </KeepButton>
                    <KeepButton variant='contained' color='success' onClick={onImageAction('keep', image)}>
                        <Check></Check>
                    </KeepButton>
                </ButtonGroup>
            </Paper>
        </MainContainer>
    );
}