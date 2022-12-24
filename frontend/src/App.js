import Navbar from './components/navbar';
import MainRouter from './config/router'
import {
  BrowserRouter,
} from "react-router-dom";
import './app.css'

function App() {  
  return (
    <div>
      <BrowserRouter>

        <Navbar style={{zIndex:100}} />

        <MainRouter />
      </BrowserRouter>
    </div>    
  );
}

export default App;
