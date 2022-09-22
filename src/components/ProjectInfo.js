import { FolderOpen } from "@mui/icons-material";
import { IconButton, InputAdornment, TextField, Tooltip, Typography } from "@mui/material";
import { Stack } from "@mui/system";

import path from "path-browserify";

import { useState } from "react";

export default function ProjectInfo({project, onUpdateProject}) {
    const [pathError, setPathError] = useState(null);

    function handleBrowseForProjectFolder() {
        window.electronAPI.openFolder().then((path) => {
            if(path === undefined) return;

            onUpdateProject({
                ...project,
                basePath: path[0]
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
        });
    }

    function handleTitleTextChange(e) {
        const name = e.target.value;

        onUpdateProject({
            ...project,
            name: name
        });
    }

    const exportFullPath = path.join(project?.basePath, project?.exportPath);


    return (
        <Stack direction='column' spacing={1}>
            <TextField
                id='project-name'
                label='Project Name'
                variant='outlined'
                value={project?.name}
                size='small'
                onChange={handleTitleTextChange}
            />
            <TextField
                id='project-base-path'
                label='Project Folder'
                variant='outlined'
                value={project?.basePath}
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
                value={project?.exportPath}
                size='small'
                error={pathError !== null}
                helperText={pathError}
                onChange={handleExportFolderTextChange}
            />
            <Tooltip title='Full path to export folder' enterDelay={1000}>
                <Typography variant='subtitle2' fontSize={8}>{exportFullPath}</Typography>
            </Tooltip>
        </Stack>
    )
}