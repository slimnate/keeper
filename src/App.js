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
import { Backdrop, Button, CircularProgress, createTheme, ThemeProvider, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { useWatchProgress } from './lib/hooks';
import { rollingIncrement } from './lib/helpers';
import { useKey } from 'react-use';
import { themeOptions } from './lib/theme';

function App() {
  const theme = createTheme(themeOptions);
  // const [project, setProject] = useState(window.testProject);
  const [project, setProject] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shouldScroll, setShouldScroll] = useState(false);
  const progress = useWatchProgress(loading);

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

  const handleRotateSelectedImage = (decrement = false) => {
    const newSelectedImage = rollingIncrement(selectedImage, 0, project.images.length - 1, decrement);
    setSelectedImage(newSelectedImage);
    setShouldScroll(true);
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
      setLoading(true);
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
      })
    }).finally(() => {
      setLoading(false);
    });
  }

  const handleClearProject = () => {
    setProject(null);
  }

  const handleCreateProject = (newProject) => {
    console.log({ msg: 'creating project', newProject });
    setLoading(true);
    window.api.fs.createProject(newProject).then(({err, project}) => {
      console.log(project);
      if(err) {
        console.log(err);
        toast(`Error creating project: ${err}`);
        return;
      }
      console.log({ msg: 'created project', project });
      setProject(project);
      setLoading(false);
    })
  }

  const handleExportProject = () => {
    setLoading(true);
    window.api.fs.exportProject(project).then(({err, result}) => {
      if(err) {
        toast.error(`Error exporting project: ${err}`);
        return;
      }
      setLoading(false);
      toast.success(`Exported ${result.imageCount} images to ${project.exportPath}`);
    })
  }
  
  
  const handleCurrentImageAction = (action) => () => {
    const image = project.images[selectedImage];

    console.log({action, image});

    if(action === 'keep') {
        // update image to keep
        handleUpdateImage({
            ...image,
            keep: true,
        });
    } else if (action === 'discard') {
        // update image to discard
        handleUpdateImage({
            ...image,
            keep: false,
        });
    }
    handleRotateSelectedImage();
}

  useKey('ArrowRight', (event) => handleRotateSelectedImage(), {}, [project, selectedImage])
  useKey('ArrowLeft', (event) => handleRotateSelectedImage(true), {}, [project, selectedImage])
  useKey('ArrowUp', (event) => handleCurrentImageAction('keep'), {}, [project, selectedImage])
  useKey('ArrowDown', (event) => handleCurrentImageAction('discard'), {}, [project, selectedImage])

  // computed components
  const drawerContent = project === null
    ? <NoProjectPrompt
        onOpenProject={handleOpenProject}
        setShowCreateDialog={setShowCreateDialog}
      />
    : <ProjectPanel
        project={project}
        selectedImage={selectedImage}
        shouldScroll={shouldScroll}
        setShouldScroll={setShouldScroll}
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
        onImageAction={handleCurrentImageAction}
      />
  
  const actionButtons = <>
    <Button variant='outlined' color='inherit' onClick={handleOpenProject}>Open Project</Button>
    <Button variant='contained' color='error' onClick={handleClearProject}>Close Project</Button>
  </>

  // render
  return (
    <>
      <ThemeProvider theme={theme}>
        <Layout
          drawer={drawerContent}
          main={mainContent}
          actionButtons={actionButtons}
        >
        </Layout>
        <Backdrop open={loading} sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1
          }}>
            <Stack display='flex' alignItems='center'>
              <CircularProgress color='inherit' />
              {progress && (
                <>
                  <Typography variant='overline' fontSize={18}>
                    {progress.message ? progress.message : 'Processing...'}
                  </Typography>
                  <Typography variant='overline' fontSize={18}>
                    {progress.current} of {progress.total}
                  </Typography>
                </>
              )}
              {!progress && (
                <Typography variant='overline' fontSize={18}>
                  Loading...
                </Typography>
              )}
            </Stack>
        </Backdrop>
      </ThemeProvider>
      <ToastContainer
        position='top-center'
      />
      <CreateProjectDialog
        show={showCreateDialog}
        setShowCreateDialog={setShowCreateDialog}
        onCreateProject={handleCreateProject}
      />
    </>
  );
}

export default App;
