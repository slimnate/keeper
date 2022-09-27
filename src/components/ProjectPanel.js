import { Avatar, Button, ButtonGroup, Divider, Tooltip, List, ListItem, ListItemAvatar, ListItemText, Paper, Switch, useTheme, Typography } from "@mui/material";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { getImagePath } from "../lib/helpers";
import { useOnScreen } from "../lib/hooks";

import ProjectInfo from "./ProjectInfo";


export default function ProjectPanel({ project, selectedImage, shouldScroll, setShouldScroll, onUpdateSelectedImage, onUpdateImage, onUpdateProject, onSaveProject, onExportProject }) {
    const theme = useTheme();
    const imageCount = project.images.length;
    const imageListRef = useRef();
    const imageRefs = useRef([]);
    const activeItemVisible = useOnScreen(imageListRef, imageRefs, selectedImage);
    const selectedCount = project.images.filter(img => {
        return img.keep;
    }).length;

    const handleToggleKeep = useCallback(id => () => {
        const image = project.images.filter(image => image.id === id).pop();

        onUpdateImage({
            ...image,
            keep: !image.keep
        });
    }, [onUpdateImage, project.images])

    const handleImageListItemClicked = useCallback(id => (e) => {
        if(e.target.id === `switch-${id}`) return;
        setShouldScroll(false);
        onUpdateSelectedImage(id);
    }, [setShouldScroll, onUpdateSelectedImage])

    const handleSaveProject = e => {
        onSaveProject();
    }

    const handleExportProject = e => {
         onExportProject()
    }

    const scrollToSelectedListItem = useCallback(() => {
        imageRefs.current[selectedImage].scrollIntoView();
        setShouldScroll(false);
    }, [selectedImage, setShouldScroll]);

    useEffect(() => {
        if(!activeItemVisible && shouldScroll) {
            scrollToSelectedListItem();
        }
    }, [shouldScroll, activeItemVisible, scrollToSelectedListItem]);

    const imageListItems = useMemo(() => {
        return project.images.map(image => {
            const { id, relativePath, keep } = image;
            const selected = id === selectedImage;
    
            return <ListItem
                        ref={el => {
                            imageRefs.current[id] = el
                        }}
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
        })
    }, [project.images, selectedImage, theme.palette.grey, handleToggleKeep, handleImageListItemClicked])
    
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