/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import { LinkingOptions } from '@react-navigation/native';
import * as Linking from 'expo-linking';

import { ProfileTabParamList } from '../types';

const profileLinking: LinkingOptions<ProfileTabParamList> = {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      
      
      
      
    },
    
  },
};

export default profileLinking;
