import Animated, {
  useSharedValue,
  withClamp,
  withTiming,
  withSpring,
  Easing,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  ReduceMotion,
} from "react-native-reanimated";
import { View, Button, Text } from "react-native";
import { useState, useEffect } from "react";
import React from "react";
import PetStyles from "../stylesheets/petStyles";
import petMood from "./petMood";

export default function thePet() {
  const offset = useSharedValue(0);
  const petHeight = useSharedValue(100);
  // const [petState, setPetState] = useState(null);

  const style = useAnimatedStyle(() => ({
    transform: [
      {
        translateY:
          (offset.value, withClamp({ max: 0 }, withSpring(offset.value))),
      },
    ],
    height: withSpring(petHeight.value),
  }));

  const verticalTransform = 70;
  const verticalSquish = 100;
  const durationTime = 250;

  const handlePress = () => {
    offset.value = withSequence(
      withRepeat(
        withTiming(-verticalTransform, {
          duration: durationTime,
        }),
        8,
        true
      ),

      withTiming(0, { duration: durationTime / 2 })
    );
    petHeight.value = withSequence(
      withTiming(verticalSquish, { duration: durationTime }),
      withRepeat(
        withTiming(verticalSquish - 30, { duration: durationTime }),
        8,
        true
      ),
      // go back to 0 at the end
      withTiming(100, { duration: durationTime / 2 })
    );
  };

  // useEffect((petMood) => {
  //   if (petMood > 7) {
  //     setPetState(PetStyles.petHappy);
  //   }

  //   if (4 < petMood < 8) {
  //     setPetState(PetStyles.petContent);
  //   }

  //   if (petMood < 4) {
  //     setPetState(PetStyles.petSad);
  //   }
  // });

  return (
    <View>
      <View style={PetStyles.petBox}>
        <Animated.View style={[PetStyles.petBody, style, petMood.petColour]}>
          <Text style={PetStyles.petEyes}>O O</Text>
        </Animated.View>
      </View>
      <Button title="bounce" onPress={handlePress} />
    </View>
  );
}
