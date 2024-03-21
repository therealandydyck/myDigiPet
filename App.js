import { View, Button, StyleSheet, Text } from "react-native";
import React from "react";
import PageStyles from "./stylesheets/pageStyles";
import ThePet from "./components/pet";

export default function App() {
  return (
    <View style={PageStyles.container}>
      <ThePet />
    </View>
  );
}
