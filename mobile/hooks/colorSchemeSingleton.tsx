import React,{ useState,createContext, useContext, useEffect } from 'react';
import Colors from '../constants/Colors';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

declare global {
  var currentMode: any;
}
const initDarkMode = Appearance.getColorScheme() === "dark" ? Colors.dark : Colors.light;
currentMode = initDarkMode;
theme = currentMode;

let globalSetMode = () => { throw new Error(`you must useDarkMode before setting its state`); };


export const ThemeContext = createContext<any>();

const ThemeProvider = ({children}: {children: any}) =>{
    const [theme, setTheme] = useState(Colors.dark);
    const [isLoadingTheme, setIsLoadingTheme] = useState(true);
    const findOldTheme = async () => {
        const mode = await AsyncStorage.getItem("themeMode");
        if(mode == null)
        {
            setTheme(Appearance.getColorScheme() === "dark" ? Colors.dark : Colors.light);
        }
        else
        {
            setTheme(mode === "dark" ? Colors.dark : Colors.light);
            
        }
        setIsLoadingTheme(false);
    }
    useEffect(() => {
        findOldTheme();

    },[])
    const updateTheme = async (currentThemeMode) => {
        const newTheme = currentThemeMode === "dark" ? Colors.light: Colors.dark;
        setTheme(newTheme);
        await AsyncStorage.setItem("themeMode", currentThemeMode === "dark" ? "light": "dark");
    }
    const syncronizeDevice = async () => {
        const myColorScheme = Appearance.getColorScheme();
        setTheme(myColorScheme === "dark" ? Colors.dark: Colors.light);
        await AsyncStorage.removeItem("themeMode");
    }
    return <ThemeContext.Provider value={{theme:theme, isLoadingTheme:isLoadingTheme, updateTheme:updateTheme, syncronizeDevice: syncronizeDevice}}>
        {children}
    </ThemeContext.Provider>
};

export const useTheme = () => useContext(ThemeContext);
export default ThemeProvider;