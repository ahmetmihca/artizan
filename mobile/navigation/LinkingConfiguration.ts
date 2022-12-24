/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import { LinkingOptions } from '@react-navigation/native';
import * as Linking from 'expo-linking';

import { RootStackParamList } from '../types';

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      Root: {
        screens: {
          HomeScreen: {
            screens: {
              HomeScreen: 'HomeScreen',
            },
          },
          StatsScreen: {
            screens: {
              StatsScreen: 'StatsScreen',
            },
          },
          SearchScreen: {
            screens: {
              SearchScreen: 'SearchScreen',
            },
          },
          ProfileScreen: {
            screens: {
              ProfileScreen: 'ProfileScreen',
            },
          },
          MoreScreen: {
            screens: {
              MoreScreen: 'MoreScreen',
            },
          },
          CreateArtScreen: {
            screens: {
              CreateArtScreen: 'CreateArtScreen',
            },
          },
          CreateCollectionScreen: {
            screens: {
              CreateCollectionScreen: 'CreateCollectionScreen',
            },
          },
          ArtworkScreen:{
            screens: {
              ArtworkScreen: 'ArtworkScreen',
            }
          },
          CollectionScreen: {
            screens: {
              CollectionScreen: 'CollectionScreen'
            }
          },
          OtherUserProfileScreen:{
            screens: {
              OtherUserProfileScreen: 'OtherUserProfileScreen'
            }
          },
          CategoryScreen:{
            screens: {
              CategoryScreen: 'CategoryScreen'
            }
          },
          SettingsScreen: {
            screens: {
              SettingsScreen: 'SettingsScreen'
            }
          }
          
        },
      },
      
      Modal: 'modal',
      NotFound: '*',
      
    },
    
  },
};

export default linking;

