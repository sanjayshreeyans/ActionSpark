import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
} from "react-native";

import { ALGOLIA_ID, ALGOLIA_ADMIN_KEY, ALGOLIA_INDEX_NAME } from "./APIKeys";
import { GlobalStateContext } from "./GlobalState";

const HomeScreen = () => {
  const navigation = useNavigation();
  const { loggedIn, setLoggedIn, email, setEmail, uid, setUid } =
    useContext(GlobalStateContext);
  const route = useRoute();
  const searchResults = route.params?.hits || [];

  const navigateToDetails = (selectedResult, date) => {
    navigation.navigate("Details", {
      result: selectedResult,
      formattedDate: date,
    });
  };

  useEffect(() => {
    handleSearch("");
  }, []);

  const handleSearch = async (searchQuery) => {
    const algoliasearch = require("algoliasearch");
    const client = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY);
    const index = client.initIndex(ALGOLIA_INDEX_NAME);

    try {
      const { hits } = await index.search(searchQuery);
      navigation.navigate("Home", { hits });
    } catch (error) {
      console.error("Error performing search:", error);
    }
  };

  return (
    <ImageBackground
      source={require("./homeScreenBackground2.jpg")}
      style={styles.container}
    >
      {searchResults.length > 0 ? (
        <View style={styles.content}>
          <Text style={styles.headerText}>Search Results</Text>
          <View style={styles.gridContainer}>
            {searchResults.map((result, index) => {
              const dateObject = new Date(
                result.DateToBeFinishedTimeStampStart,
              );
              const dateObject2 = new Date(result.DateToBeFinishedTimeStamp);
              const formattedDate = dateObject.toLocaleDateString();
              const formattedDate2 = dateObject2.toLocaleDateString();

              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => navigateToDetails(result, formattedDate)}
                >
                  <View style={styles.gridItem}>
                    <Image
                      source={{ uri: result.image }}
                      style={styles.image}
                    />
                    <Text style={styles.title}>{result.Title}</Text>
                    <Text style={styles.location}>{result.Location}</Text>
                    {!(formattedDate == formattedDate2) && (
                      <Text style={styles.date}>
                        {formattedDate} - {formattedDate2}
                      </Text>
                    )}
                    {formattedDate == formattedDate2 && (
                      <Text style={styles.date}>{formattedDate}</Text>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ) : null}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    backgroundColor: "#F4F4F4",
    alignItems: "center",
  },
  content: {
    flex: 1,
    width: "100%",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#8AC926",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridItem: {
    width: "30%",
    marginBottom: 20,
    padding: 10,
    minWidth: 350,
    borderWidth: 1,
    backgroundColor: "#FFF",
    borderColor: "#ddd",
    borderRadius: 10,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    borderRadius: 5,
    marginBottom: 10,
  },
  location: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3772FF",
  },
  date: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#EE6123",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#f39c12",
  },
});

export default HomeScreen;
