import { Avatar, Button, ButtonGroup, Divider, Tooltip, List, ListItem, ListItemAvatar, ListItemText, Paper, Switch } from "@mui/material";

import ProjectInfo from "./ProjectInfo";


export default function ProjectPanel({ project, selectedImage, onUpdateSelectedImage, onUpdateImage, onUpdateProject }) {

    const handleToggleKeep = (id) => () => {
        const image = project.images.filter(image => image.id === id).pop();

        onUpdateImage({
            ...image,
            keep: !image.keep
        });
    };

    const handleImageListItemClicked = id => (e) => {
        if(e.target.id === `switch-${id}`) return;

        console.log(id);
        onUpdateSelectedImage(id)
    }

    const imageListItems = project.images.map(({ id, path, relativePath, keep }) => {
        return <ListItem key={id} onClick={handleImageListItemClicked(id)}>
            <ListItemAvatar>
                <Avatar
                    alt='Image Preview'
                    src={`atom://${path}`}
                />
            </ListItemAvatar>
            <ListItemText>{relativePath}</ListItemText>
            <Switch
                edge='end'
                id={`switch-${id}`}
                onChange={handleToggleKeep(id)}
                checked={keep}
                color={keep ? 'success' : 'warning' }
            />
        </ListItem>
    });
    
    return (
        <>
            <Paper elevation={2} sx={{
                flexGrow: 1,
                margin: '10px',
                maxHeight: '100%',
                overflow: 'auto',
            }}>
                <List dense>
                    {imageListItems}
                </List>
            </Paper>
            <Divider />
            <Paper sx={{
                padding: '10px',
            }}>
                <ProjectInfo project={project} onUpdateProject={onUpdateProject}></ProjectInfo>
                <ButtonGroup fullWidth={true}>
                    <Tooltip title='Export the selected images to the export folder'>
                        <Button variant='contained' color="secondary">Export</Button>
                    </Tooltip>
                    <Tooltip title='Save changes to project'>
                        <Button variant='contained'>Save</Button>
                    </Tooltip>
                </ButtonGroup>
            </Paper>
        </>
    )
};