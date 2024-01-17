// App.tsx
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useState, useContext } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import DropdownPicker from "react-native-dropdown-picker";
import { Button } from "react-native-elements";

// Api keys for algolia
import { ALGOLIA_ID, ALGOLIA_ADMIN_KEY, ALGOLIA_INDEX_NAME } from "./APIKeys";
import DisplayDetailsScreen from "./DisplayDetailsScreen";
import DropdownMenu from "./DropdownMenu";
import { GlobalStateProvider, GlobalStateContext } from "./GlobalState";
// ________________________________________________________________
import GroupChatScreen from "./GroupChatScreen";
import HomeScreen from "./HomeScreen";
import LoginScreen from "./LoginScreen";
import PostAnOpportunityScreen from "./PostAnOpportunityScreen";
import PostAnOpportunityScreen2 from "./PostAnOpportunityScreen2";
import PostFinishedScreen from "./PostFinishedScreen";
import SignupScreen from "./SignupScreen";

// ________________________________________________________________

type RootStackParamList = {
  Home: undefined;
  Details: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const CustomHeader = () => {
  // Get few values from global context provider
  const { loggedIn } = useContext(GlobalStateContext);
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState(" ");
  var num = 0;
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSearch = async (searchQuery: string) => {
    setSearchQuery(searchQuery);
    console.log(searchQuery);

    const algoliasearch = require("algoliasearch");
    const client = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY);

    const index = client.initIndex(ALGOLIA_INDEX_NAME);

    try {
      // Perform search using searchQuery
      const { hits } = await index.search(searchQuery);

      // `hits` will contain an array of matching records
      console.log(hits);
      console.log("Search completed");
      // Navigate to the home screen and pass the search results as a parameter
      navigation.navigate("Home", { hits });
      console.log("Navigated to home screen");
      // Now you can update your state or do something with the search results
      // Example: setResults(hits);
    } catch (error) {
      console.error("Error performing search:", error);
    }
  };

  return (
    <View style={styles.headerContainer}>
      <Button
        title="SparkAction"
        type="clear"
        titleStyle={{ color: "black", fontSize: 32, fontWeight: "bold" }}
        onPress={() => navigation.push("Home")}
      />
      <View style={styles.searchInputContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          onChangeText={handleSearch}
        />
      </View>
      {loggedIn ? (
        // Horizontal view for spacing between the search bar and the dropdown
        <View>
          <View style={{ width: "10%", flexDirection: "row" }} />

          <DropdownMenu />
        </View>
      ) : (
        <>
          <Button
            title="Login"
            buttonStyle={styles.button}
            onPress={() => navigation.navigate("Login")}
          />
          <Button
            title="Signup"
            buttonStyle={styles.signupButton}
            titleStyle={{ color: "#FEE715" }}
            onPress={() => navigation.navigate("Signup")}
          />
        </>
      )}
    </View>
  );
};

const App: React.FC = () => {
  return (
    <GlobalStateProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            header: () => <CustomHeader />,
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: "Home" }}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ title: "Login" }}
          />
          <Stack.Screen
            name="Signup"
            component={SignupScreen}
            options={{ title: "Signup" }}
          />
          <Stack.Screen
            name="PostOne"
            component={PostAnOpportunityScreen}
            options={{ title: "PostOne" }}
          />
          <Stack.Screen
            name="PostTwo"
            component={PostAnOpportunityScreen2}
            options={{ title: "PostTwo" }}
          />
          <Stack.Screen
            name="PostFinished"
            component={PostFinishedScreen}
            options={{ title: "PostFinished" }}
          />
          <Stack.Screen
            name="Details"
            component={DisplayDetailsScreen}
            options={{ title: "Details" }}
          />
          <Stack.Screen name="GroupChat" component={GroupChatScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GlobalStateProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    height: 100,
    backgroundColor: "#EFCA08",
  },
  searchInputContainer: {
    height: "43%",
    maxWidth: "70%",
    minWidth: "70%",
    marginLeft: 16,
  },
  searchInput: {
    flex: 1,
    height: 500,
    paddingHorizontal: 8,
    backgroundColor: "white",
    borderRadius: 13,
  },
  button: {
    borderRadius: 15,
    paddingHorizontal: 16,
    paddingVertical: 10,
    minWidth: 80,
    marginHorizontal: 10,
  },
  signupButton: {
    backgroundColor: "#101820",
    borderRadius: 15,
    paddingHorizontal: 16,
    paddingVertical: 10,
    minWidth: 80,
    marginHorizontal: 10,
  },
  loggedInContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dropdownContainer: {
    width: 150,
  },
  dropdownLabel: {
    color: "#fff",
  },
  dropdown: {
    backgroundColor: "#0099FF",
  },
  dropDown: {
    backgroundColor: "#0099FF",
  },
});
