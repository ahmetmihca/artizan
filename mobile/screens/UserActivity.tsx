import React from "react";
import { StyleSheet, ScrollView } from "react-native";
import Stat from "../components/Stat";
import colors from "../theme/colors";
import "../hooks/colorSchemeSingleton";

const UserActivity = () => {
  return (
    <ScrollView style={styles.container}>
      <Stat
        order={1}
        type="activity"
        image={
          "https://picsum.photos/200?random=" +
          Math.floor(Math.random() * 9 + 1)
        }
        username="CLONE X - X TAKASHI MURAKAMI"
        price={35977.13}
      />
      <Stat
        order={2}
        type="activity"
        image={
          "https://picsum.photos/200?random=" +
          Math.floor(Math.random() * 9 + 1)
        }
        username="RTFKT - CloneX Mintvial"
        price={13376.71}
      />
      <Stat
        order={3}
        type="activity"
        image={
          "https://picsum.photos/200?random=" +
          Math.floor(Math.random() * 9 + 1)
        }
        username="NeoTokyo Outer Identities"
        price={7580.63}
      />
      <Stat
        order={4}
        type="activity"
        image={
          "https://picsum.photos/200?random=" +
          Math.floor(Math.random() * 9 + 1)
        }
        username="CryptoPunks"
        price={7527.96}
      />
    </ScrollView>
  );
};
export default UserActivity;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white
  }
});
