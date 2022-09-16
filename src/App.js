import './App.css';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import PersistentAppDrawer from './components/PersistentAppDrawer';
import { useState } from 'react';

const testProject = {
  name: 'Test Project',
  basePath: './',
  exportPath: './keepers',
  projectFile: './Test Project.keep',
  images: [
    {
      path: '/image-1.png',
      keep: false,
    },
    {
      path: '/image-2.png',
      keep: false,
    },
    {
      path: '/image-3.png',
      keep: false,
    },
  ],
}

function App() {
  const project = useState(testProject);

  return (
    <PersistentAppDrawer project={project}>
      
    </PersistentAppDrawer>
  );
}

export default App;
