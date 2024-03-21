import { StyleSheet } from "react-native";

const petStyles = StyleSheet.create({
  petBody: {
    width: 100,
    height: 100,
    margin: 50,
    borderRadius: 45,
    // backgroundColor: "#b58df1",
    justifyContent: "center",
  },
  petBox: {
    height: 200,
    width: 200,
  },
  petEyes: {
    fontSize: 18,
    textAlign: "center",
  },
  petHappy: {
    backgroundColor: "yellow",
  },
  petSad: {
    backgroundColor: "blue",
  },
  petContent: {
    backgroundColor: "orange",
  },
});

export default petStyles;
