import React from "react";
import { View, TextInput, StyleSheet} from "react-native";
import { Feather } from "@expo/vector-icons";
import "../hooks/colorSchemeSingleton";
import { useTheme } from "./../hooks/colorSchemeSingleton";

const SearchInput = () => {
  const {theme} = useTheme();
  return (
    <View style={[styles.container,{borderColor: theme.textColorNotActive,}]}>
      <Feather name="search" size={20} color={"grey"} style={styles.icon} />
      <TextInput style={[styles.input,{color: theme.text}]} placeholderTextColor={theme.textColorNotActive} placeholder="Search items" />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    
    borderRadius: 10,
    height: 60,
    width: "90%",
    alignSelf: "center"
  },
  icon: {
    padding: 10
  },
  input: {
    height: 60,
    width: "100%",
    paddingLeft: 10,
  }
});
export default SearchInput;
