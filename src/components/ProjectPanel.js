import { Divider, Paper } from "@mui/material";


export default function ProjectPanel({ project }) {
    
    return (
        <>
            <Paper elevation={2} sx={{
                flexGrow: 1,
                margin: '10px',
                maxHeight: '100%',
                overflow: 'auto',
            }}>
                Contents <br/>
                Contents <br/>
                Contents <br/>
                Contents <br/>
                Contents <br/>
                Contents <br/>
                Contents <br/>
                Contents <br/>
                Contents <br/>
                Contents <br/>
                Contents <br/>
                Contents <br/>
                Contents <br/>
                Contents <br/>
                Contents <br/>
                Contents <br/>
                Contents <br/>
                Contents <br/>
                Contents <br/>
                Contents <br/>
                Contents <br/>
                Contents <br/>
                Contents <br/>
                Contents <br/>
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