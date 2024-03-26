import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import PetStyles from "../stylesheets/petStyles";

export default function petMood() {
  // moods: Happy, Sad, Angry, Content
  const [mood, setMood] = useState(10);
  const [petState, setPetState] = useState(null);

  // const randomFace = (numFaces) => {
  //     return Math.floor(Math.random() * numFaces)
  // }

  useEffect(() => {
    setTimeout(() => tick(), 5000);
  }, [mood]);

  const tick = () => {
    if (mood > 0) {
      setMood((f) => f - 1);
    }
  };

  const upMood = () => {
    if (mood < 4) {
      setMood((f) => f + 1);
    }
  };

  const downMood = () => {
    if (mood < 4) {
      setMood((f) => f - 1);
    }
  };

  useEffect(
    (mood) => {
      if (mood > 7) {
        setPetState(PetStyles.petHappy);
      }

      if (4 < mood < 8) {
        setPetState(PetStyles.petContent);
      }

      if (mood < 4) {
        setPetState(PetStyles.petSad);
      }
    },
    petState,
    [mood]
  );

  return console.log(mood), mood;
}
