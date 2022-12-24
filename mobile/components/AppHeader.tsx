
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Constants from "expo-constants";
import colors from "../theme/colors";
const AppHeader = ({ title }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};
export default AppHeader;
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: Constants.statusBarHeight
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    letterSpacing: 1
  }
});
