import { FolderOpen } from "@mui/icons-material";
import { Avatar, Button, ButtonGroup, Divider, Tooltip, List, ListItem, ListItemAvatar, ListItemText, Paper, Switch, TextField, InputAdornment, IconButton, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import path from "path-browserify";
import { useState } from "react";


export default function ProjectPanel({ project, selectedImage, onUpdateSelectedImage, onUpdateImage, onUpdateProject }) {
    const [pathError, setPathError] = useState(null);

    function handleBrowseForProjectFolder() {
        window.electronAPI.openFolder().then((path) => {
            console.log(path);

            if(path === undefined) return;

            onUpdateProject({
                ...project,
                basePath: path
            })
        });
    }

    function handleExportFolderTextChange(e) {
        const exportPath = e.target.value
        let err = null;
        if(exportPath.length > 1) {
            if(!/^(?=[a-zA-Z0-9._\s]{1,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/.test(exportPath)){
                err = 'Invalid characters';
            }
        }
        setPathError(err);

        onUpdateProject({
            ...project,
            exportPath: exportPath
        })
    }

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
    const exportFullPath = path.join(project.basePath, project.exportPath);
    
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
                <Stack direction='column' spacing={1}>
                    <TextField
                        id='project-name'
                        label='Project Name'
                        variant='outlined'
                        value={project.name}
                        size='small'
                    />
                    <TextField
                        id='project-base-path'
                        label='Project Folder'
                        variant='outlined'
                        value={project.basePath}
                        size='small'
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position='end'>
                                    <Tooltip title='Browse for folder'>
                                        <IconButton edge='end' color='default' onClick={handleBrowseForProjectFolder}>
                                            <FolderOpen />
                                        </IconButton>
                                    </Tooltip>
                                </InputAdornment>
                            )
                        }}
                    />
                    <TextField
                        id='project-export-path'
                        label='Export Folder'
                        variant='outlined'
                        value={project.exportPath}
                        size='small'
                        error={pathError !== null}
                        helperText={pathError}
                        onChange={handleExportFolderTextChange}
                    />
                    <Tooltip title='Full path to export folder' enterDelay={1000}>
                        <Typography variant='subtitle2' fontSize={8}>{exportFullPath}</Typography>
                    </Tooltip>
                    <ButtonGroup fullWidth={true}>
                        <Tooltip title='Export the selected images to the export folder'>
                            <Button variant='contained' color="secondary">Export</Button>
                        </Tooltip>
                        <Tooltip title='Save changes to project'>
                            <Button variant='contained'>Save</Button>
                        </Tooltip>
                    </ButtonGroup>
                </Stack>
            </Paper>
        </>
    )
};