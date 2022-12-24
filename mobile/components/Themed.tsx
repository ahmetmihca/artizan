/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import { ScrollViewProps as DefaultScrollView, Text as DefaultText, View as DefaultView } from 'react-native';

import Colors from '../constants/Colors';
import { useTheme } from '../hooks/colorSchemeSingleton';
import useColorScheme from '../hooks/useColorScheme';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme();
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText['props'];
export type ViewProps = ThemeProps & DefaultView['props'];

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const {theme} = useTheme();
  return <DefaultText style={[{ color: theme.text }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const {theme} = useTheme();
  const { style, lightColor, darkColor, ...otherProps } = props;

  return <DefaultView style={[{ backgroundColor: theme.backgroundPrimary }, style]} {...otherProps} />;
}




