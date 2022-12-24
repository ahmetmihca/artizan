import React from "react";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../theme/colors";
import "../hooks/colorSchemeSingleton";

const SocialNetwork = ({ name, icon, color }) => {
  return (
    <TouchableOpacity
      style={[
        styles.socialNetwork,
        {
          backgroundColor: color
        }
      ]}
    >
      <View style={styles.content}>
        <MaterialCommunityIcons name={icon} size={30} color={colors.white} />
        <Text style={styles.name}>{name}</Text>
      </View>
    </TouchableOpacity>
  );
};
export default SocialNetwork;
const styles = StyleSheet.create({
  socialNetwork: {
    width: "47%",
    height: 200,
    marginBottom: 20,
    borderRadius: 20
  },
  name: {
    fontWeight: "bold",
    color: colors.white,
    fontSize: 18,
    letterSpacing: 1,
    marginTop: 5
  },
  content: {
    marginLeft: 20,
    marginTop: 120
  }
});
