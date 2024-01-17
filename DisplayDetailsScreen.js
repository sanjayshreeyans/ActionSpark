import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ImageBackground } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { Card, Button } from "react-native-elements";
import { v4 as uuidv4 } from "uuid";

const DisplayDetailsScreen = () => {
  const db = getFirestore();
  const navigation = useNavigation();
  const route = useRoute();
  const { result, formattedDate } = route.params || {};
  const uidFromRoute = result.UID;

  const [description, setDescription] = useState("");
  const [durationStart, setDurationStart] = useState("");
  const [durationEnd, setDurationEnd] = useState("");
  const [volunteerType, setVolunteerType] = useState("");
  const [skillsRequired, setSkillsRequired] = useState("");
  const [ageGroup, setAgeGroup] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(
        collection(db, "/Users", uidFromRoute, "Postings"),
      );

      querySnapshot.forEach((doc) => {
        if (doc.id === result.objectID) {
          setDescription(doc.data().Description);
          console.log(doc.data().DurationStart);
          console.log(doc.data().DurationEnd);
          const dateObject = new Date(doc.data().DurationStart.seconds * 1000);
          const dateObject2 = new Date(doc.data().DurationEnd.seconds * 1000);
          const formattedDate = dateObject.toLocaleDateString();
          const formattedDate2 = dateObject2.toLocaleDateString();

          setDurationStart(formattedDate);
          setDurationEnd(formattedDate2);
          setVolunteerType(doc.data().VolunteerType);
          setSkillsRequired(doc.data().SkillsRequired);
          setAgeGroup(doc.data().AgeGroup);
        }
      });
    };

    fetchData();
  }, []);

  return (
    <ImageBackground
      source={require("./homeScreenBackground.png")}
      style={styles.container}
    >
      <Card containerStyle={styles.cardContainer}>
        <Card.Title style={styles.title}>{result.Title}</Card.Title>
        <Card.Divider />
        <Image source={{ uri: result.image }} style={styles.image} />
        <Text style={styles.label}>Description:</Text>
        <Text style={styles.description}>{description}</Text>
        <Text style={styles.label}>Event Location:</Text>
        <Text style={styles.info}>{result.Location}</Text>

        {/* Display additional details */}
        <Text style={styles.label}>Duration Start:</Text>
        <Text style={styles.info}>{durationStart}</Text>
        <Text style={styles.label}>Duration End:</Text>
        <Text style={styles.info}>{durationEnd}</Text>
        <Text style={styles.label}>Volunteer Type:</Text>
        <Text style={styles.info}>{volunteerType}</Text>
        <Text style={styles.label}>Skills Required:</Text>
        <Text style={styles.info}>{skillsRequired}</Text>
        <Text style={styles.label}>Age Group:</Text>
        <Text style={styles.info}>{ageGroup}</Text>

        <Button
          title="Join Group Chat"
          buttonStyle={styles.joinButton}
          onPress={() =>
            navigation.navigate("GroupChat", {
              groupId: result.objectID,
            })
          }
        />
      </Card>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fafafa",
  },
  cardContainer: {
    width: "80%",
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
    borderRadius: 10,
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
    marginTop: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 8,
    color: "#555",
  },
  info: {
    fontSize: 16,
    color: "#555",
  },
  joinButton: {
    backgroundColor: "#4CAF50",
    marginTop: 16,
  },
});

export default DisplayDetailsScreen;
