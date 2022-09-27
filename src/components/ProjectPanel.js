import { Avatar, Button, ButtonGroup, Divider, Tooltip, List, ListItem, ListItemAvatar, ListItemText, Paper, Switch, useTheme, Typography } from "@mui/material";
import { useRef } from "react";
import { useCustomCompareEffect } from "react-use";
import { getImagePath } from "../lib/helpers";
import { useOnScreen } from "../lib/hooks";

import ProjectInfo from "./ProjectInfo";


export default function ProjectPanel({ project, selectedImage, onUpdateSelectedImage, onUpdateImage, onUpdateProject, onSaveProject, onExportProject }) {
    const theme = useTheme();
    const imageCount = project.images.length;
    const imageListRef = useRef();
    const activeListItemRef = useRef();
    const activeItemVisible = useOnScreen(imageListRef, activeListItemRef);
    const selectedCount = project.images.filter(img => {
        return img.keep;
    }).length;

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

    useCustomCompareEffect(() => {
        console.log('customEffectHook');
        console.log({activeItemVisible});
        if(!activeItemVisible) {
            console.log('scrolling to view');
            activeListItemRef.current.scrollIntoView();
        }
    }, [selectedImage, activeItemVisible], ([currSelected, currVisible], [prevSelected, prevVisible]) => {
        return prevSelected === currSelected;
    })

    const imageListItems = project.images.map(image => {
        const { id, relativePath, keep } = image;
        const selected = id === selectedImage;

        return <ListItem
                    ref={selectedImage === id ? activeListItemRef : null}
                    id={`list-item-${id}`}
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
                            variant='rounded'
                            alt='Image Preview'
                            src={getImagePath(image)}
                            sx={{
                                '& img': {
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    height: 'auto',
                                },
                            }}
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
            <Paper ref={imageListRef} elevation={2} sx={{
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
                        <Button variant='contained' color="secondary" onClick={handleExportProject}>Export ({selectedCount})</Button>
                    </Tooltip>
                    <Tooltip title='Save changes to project'>
                        <Button variant='contained' onClick={handleSaveProject}>Save</Button>
                    </Tooltip>
                </ButtonGroup>
            </Paper>
        </>
    )
};