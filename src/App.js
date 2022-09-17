import './App.css';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import PersistentAppDrawer from './components/PersistentAppDrawer';
import { useState } from 'react';
import ImageEditor from './components/ImageEditor';

function App() {
  const [project, setProject] = useState(window.testProject);
  const [selectedImage, setSelectedImage] = useState(0);

  const handleImageUpdate = (newImage) => {
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

  return (
    <PersistentAppDrawer
      project={project}
      selectedImage={selectedImage}
      onUpdateImage={handleImageUpdate}
      onUpdateProject={handleUpdateProject}
      onUpdateSelectedImage={handleUpdateSelectedImage}
    >
      <ImageEditor projectExists={project !== null} image={project.images[selectedImage] || null} />
    </PersistentAppDrawer>
  );
}

export default App;
