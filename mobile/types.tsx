/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
    interface ProfileParamList extends ProfileStackParamList {}
  }
}

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  CreateCollectionScreen: NavigatorScreenParams<RootTabParamList> | undefined;
  OtherUserProfileScreen: NavigatorScreenParams<RootTabParamList> | undefined;
  CreateArtScreen: NavigatorScreenParams<RootTabParamList> | undefined;
  ArtworkScreen: NavigatorScreenParams<RootTabParamList> | undefined;
  CategoryScreen: NavigatorScreenParams<RootTabParamList> | undefined;
  SettingsScreen: NavigatorScreenParams<RootTabParamList> | undefined;
  Modal: undefined;
  NotFound: undefined;
  CollectionScreen: NavigatorScreenParams<RootTabParamList> | undefined;
};

export type ProfileStackParamList = {
  Profile: NavigatorScreenParams<ProfileTabParamList> | undefined;
  Modal: undefined;
  NotFound: undefined;
};

export type ArtworkStackParamList = {
  Artwork: NavigatorScreenParams<ArtworkTabParamList> | undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  Screen
>;

export type ProfileStackScreenProps<Screen extends keyof ProfileStackParamList> = NativeStackScreenProps<
  ProfileStackParamList,
  Screen
>;
export type ArtworkStackScreenProps<Screen extends keyof ArtworkStackParamList> = NativeStackScreenProps<
  ArtworkStackParamList,
  Screen
>;

export type RootTabParamList = {
  ScreenPrototype: undefined;
  OtherUserProfileScreen: undefined;
  HomeScreen: undefined;
  SearchScreen: undefined;
  ProfileScreen: undefined;
  MoreScreen: undefined;
  CreateArtScreen: undefined;
  ArtworkScreen: undefined;
  CreateCollectionScreen: undefined;
  CollectionScreen: undefined;
  CategoryScreen: undefined;
  SettingsScreen: undefined;

  
};

export type ProfileTabParamList = {
  Profile: undefined;
};
export type ArtworkTabParamList = {
  Details: undefined;
  Offers: undefined;
  Listings: undefined;
  ItemActivity: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, Screen>,
  NativeStackScreenProps<RootStackParamList>
>;

export type ProfileTabScreenProps<Screen extends keyof ProfileTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<ProfileTabParamList, Screen>,
  NativeStackScreenProps<RootStackParamList>
>;

  
export type ArtworkTabScreenProps<Screen extends keyof ArtworkTabParamList> = NativeStackScreenProps<ArtworkStackParamList>;
