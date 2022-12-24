import LoadingScreen from './screens/LoadingScreen';
import './hooks/colorSchemeSingleton';
import  ThemeProvider from './hooks/colorSchemeSingleton';
import ThemeWrapper from "./screens/ThemeWrapper";
export default function App() {
  
  
  return (

    <ThemeProvider>
      <ThemeWrapper>
        <LoadingScreen></LoadingScreen>

      </ThemeWrapper>
    </ThemeProvider>
  );

}
