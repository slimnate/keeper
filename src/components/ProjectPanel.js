import { Avatar, Button, ButtonGroup, Divider, Tooltip, List, ListItem, ListItemAvatar, ListItemText, Paper, Switch, TextField, useTheme } from "@mui/material";
import { Stack } from "@mui/system";


export default function ProjectPanel({ project, onUpdateImage }) {
    const handleToggleKeep = (id) => () => {
        const image = project.images.filter(image => image.id == id).pop();

        onUpdateImage({
            ...image,
            keep: !image.keep
        });
    };

    const imageListItems = project.images.map(({ id, path, relativePath, keep }) => {
        return <ListItem key={id} >
            <ListItemAvatar>
                <Avatar
                    alt=''
                    src={`atom://${path}`}
                />
            </ListItemAvatar>
            <ListItemText>{relativePath}</ListItemText>
            <Switch
                edge='end'
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
                <Stack direction='column' spacing={1}>
                    <TextField id='project-name' label='Project Name' variant='outlined' value={project.name} size='small'/>
                    <TextField id='project-base-path' label='Project Path' variant='outlined' value={project.basePath} size='small'/>
                    <TextField id='project-export-path' label='Export Path' variant='outlined' value={project.basePath} size='small'/>
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