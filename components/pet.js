import Animated, {
  useSharedValue,
  withClamp,
  withDelay,
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
// import petMood from "./petMood";

export default function thePet() {
  const offsetY = useSharedValue(0);
  const offsetX = useSharedValue(0);
  const petHeight = useSharedValue(100);
  const rotation = useSharedValue(0);
  const verticalTransform = 70;
  const verticalSquish = 100;
  const durationTime = 250;
  const ANGLE = 10;
  const TIME = 100;

  const [petState, setPetState] = useState(null);
  const [petMood, setPetMood] = useState(10);
  const [petEyes, setPetEyes] = useState("O O");

  const style = useAnimatedStyle(() => ({
    transform: [
      {
        translateY:
          (offsetY.value, withClamp({ max: 0 }, withSpring(offsetY.value))),
      },
      {
        translateX: (offsetX.value, { max: 0 }, withSpring(offsetX.value)),
      },
      {
        rotateZ: `${rotation.value}deg`,
      },
    ],
    height: withSpring(petHeight.value),
  }));

  // Functions

  /**
   * Happy bounce animation for pet, may incorporate sound.
   */
  const happyBounce = () => {
    offsetY.value = withSequence(
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

  /**
   * Sad head shake animation
   */

  const sadShake = async () => {
    withSequence(
      setPetEyes("_ _"),
      (rotation.value = withSequence(
        // deviate left to start from -ANGLE
        withTiming(-ANGLE, {
          duration: durationTime / 2,
          easing: Easing.elastic(1.5),
        }),
        // wobble between -ANGLE and ANGLE 7 times
        withRepeat(
          withTiming(ANGLE, {
            duration: durationTime,
            easing: Easing.elastic(1.5),
          }),
          7,
          true
        ),
        // go back to 0 at the end
        withTiming(0, {
          duration: durationTime / 2,
          easing: Easing.elastic(1.5),
        })
      ))
    );
  };

  /**
   * Function to increase pet's mood counter
   */
  const moodUp = () => {
    if (petMood < 10) {
      setPetMood((f) => f + 1);
    }
    console.log(petMood);
  };

  /**
   * Function to decrease pet mood
   */
  const moodDown = () => {
    if (petMood > 0) {
      setPetMood((f) => f - 1);
    }
    console.log(petMood);
  };

  // Triggers

  useEffect(() => {
    if (4 < petMood < 7) {
      setPetState(PetStyles.petContent);
    }

    if (petMood < 4) {
      setPetState(PetStyles.petSad);
    }

    if (petMood >= 7) {
      setPetState(PetStyles.petHappy);
    }
  }, [petMood]);

  return (
    <View>
      <View style={PetStyles.petBox}>
        <Animated.View style={[PetStyles.petBody, style, petState]}>
          <Text style={PetStyles.petEyes}>{petEyes}</Text>
        </Animated.View>
      </View>
      <Button title="bounce" onPress={happyBounce} />
      <Button title="Sad Shake" onPress={sadShake} />
      <Button title="Increase Mood" onPress={moodUp} />
      <Button title="Decrease Mood" onPress={moodDown} />
    </View>
  );
}
