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
import { 
  GestureHandlerRootView,
  GestureDetector,
  Gesture
} from "react-native-gesture-handler";
import { View, Button, Text } from "react-native";
import { useState, useEffect } from "react";
import * as FileSystem from "expo-file-system";
import React from "react";
import PetStyles from "../stylesheets/petStyles";
import PageStyles from "../stylesheets/pageStyles";

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
  const [defaultPetEyes, setDefaultPetEyes] = useState("O O");
  const [petHunger, setPetHunger] = useState(20);
  const [moodDecay, setMoodDecay] = useState(10000);


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
      setPetHunger(currentState.lastPetHunger);
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
    const currentState = { "lastPetMood": petMood, "lastPetHunger": petHunger };
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
          (offsetY.value, withClamp({ max: 10 }, withSpring(offsetY.value))),
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
      setPetEyes(defaultPetEyes);
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
      setPetEyes(defaultPetEyes);
    }, 3000);
    return () => clearTimeout(setNormalEyes);
  }, [sadShake]);

  /** 
   * 
   */
  const nomJiggle = () => {
    setPetEyes("*=  =*"),
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
      setPetEyes(defaultPetEyes);
    }, 3000);
    return () => clearTimeout(setNormalEyes);
  }, [nomJiggle]);


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

  /**
   * Feed pet function to boost hunger by 8, and boost mood by 5
   */
  const feedPet = () => {
    if (petHunger < 20) {
      setPetHunger((f) => f + 8);
      nomJiggle();
    }
    if (petMood < 10) {
      setPetMood((f) => f + 5);
    }
    console.log(petHunger);
  };

  /**
   * Play with pet function to boost mood by 3
   */
  const petPlay = () => {
    if (petMood < 10) {
      setPetMood((f) => f + 3);
    }
    happyBounce();
  };

  /**
   * Function to tease pet and reduce mood by 2
   */
  const teasePet = () => {
    if (petMood < 10) {
      setPetMood((f) => f - 2);
    }
    sadShake();
  };

  // Triggers

  /**
   * Hunger decay 
   */
  useEffect (() => {
    setInterval(() => hungerTick(), 10000);
    return () => clearInterval();
  },[])

  const hungerTick = () => {
    if (petHunger > 0) {
      setPetHunger((h) => h - 1);
    }
    // Janky fix to keep mood from going below zero
    if (petHunger < 0) {
      setPetHunger(0);
    }
  }

  useEffect(() => {
    switch (petHunger) {
      case 20:
      case 18:
        setMoodDecay(20000);
        break;
      case 17:
      case 16:
        setMoodDecay(18000);
        break;
      case 15:
      case 14:
      case 13:
        setMoodDecay(15000);
        break;
      case 12:
      case 11:
      case 10:
      case 9:
      case 8:
        setMoodDecay(10000);
        break;
      case 7:
      case 6:
      case 5:
        setMoodDecay(8000);
        break;
      case 4:
      case 3:
      case 2:
      case 1:
        setMoodDecay(6000);
        break;
      case 0:
        setMoodDecay(4000);
        break;
      default:
        setMoodDecay(20000);
        break;
    }
 
    console.log(moodDecay);
    
  },[petHunger]);


  /**
   * Mood decay trigger
   */

  useEffect(() => {
    setTimeout(() => moodTick(), moodDecay);
    return () => clearTimeout();
  }, [petMood]);

  const moodTick = () => {
    setTimeout(() => {if (petMood > 0) {
      setPetMood((f) => f - 1)};
    }, 1000)
    return () => clearTimeout();
  };

  /**
   * Hook to update pet colour as mood changes
   */
  useEffect(() => {
    
    if (4 < petMood < 7) {
      setPetState(PetStyles.petContent);
      setDefaultPetEyes("O O");
    }

    if (petMood < 4) {
      setPetState(PetStyles.petSad);
      setDefaultPetEyes(">  <");
    }

    if (petMood >= 7) {
      setPetState(PetStyles.petHappy);
      setDefaultPetEyes("-O O-")
    }

    // Janky fix to keep mood from going below zero
    if (petMood < 0) {
      setPetMood(0);
    }
    console.log(petMood);
  }, [petMood]);

    

  return (
    <View>
      <GestureHandlerRootView style={PageStyles.container}>
      <View style={PetStyles.petBox}>
        <Animated.View style={[PetStyles.petBody, style, petState]}>
          <Animated.Text style={PetStyles.petEyes}>{petEyes}</Animated.Text>
        </Animated.View>
      </View>
      </GestureHandlerRootView>
      <Text>Pet Mood:{petMood}, Pet Hunger:{petHunger}Mood Decay:{moodDecay} </Text>
      <Button title="Save Current Mood" onPress={saveState}/>
      <Button title="Feed Pet" onPress={feedPet} />
      <Button title="Play" onPress={petPlay} />
      <Button title="Tease" onPress={teasePet} />
    </View>
  );
}
