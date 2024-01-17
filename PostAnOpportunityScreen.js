import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
} from "react-native";
import { Button, Header, SearchBar } from "react-native-elements";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Icon from "react-native-vector-icons/FontAwesome";

// Global Variables
import { GlobalStateContext } from "./GlobalState";

const PostAnOpportunityScreen = () => {
  const navigation = useNavigation();
  const { loggedIn, setLoggedIn, email, setEmail, uid, setUid } =
    useContext(GlobalStateContext);
  const [url, setUrl] = useState();
  const [titleLabel, onChangetitle] = useState(null);
  const [image, setImage] = useState(require("./upload-photo.jpeg"));
  const [error, setError] = useState("");

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setError(""); // Clear error when a new image is selected
    }
  };

  const navigateToNextScreen = () => {
    if (!image || !titleLabel) {
      setError("Please fill in all the fields before proceeding");
      return;
    }

    navigation.navigate("PostTwo", {
      titleLabel,
      image,
    });
  };

  const makeSquareElms = (value) => {
    const screenWidth = Dimensions.get("window").width;
    const screenHeight = Dimensions.get("window").height;
    return screenWidth > screenHeight ? wp(value) : hp(value);
  };

  return (
    <View style={styles.container}>
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <View style={{ alignItems: "center", justifyContent: "center" }}>
        {image && (
          <Image
            source={{ uri: image }}
            style={{
              width: makeSquareElms("30%"),
              height: makeSquareElms("30%"),
              resizeMode: "center",
            }}
          />
        )}

        <View style={{ width: 200, height: 19 }} />
        <TouchableOpacity
          title="Pick an image from camera roll"
          style={styles.roundButton2}
          fontColor="white"
          onPress={pickImage}
        >
          <Text style={styles.roundButton13}>
            Pick an image from camera roll
          </Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        onChangeText={onChangetitle}
        defaultValue={titleLabel}
        editable
        placeholder="Enter a title: "
        selectTextOnFocus
      />

      <Button
        title="NEXT"
        raised
        titleStyle={{ paddingLeft: 20 }}
        style={{ width: wp("50%"), height: hp("10%"), marginLeft: wp("25%") }}
        onPress={navigateToNextScreen}
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
    backgroundColor: "white",
  },
  roundButton2: {
    width: 320,
    height: 50,
    paddingTop: 0,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    padding: 0,
    borderRadius: 25,
    backgroundColor: "rgb(239,139,118)",
  },
  roundButton13: {
    fontSize: 20,
    color: "white",
  },
  input: {
    height: hp("5%"),
    margin: 12,
    borderWidth: 1,
    borderRadius: 15,
    padding: 10,
    width: wp("70%"),
    alignSelf: "center",
  },
  errorContainer: {
    backgroundColor: "red",
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 10,
    borderRadius: 5,
  },
  errorText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default PostAnOpportunityScreen;
