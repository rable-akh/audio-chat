import logo from './logo.svg';
import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

import {ThemeProvider} from 'react-bootstrap'
import RouterConfig from './route';

function App() {
  return (
    <ThemeProvider>
      <RouterConfig/>
    </ThemeProvider>
  );
}

export default App;
