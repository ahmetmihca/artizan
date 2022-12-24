import React from "react";
import { View, Text, StyleSheet } from "react-native";
import "../hooks/colorSchemeSingleton";

const NonScrollableSection = ({ DataComponent, data, title, titleStyle }) => {
  return (
    <>
      {title && <Text style={[styles.sectionTitle, titleStyle]}>{title}</Text>}
      <View style={styles.container}>
        {data.map((item, index) => <DataComponent key={index} {...item} />)}
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginTop: 20
  },
  sectionTitle: {
    marginBottom: 20,
    marginLeft: 10,
    fontWeight: "bold",
    fontSize: 25,
    letterSpacing: 1
  }
});
export default NonScrollableSection;
