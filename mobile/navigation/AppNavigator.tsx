import React from "react";
import { Pressable, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  Entypo,
  Ionicons,
  Feather,
  MaterialCommunityIcons
} from "@expo/vector-icons";
import HomeStack from "./HomeStack";
import Search from "../screens/Search";
import Profile from "./ProfileStack";
import MoreStack from "./MoreStack";
import colors from "../theme/colors";
const Tab = createBottomTabNavigator();
const AppNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerTitleAlign: "center",
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 22
        },
        tabBarStyle: {
          height: 70
        },
        tabBarItemStyle: {
          paddingTop: 20
        },
        tabBarButton: ({ accessibilityState, style, children, ...props }) => (
          <Pressable
            accessibilityState={accessibilityState}
            {...props}
            style={style}
          >
            {accessibilityState.selected && (
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  height: 8,
                  width: "50%",
                  backgroundColor: colors.primary,
                  borderBottomLeftRadius: 20,
                  borderBottomRightRadius: 20
                }}
              />
            )}
            {children}
          </Pressable>
        )
      }}
    >
      <Tab.Screen
        name="HomeStack"
        component={HomeStack}
        options={{
          headerShown: false,
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Entypo name="home" size={size} color={color} />
          )
        }}
      />
      <Tab.Screen
        name="Search"
        component={Search}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="search" size={size} color={color} />
          )
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="account-circle-outline"
              size={size}
              color={color}
            />
          )
        }}
      />
      <Tab.Screen
        name="MoreStack"
        component={MoreStack}
        options={{
          title: "More",
          tabBarIcon: ({ color, size }) => (
            <Entypo name="menu" size={size} color={color} />
          )
        }}
      />
    </Tab.Navigator>
  );
};
export default AppNavigator;
