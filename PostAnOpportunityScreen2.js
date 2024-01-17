import { useNavigation, useRoute } from "@react-navigation/native";
import BingMapsReact from "bingmaps-react";
import {
  collection,
  addDoc,
  getFirestore,
  setDoc,
  doc,
} from "firebase/firestore";
import {
  getDownloadURL,
  getStorage,
  uploadString,
  ref as refS,
} from "firebase/storage";
import React, { useState, useContext } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Button, Icon } from "react-native-elements";
import { DatePickerModal } from "react-native-paper-dates";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { v4 as uuidv4 } from "uuid";

import {
  ALGOLIA_ID,
  ALGOLIA_ADMIN_KEY,
  ALGOLIA_INDEX_NAME,
  bingMapsKey,
} from "./APIKeys";
import AgeGroupPicker from "./AgeGroupPicker";
import DurationPicker from "./DurationPicker";
import { GlobalStateContext } from "./GlobalState";
import SkillsRequiredInput from "./SkillsRequiredInput";
import VolunteerPicker from "./VolunteerPicker";

// Import api keys from APIKeys.js

const PostAnOpportunityScreen2 = () => {
  const navigation = useNavigation();
  const { uid, userName } = useContext(GlobalStateContext);
  const storage = getStorage();
  const [searchQuery, setSearchQuery] = useState("");
  const [mapCenter, setMapCenter] = useState({
    latitude: 42.360081,
    longitude: -71.058884,
  });
  const route = useRoute();
  const db = getFirestore();
  const [eventDescription, setEventDescription] = useState("");
  const algoliasearch = require("algoliasearch");
  // Create a dict that contains all the input from the duration, volunteer type, skills required, and age group pickers
  const [dict, setDict] = useState({});
  const [pushPin, setPushPin] = useState({
    center: {
      latitude: 27.98785,
      longitude: 86.925026,
    },
    options: {
      title: "Mt. Everest",
    },
  });

  const [date, setDate] = useState(undefined);
  const [open, setOpen] = useState(false);

  const onDismissSingle = () => {
    setOpen(false);
  };

  const onConfirmSingle = (params) => {
    setOpen(false);
    setDate(params.date);
  };

  const handleSearch = async () => {
    // Use Bing Maps Geocoding API to get coordinates for the search query
    const apiKey = bingMapsKey;
    const apiUrl = `http://dev.virtualearth.net/REST/v1/Locations/${searchQuery}?key=${apiKey}`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      const coordinates = data.resourceSets[0]?.resources[0]?.point.coordinates;

      if (coordinates) {
        const formattedAddress =
          data.resourceSets[0].resources[0].address.formattedAddress;
        setPushPin({
          center: { latitude: coordinates[0], longitude: coordinates[1] },
          options: { title: formattedAddress },
        });
        setMapCenter({ latitude: coordinates[0], longitude: coordinates[1] });
      }

      if (data.resourceSets && data.resourceSets.length > 0) {
        // Extract formatted address from the response
        const formattedAddress =
          data.resourceSets[0].resources[0].address.formattedAddress;
        setSearchQuery(formattedAddress);
      } else {
        // No results found
        setSearchQuery("Not Found");
      }
    } catch (error) {
      console.error("Error fetching location data", error);
    }
  };

  const handleDurationChange = (startDate, endDate) => {
    // Update state or perform any action with the selected duration
    console.log("Selected Duration:", startDate, endDate);
    setDict({ ...dict, DurationStart: startDate, DurationEnd: endDate });
  };
  const handleVolunteerChange = (selectedVolunteerType) => {
    // Update state or perform any action with the selected volunteer type
    console.log("Selected Volunteer Type:", selectedVolunteerType);
    setDict({ ...dict, "Volunteer Type": selectedVolunteerType });
  };

  const handleSkillsRequiredChange = (selectedSkills) => {
    // Update state or perform any action with the selected skills
    console.log("Selected Skills:", selectedSkills);
    setDict({ ...dict, "Skills Required": selectedSkills });
  };

  const handleAgeGroupChange = (selectedAgeGroup) => {
    // Update state or perform any action with the selected age group
    console.log("Selected Age Group:", selectedAgeGroup);
    setDict({ ...dict, "Age Group": selectedAgeGroup });
  };

  const COMPLETEPOSTING = () => {
    // Verify if all the fields are filled
    if (
      eventDescription === undefined ||
      searchQuery === undefined ||
      dict["DurationStart"] === undefined ||
      dict["DurationEnd"] === undefined ||
      !("Volunteer Type" in dict) || // Check if "Volunteer Type" property exists in dict
      dict["Skills Required"] === undefined ||
      dict["Age Group"] === undefined
    ) {
      alert("Please fill in all the fields before proceeding");
      console.log(dict);
      console.log(eventDescription);
      console.log(searchQuery);
    } else {
      saveUserData();
    }
  };

  const saveUserData = async () => {
    try {
      try {
        var docRef = await addDoc(collection(db, "Users", uid, "Postings"), {
          Description: eventDescription,
          // Load the data from the previous screen
          eventTitle: route.params.titleLabel,
          eventLocation: searchQuery,
          // nOW LOAD STUFF FROM THE PICKERS
          DurationStart: dict["DurationStart"],
          DurationEnd: dict["DurationEnd"],
          VolunteerType: dict["Volunteer Type"],
          SkillsRequired: dict["Skills Required"],
          AgeGroup: dict["Age Group"],
          // End of loading from pickers
        });
      } catch (error) {
        console.error("Error adding document:", error);
      }

      try {
        const groupChatRef = collection(
          db,
          "GroupChats",
          docRef.id,
          "ChatInfo",
        );

        await setDoc(doc(groupChatRef), {
          admin: [uid],
          members: [uid],
          forPost: docRef.id,
        });

        const WelcomeMessageAdmin =
          "Welcome to the group chat! This is where you can discuss/plan the details of the event. You can also post updates here.";
        const groupChatRef2 = collection(
          db,
          "GroupChats",
          docRef.id,
          "messages",
        );
        await setDoc(doc(groupChatRef2), {
          _id: uuidv4(),
          text: WelcomeMessageAdmin,
          user: { _id: uid, name: userName },
          createdAt: new Date().getTime(),
        });
      } catch (error) {
        console.error("Error adding document:", error);
      }

      uploadString(
        refS(
          storage,
          "/" + "Users" + "/" + uid + "/" + "Postings" + "/" + docRef.id,
        ),
        route.params.image,
        "data_url",
      )
        .then((snapshot) => {
          func();
          console.log("Uploaded a blob or file!");
        })
        .catch((error) => {
          console.error("Error uploading blob or file:", error);
        });

      const func = async () => {
        const reference = refS(
          storage,
          "/" + "Users" + "/" + uid + "/" + "Postings" + "/" + docRef.id,
        );
        const dateTimeStampStart = dict["DurationStart"].getTime();
        const dateTimeStampEnd = dict["DurationEnd"].getTime();
        await getDownloadURL(reference).then((x) => {
          const client = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY);

          const index = client.initIndex(ALGOLIA_INDEX_NAME);

          const dat = {
            Title: route.params.titleLabel,
            Price: route.params.numericPrice,
            Location: searchQuery,
            UID: uid,
            _geoloc: {
              lat: parseFloat(pushPin.center.latitude),
              lng: parseFloat(pushPin.center.longitude),
            },
            DateToBeFinishedTimeStampStart: dateTimeStampStart,
            DateToBeFinishedTimeStamp: dateTimeStampEnd,
            image: x,
          };

          index.saveObject({
            objectID: docRef.id,
            ...dat,
          });
        });
        alert("User data is posted successfully saved with ID:", docRef.id);

        navigation.navigate("PostFinished");
      };
    } catch (error) {
      alert("Error saving creating a post data:", error);
    }
  };

  return (
    <View style={styles.container}>
      <DurationPicker
        date={date}
        setDate={setDate}
        onChange={handleDurationChange}
        open={open}
        setOpen={setOpen}
        onConfirm={onConfirmSingle}
        saveLabel="Save"
      />
      {date && (
        <Text style={styles.selectedDate}>
          Selected Deadline: {date.toDateString()}
        </Text>
      )}
      <VolunteerPicker onChange={handleVolunteerChange} />
      <SkillsRequiredInput onChange={handleSkillsRequiredChange} />
      <AgeGroupPicker onChange={handleAgeGroupChange} />

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Enter the event location"
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Icon name="search" color="white" size={24} />
        </TouchableOpacity>
      </View>

      {/* Bing Maps */}
      <View style={styles.mapContainer}>
        <BingMapsReact
          pushPins={[pushPin]}
          bingMapsKey={bingMapsKey}
          height="500px" // Adjusted height
          width="100%"
          viewOptions={{
            center: mapCenter,
            mapTypeId: "aerial",
          }}
        />
      </View>

      <Text style={styles.boldSubheading}>
        Enter a description for your event:
      </Text>
      <TextInput
        style={styles.descriptionInput}
        multiline
        numberOfLines={5}
        placeholder="Enter event description..."
        value={eventDescription}
        onChangeText={(text) => setEventDescription(text)}
      />

      <Button
        title="NEXT"
        raised
        titleStyle={{ paddingLeft: 20 }}
        style={{ width: wp("50%"), height: hp("10%"), marginLeft: wp("25%") }}
        onPress={COMPLETEPOSTING}
        icon={
          <Icon
            name="arrow-right"
            size={(wp("4%"), hp("4%"))}
            color="white"
            iconStyle={{ paddingRight: 20 }}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: "5%",
    backgroundColor: "#F2F2F2",
  },
  datePickerButton: {
    backgroundColor: "#1E6738",
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  selectedDate: {
    marginBottom: 10,
    fontSize: 16,
    color: "#333",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    width: "80%",
  },
  descriptionInput: {
    height: 150,
    width: "80%",
    margin: 12,
    borderWidth: 1,
    borderRadius: 15,
    padding: 10,
    marginBottom: 20,
    backgroundColor: "white", // Added background color
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: "white",
    borderRadius: 15,
    paddingHorizontal: 15,
  },
  searchButton: {
    backgroundColor: "#1E6738",
    borderRadius: 15,
    padding: 10,
    marginLeft: 10,
  },
  mapContainer: {
    alignContent: "center",
    justifyContent: "center",

    width: "80%",
    backgroundColor: "white",
    borderRadius: 15,

    overflow: "hidden",
  },
  boldSubheading: {
    fontSize: 18,
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginTop: 10,
    marginLeft: "10%",
    marginBottom: 10,
  },
});

export default PostAnOpportunityScreen2;
