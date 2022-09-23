import './App.css';
import 'react-toastify/dist/ReactToastify.css'

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';

import Layout from './components/Layout';
import NoProjectPrompt from './components/NoProjectPrompt'
import ImageEditor from './components/ImageEditor';
import ProjectPanel from './components/ProjectPanel';
import CreateProjectDialog from './components/CreateProjectDialog';
import { Button } from '@mui/material';

function App() {
  // const [project, setProject] = useState(window.testProject);
  const [project, setProject] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const handleUpdateImage = (newImage) => {
    setProject({
      ...project,
      images: project.images.map((image) => image.id === newImage.id ? newImage : image)
    });
  }

  const handleUpdateProject = (newProject) => {
    setProject(newProject);
  }

  const handleUpdateSelectedImage = (id) => {
    console.log(id);
    setSelectedImage(id);
  }

  const handleRotateSelectedImage = () => {
    const imageCount = project.images.length;
    console.log({selectedImage, imageCount});
    if(selectedImage === imageCount - 1) {
      setSelectedImage(0);
    } else {
      setSelectedImage(selectedImage+1);
    }
  }

  const handleSaveProject = () => {
    // save project to disk
    window.api.fs.saveProject(project).then(result => {
      if(result.err) {
        toast.error(`Error saving project: ${result.err}`);
        return;
      }
      toast.success('Project saved!');
      setProject(result.project);
    });
  }

  const handleOpenProject = () => {
      window.api.fs.openFile().then(files => {
          if(files === undefined) return;
          const file = files[0];

          console.log(file);

          window.api.fs.openProject(file).then(({err, project}) => {
              console.log(project);
              if(err) {
                  toast(`Error opening project: ${err}`);
                  return;
              }
              setProject(project);
          });
      });
  }

  const handleClearProject = () => {
    setProject(null);
  }

  const handleCreateProject = (newProject) => {
    console.log({ msg: 'creating project', newProject });
    window.api.fs.createProject(newProject).then(({err, project}) => {
      console.log(project);
      if(err) {
        console.log(err);
        toast(`Error creating project: ${err}`);
        return;
      }
      console.log({ msg: 'created project', project });
      setProject(project);
    })
  }

  const handleExportProject = () => {
    window.api.fs.exportProject(project).then(({err, result}) => {
      if(err) {
        toast.error(`Error exporting project: ${err}`);
        return;
      }
      toast.success(`Exported ${result.imageCount} images to ${project.exportPath}`);
    })
  }

  const drawerContent = project === null
    ? <NoProjectPrompt
        onOpenProject={handleOpenProject}
        setShowCreateDialog={setShowCreateDialog}
      />
    : <ProjectPanel
        project={project}
        selectedImage={selectedImage}
        onUpdateImage={handleUpdateImage}
        onUpdateProject={handleUpdateProject}
        onUpdateSelectedImage={handleUpdateSelectedImage}
        onSaveProject={handleSaveProject}
        onExportProject={handleExportProject}
      />;
  
  const mainContent = project === null
    ? <NoProjectPrompt
        onOpenProject={handleOpenProject}
        setShowCreateDialog={setShowCreateDialog}
      />
    : <ImageEditor
        image={project.images[selectedImage]}
        onUpdateImage={handleUpdateImage}
        onRotateSelectedImage={handleRotateSelectedImage}
      />
  
  const actionButtons = <>
    <Button variant='outlined' color='inherit' onClick={handleOpenProject}>Open Project</Button>
    <Button variant='contained' color='warning' onClick={handleClearProject}>Close Project</Button>
  </>

  return (
    <>
      <ToastContainer
        position='top-center'
      />
      <Layout
        drawer={drawerContent}
        main={mainContent}
        actionButtons={actionButtons}
      >
      </Layout>
      <CreateProjectDialog
        show={showCreateDialog}
        setShowCreateDialog={setShowCreateDialog}
        onCreateProject={handleCreateProject}
      />
    </>
  );
}

export default App;
