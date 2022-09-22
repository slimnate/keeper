import { Avatar, Button, ButtonGroup, Divider, Tooltip, List, ListItem, ListItemAvatar, ListItemText, Paper, Switch, useTheme, Typography } from "@mui/material";

import ProjectInfo from "./ProjectInfo";


export default function ProjectPanel({ project, selectedImage, onUpdateSelectedImage, onUpdateImage, onUpdateProject, onSaveProject, onExportProject }) {
    const theme = useTheme();
    const imageCount = project.images.length;

    const handleToggleKeep = id => () => {
        const image = project.images.filter(image => image.id === id).pop();

        onUpdateImage({
            ...image,
            keep: !image.keep
        });
    };

    const handleImageListItemClicked = id => (e) => {
        if(e.target.id === `switch-${id}`) return;
        onUpdateSelectedImage(id);
    }

    const handleSaveProject = e => {
        onSaveProject();
    }

    const handleExportProject = e => {
         onExportProject()
    }

    const imageListItems = project.images.map(({ id, path, relativePath, keep }) => {
        const selected = id === selectedImage;

        return <ListItem
                    key={id}
                    onClick={handleImageListItemClicked(id)}
                    sx={{
                        ...(selected && {
                            backgroundColor: theme.palette.grey[300],
                        })
                    }}
                >
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
                marginBottom: 0,
            }}>
                <List dense>
                    {imageListItems}
                </List>
            </Paper>
            <Typography
                variant='subtitle2'
                fontSize={10}
                alignSelf='center'
                sx={{
                    padding: 0.2
                }}
            >
                {imageCount} images
            </Typography>
            <Divider />
            <Paper sx={{
                padding: '10px',
            }}>
                <ProjectInfo project={project} onUpdateProject={onUpdateProject}></ProjectInfo>
                <ButtonGroup fullWidth={true}>
                    <Tooltip title='Export the selected images to the export folder'>
                        <Button variant='contained' color="secondary" onClick={handleExportProject}>Export</Button>
                    </Tooltip>
                    <Tooltip title='Save changes to project'>
                        <Button variant='contained' onClick={handleSaveProject}>Save</Button>
                    </Tooltip>
                </ButtonGroup>
            </Paper>
        </>
    )
};