import './App.css';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { useState } from 'react';

import Layout from './components/Layout';
import NoProjectDialog from './components/NoProjectDialog'
import ImageEditor from './components/ImageEditor';
import ProjectPanel from './components/ProjectPanel';

function App() {
  // const [project, setProject] = useState(window.testProject);
  const [project, setProject] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

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

  const drawerContent = project === null
    ? <NoProjectDialog
        onUpdateProject={handleUpdateProject}
      />
    : <ProjectPanel
        project={project}
        onUpdateImage={handleUpdateImage}
        onUpdateProject={handleUpdateProject}
        onUpdateSelectedImage={handleUpdateSelectedImage}
      />;
  
  const mainContent = project === null
    ? <NoProjectDialog 
        onUpdateProject={handleUpdateProject}
      />
    : <ImageEditor
        image={project.images[selectedImage]}
      />

  return (
    <Layout
      drawer={drawerContent}
      main={mainContent}
    >
    </Layout>
  );
}

export default App;
