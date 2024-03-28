import Animated, {
  useSharedValue,
  withClamp,
  withTiming,
  withSpring,
  Easing,
  useAnimatedStyle,
  withRepeat,
  withSequence,
} from "react-native-reanimated";
import { View, Button, Text } from "react-native";
import { useState, useEffect } from "react";
import * as FileSystem from "expo-file-system";
import React from "react";
import PetStyles from "../stylesheets/petStyles";

export default function thePet() {
  const offsetY = useSharedValue(0);
  const offsetX = useSharedValue(0);
  const petHeight = useSharedValue(100);
  const rotation = useSharedValue(0);
  const verticalTransform = 70;
  const verticalSquish = 100;
  const durationTime = 250;
  const shakeAngle = 10;

  const [petState, setPetState] = useState(null);
  const [petMood, setPetMood] = useState(10);
  const [petEyes, setPetEyes] = useState("O O");

  /**
   * FileSystem logic
   */
  const dataFileName = "petmoodfile.json";

  /**
   * This function will load a json string of all the saved data
   * We assume that the file is good
   * We assume that all the required object parts are present
   */
  const loadState = async () => {
    try {
      // get the string
      const currentStateString = await FileSystem.readAsStringAsync(
        FileSystem.documentDirectory + dataFileName
      );
      // convert it to an object
      currentState = JSON.parse(currentStateString);
      // extract all the saved states
      setPetMood(currentState.lastPetMood);
    } catch (e) {
      console.log(FileSystem.documentDirectory + dataFileName + e);
      // probably there wasn't a saved state, so make one for next time?
      saveState();
    }
  };

  /**
   * This function will save the data as a json string
   */
  const saveState = async () => {
    // build an object of everything we are saving
    const currentState = { "lastPetMood": petMood };
    try {
      // write the stringified object to the save file
      await FileSystem.writeAsStringAsync(
        FileSystem.documentDirectory + dataFileName,
        JSON.stringify(currentState)
      );
    } catch (e) {
      console.log(FileSystem.documentDirectory + dataFileName + e);
    }
  };

  // load on app load, save on app unload
  useEffect(() => {
    loadState();
    return () => {
      saveState;
    };
  }, []);

  /**
   * Animated styles for creating animations
   */
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
    setPetEyes("^  ^"),
      (offsetY.value = withSequence(
        withRepeat(
          withTiming(-verticalTransform, {
            duration: durationTime,
          }),
          8,
          true
        ),

        withTiming(0, { duration: durationTime / 2 })
      ));
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
  // set petEyes back to default after happyBounce finishes
  useEffect(() => {
    const setNormalEyes = setTimeout(() => {
      setPetEyes("O O");
    }, 3000);
    return () => clearTimeout(setNormalEyes);
  }, [happyBounce]);

  /**
   * Sad head shake animation
   */
  const sadShake = async () => {
    withSequence(
      setPetEyes("_  _"),

      (rotation.value = withSequence(
        // deviate left to start from -shakeAngle
        withTiming(-shakeAngle, {
          duration: durationTime / 2,
          easing: Easing.elastic(1.5),
        }),
        // wobble between -shakeAngle and shakeAngle 7 times
        withRepeat(
          withTiming(shakeAngle, {
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
  // sets petEyes back to default when sadShake is finished
  useEffect(() => {
    const setNormalEyes = setTimeout(() => {
      setPetEyes("O O");
    }, 3000);
    return () => clearTimeout(setNormalEyes);
  }, [sadShake]);

  /**
   * Function to increase pet's mood counter
   */
  const moodUp = () => {
    if (petMood < 10) {
      setPetMood((f) => f + 1);
      happyBounce();
    }
    console.log(petMood);
  };

  /**
   * Function to decrease pet mood
   */
  const moodDown = () => {
    if (petMood > 0) {
      setPetMood((f) => f - 1);
      sadShake();
    }
    console.log(petMood);
  };

  // Triggers

  /**
   * Mood decay trigger
   */
  useEffect(() => {
    setInterval(() => tick(), 10000);
    return () => clearInterval();
  }, []);

  const tick = () => {
    if (petMood > 0) {
      setPetMood((f) => f - 1);
    }
  };

  /**
   * Hook to update pet colour as mood changes
   */
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

    // Janky fix to keep mood from going below zero
    if (petMood < 0) {
      setPetMood(0);
    }
    console.log(petMood);
  }, [petMood]);

  return (
    <View>
      <View style={PetStyles.petBox}>
        <Animated.View style={[PetStyles.petBody, style, petState]}>
          <Animated.Text style={PetStyles.petEyes}>{petEyes}</Animated.Text>
        </Animated.View>
      </View>
      <Button title="Save Current Mood" onPress={saveState}/>
      <Button title="Increase Mood" onPress={moodUp} />
      <Button title="Decrease Mood" onPress={moodDown} />
    </View>
  );
}
