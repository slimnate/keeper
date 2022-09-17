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
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <PersistentAppDrawer project={project}>
      <ImageEditor project={ project.images[selectedImage] || null } />
    </PersistentAppDrawer>
  );
}

export default App;
