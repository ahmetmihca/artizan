const tintColorLight = '#2f95dc';
const tintColorDark = 'white';

export default {
  light: {
    text: '#000',
    blue: '#3282B8',
    backgroundPrimary: '#FFFCF9',
    backgroundSecondary: '#fff',
    borderColor: '#3282B8',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
    iconColorPrimary: '#BDC6CF',
    textColorNotActive: '#0E185F',
    linkColor: '#0645AD',
    themeMode: "light",
    buttons: {
      checkButton: {
        activeBackground: '#3282B8',
        passiveBackground: "#fff",
        borderColor: '#3282B8',
        textColorActive: '#fff',
        iconColorPassive: "#3282B8",
        textColorPassive: '#3282B8'
      }
    }
  },
  dark: {
    text: '#fff',
    blue: '#3282B8',
    backgroundPrimary: '#26272E',
    backgroundSecondary: '#191A1F',
    borderColor: '#323949',
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
    iconColorPrimary: '#BDC6CF',
    textColorNotActive: '#ccc',
    linkColor:'#0645AD',
    themeMode: "dark",
    buttons: {
      checkButton: {
        activeBackground: '#3282B8',
        passiveBackground: "#26272E",
        borderColor: '#3282B8',
        iconColorPassive: "#3282B8",
        textColorActive: '#000',
        textColorPassive: '#fff'
      }
    }
  },
};
