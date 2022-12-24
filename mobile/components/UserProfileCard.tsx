import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import colors from "../theme/colors";
import user_services from "../services/user_serv";
import { useTheme } from "./../hooks/colorSchemeSingleton";


const UserProfileCard = ({id, username}) => {
  const {theme} = useTheme();
  useEffect(
    () =>
    {
      user_services.get_user(id).then((value) => {});
      
    }
  )


  const navigation = useNavigation();
  return (
    <TouchableOpacity onPress={() => {
      navigation.navigate('OtherUserProfileScreen',{
        props: {id:id}
      })
    }}
      style={[
        styles.container,
        {
          width:  185 ,
          marginHorizontal:  10
        }
      ]}
      
    >
      <View style={styles.topContainer}>
        <Image
          source={{ uri: 'http://10.50.116.36:3001/public/users/' +id + "_banner.png" }}
          style={[
            styles.coverImage,
            {
              width:  185 
            }
          ]}
          resizeMode="cover"
        />
      </View>
      <Image
        source={{ uri: 'http://10.50.116.36:3001/public/users/' +id + "_avatar.png" }}
        style={[
          styles.avatar,
          { top:  75, left:  70  }
        ]}
      />
      <View style={styles.bottomContainer}>
        <View style={styles.usernameDetails}>
          <Text style={[styles.title,{color: theme.text}]}>{username}</Text>
          
        </View>
        <Text style={styles.username}>{}</Text>
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    height: 200,
    marginBottom: 20,
    shadowColor: colors.medium,
    shadowOffset: {
      width: 0,
      height: 10
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.41,
    elevation: 3,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20
  },
  topContainer: {
    flex: 1
  },
  coverImage: {
    height: 100,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },
  avatar: {
    position: "absolute",
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: colors.white,
    top: 75,
    left: 70
  },
  bottomContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  usernameDetails: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center"
  },
  title: {
    fontSize: 15,
    marginBottom: 5,
    fontWeight: "bold",
    marginLeft: 10,
    marginRight: 10
  },
  icon: {
    marginLeft: 5
  },
  username: {
    color: colors.primary
  }
});
export default UserProfileCard;
