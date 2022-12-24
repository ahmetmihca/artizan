import React from "react";
import { View, ScrollView, FlatList, StyleSheet, Text } from "react-native";
import { useTheme } from "./../hooks/colorSchemeSingleton";

const Section = ({
  title,
  DataComponent,
  data,
  containerStyle,
  titleStyle,
  flatlist
}:{title: string, DataComponent: any, data: any, containerStyle: any, titleStyle:any, flatlist: any}) => {
  const {theme} = useTheme();
  return (
    <View style={[styles.container, containerStyle, {borderColor: theme.borderColor}]}>
      {title && <Text style={[styles.sectionTitle, titleStyle]}>{title}</Text>}
      {flatlist ? (
        <FlatList
          data={data}
          renderItem={({ item }) => <DataComponent {...item} />}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
        />
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {data.map((item:any, index:number) => (
            <DataComponent key={index} {...item} scrollable />
          ))}
        </ScrollView>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 15
  },
  sectionTitle: {
    marginBottom: 20,
    marginLeft: 10,
    fontWeight: "bold",
    fontSize: 25,
    letterSpacing: 1
  }
});
export default Section;
