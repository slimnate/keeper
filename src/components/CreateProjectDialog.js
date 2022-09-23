import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useState } from "react";
import ProjectInfo from "./ProjectInfo";

const projectScaffold = {
    name: '',
    basePath: '',
    exportPath: 'keepers',
};

export default function CreateProjectDialog({ show, setShowCreateDialog, onCreateProject }) {
    const [project, setProject] = useState(projectScaffold);

    const handleAction = action => (e) => {
        if (action === 'close') {
            setShowCreateDialog(false);
        } else if (action === 'cancel') {
            //reset project skeleton if cancelled
            setProject(projectScaffold);
            setShowCreateDialog(false);
        } else if (action === 'create') {
            onCreateProject(project);
            setShowCreateDialog(false);
        }
    }

    const handleUpdateProject = (newProject) => {
        setProject(newProject);
    }

    return (
        <Dialog
            open={show}
            onClose={handleAction('close')}
        >
            <DialogTitle>
                Create new project
            </DialogTitle>
            <DialogContent>
                <ProjectInfo project={project} onUpdateProject={handleUpdateProject} pathEditable={true} width='400px'/>
            </DialogContent>
            <DialogActions>
                <Button variant='contained' onClick={handleAction('cancel')}>Cancel</Button>
                <Button variant='contained' onClick={handleAction('create')}>Create Project</Button>
            </DialogActions>
        </Dialog>
    )
}