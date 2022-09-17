import { Avatar, Divider, List, ListItem, ListItemAvatar, ListItemText, Paper, Switch, useTheme } from "@mui/material";


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
                {project.name}
            </Paper>
        </>
    )
};