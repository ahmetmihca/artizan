import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import NonScrollableSection from "../components/NonScrollableSection";
import SocialNetwork from "../components/SocialNetwork";
import colors from "../theme/colors";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "./../hooks/colorSchemeSingleton";

const socialNetworks = [
  {
    name: "Twitter",
    icon: "twitter",
    color: colors.primary
  },
  {
    name: "Instagram",
    icon: "instagram",
    color: colors.purple
  },
  {
    name: "Discord",
    icon: "discord",
    color: colors.cyan
  },
  {
    name: "Reddit",
    icon: "reddit",
    color: colors.orange
  },
  {
    name: "YouTube",
    icon: "youtube",
    color: colors.red
  }
];
const More = () => {

  const navigation = useNavigation();
  const {theme} = useTheme();
  return (
    <ScrollView contentContainerStyle={{backgroundColor: theme.backgroundPrimary}}>
      <View>
        <TouchableOpacity style={[styles.link]}>
          <Text style={[styles.title, {color: theme.text}]}>About</Text>
          <MaterialCommunityIcons
            name="chevron-right"
            size={30}
            color={colors.grey}
          />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.link]}>
          <Text style={[styles.title, {color: theme.text}]}>Blog</Text>
          <MaterialCommunityIcons
            name="chevron-right"
            size={30}
            color={colors.grey}
          />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.link]} onPress={() =>{navigation.navigate('SettingsScreen')}}>
          <Text style={[styles.title, {color: theme.text}]}>Settings</Text>
          <MaterialCommunityIcons
            name="chevron-right"
            size={30}
            color={colors.grey}
          />
        </TouchableOpacity>
      </View>
      <Text style={[styles.sectionTitle,{color: theme.text}]}>Follow us</Text>
      <NonScrollableSection
        data={socialNetworks}
        DataComponent={SocialNetwork}
      />
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  
  link: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderBottomWidth: 0.3,
    borderBottomColor: colors.light,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  sectionTitle: {
    marginTop: 20,
    marginLeft: 20,
    fontWeight: "bold",
    fontSize: 15,
  }
});
export default More;
