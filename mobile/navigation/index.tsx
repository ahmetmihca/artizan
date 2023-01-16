/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { FontAwesome } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ColorSchemeName, Pressable } from 'react-native';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import ModalScreen from '../screens/ModalScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
import HomeScreen from '../screens/HomeScreen';
import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types';
import CreateArtScreen from '../screens/CreateArtScreen';
import CreateCollectionScreen from '../screens/CreateCollectionScreen';
import ArtworkScreen from '../screens/ArtworkScreen';
import OtherUserProfileScreen from '../screens/profile/OtherUserProfile';
import LinkingConfiguration from './LinkingConfiguration';
import SearchScreen from '../screens/SearchScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import MoreScreen from '../screens/MoreScreen';
import CollectionScreen from '../screens/CollectionScreen';
import CategoryScreen from '../screens/CategoryScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { useTheme } from '../hooks/colorSchemeSingleton';

export default function Navigation({ colorScheme }: { colorScheme: any }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={{dark: false,colors:{primary: colorScheme.backgroundPrimary,background: colorScheme.backgroundSecondary,card: colorScheme.backgroundSecondary,text: colorScheme.text,border: colorScheme.borderColor, notification: colorScheme.borderColor}}}>
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name='CreateArtScreen' component={CreateArtScreen} options={{headerShown: false}}></Stack.Screen>
      <Stack.Screen name='ArtworkScreen' component={ArtworkScreen} options={{headerShown: false}}></Stack.Screen>
      <Stack.Screen name='CollectionScreen' component={CollectionScreen} options={{headerShown: false}}></Stack.Screen>
      <Stack.Screen name='SettingsScreen' component={SettingsScreen} options={{headerShown: false}}></Stack.Screen>
      <Stack.Screen name='CreateCollectionScreen' component={CreateCollectionScreen} options={{headerShown: false}}></Stack.Screen>
      <Stack.Screen name='OtherUserProfileScreen' component={OtherUserProfileScreen} options={{headerShown: false}}></Stack.Screen>
      <Stack.Screen name='CategoryScreen' component={CategoryScreen} options={{headerShown: false}}></Stack.Screen>
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="Modal" component={ModalScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  const {theme} = useTheme();

  return (
    <BottomTab.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{
        tabBarActiveTintColor: theme.blue,
        tabBarInactiveBackgroundColor: theme.backgroundSecondary,
        tabBarActiveBackgroundColor: theme.backgroundSecondary,
      }}
      >

      
      <BottomTab.Screen
        name="HomeScreen"
        
        component={HomeScreen}
        options={({ navigation }: RootTabScreenProps<'HomeScreen'>) => ({
          title: 'Artizan',
          headerTitleAllowFontScaling: true,
          tabBarItemStyle:{paddingBottom: 5},

          headerTitleStyle: {fontSize: 24},
          
          headerStyle: {height: 100, backgroundColor: theme.backgroundSecondary, elevation: 8},
          headerTitleAlign:'center',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        })}
      />
      <BottomTab.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{
          headerShown:false,

          title: 'Search',
          tabBarItemStyle:{paddingBottom: 5},
          tabBarIcon: ({ color }) => <TabBarIcon name="search" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          headerShown:false,

          title: 'Profile',
          tabBarItemStyle:{paddingBottom: 5},

          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
        
      />
      <BottomTab.Screen
        name="MoreScreen"
        component={MoreScreen}
        options={{
          headerShown:false,

          title: 'More',
          tabBarItemStyle:{paddingBottom: 5},

          tabBarIcon: ({ color }) => <TabBarIcon name="th-list" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={23} style={{ marginBottom: -3 }} {...props} />;
}



