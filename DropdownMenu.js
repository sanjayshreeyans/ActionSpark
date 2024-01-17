import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import React, { useState, useContext } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";

import { GlobalStateContext } from "./GlobalState";

const DropdownMenu = () => {
  const navigation = useNavigation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { userName } = useContext(GlobalStateContext);

  const handleItemChange = (itemValue) => {
    // ... your existing handleItemChange logic
    setDropdownOpen(false);
  };

  let initials = "";

  const nameParts = userName.split(" ");

  if (nameParts.length >= 2) {
    // If there are at least two names, take initials from the first and last name
    initials =
      nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0);
  } else {
    // If there's only one name, repeat its first initial
    initials = nameParts[0].charAt(0).repeat(2);
  }
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setDropdownOpen(!dropdownOpen)}>
        <View style={styles.bubble}>
          <Text style={styles.bubbleText}>{initials}</Text>
        </View>
      </TouchableOpacity>
      {dropdownOpen && (
        <View style={styles.dropdownContainer}>
          {/* Display dropdown options directly here */}
          <TouchableOpacity onPress={() => handleItemChange("logout")}>
            <Text style={styles.dropdownItem}>Logout</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("PostOne")}>
            <Text style={styles.dropdownItem}>Post an Opportunity</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("GroupChat")}>
            <Text style={styles.dropdownItem}>Conversations</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

// ... your existing styles

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginLeft: 110,
    alignItems: "center",
    justifyContent: "center",
  },
  bubble: {
    width: 60, // Explicitly set width for consistency
    height: 60, // Match width for a perfect circle
    borderRadius: 60, // Half of the width, ensuring a circle
    backgroundColor: "rgb(243, 156, 18)",
    alignItems: "center", // Center text vertically
    justifyContent: "center", // Center text horizontally
    padding: 0, // Remove padding to avoid affecting circle shape
  },
  bubbleText: {
    color: "#FFFFFF", // White color for text inside bubble
    fontSize: 30,
    alignContent: "center",
    fontWeight: "bold",
  },
  dropdownContainer: {
    position: "absolute",
    top: 65,
    right: -25,
    backgroundColor: "#FFFFFF", // White color for dropdown background
    overflow: "hidden", // Hide the overflow for circular shape
    elevation: 5, // Shadow for Android
    zIndex: 1, // Bring to front for iOS
  },
  dropdownItem: {
    padding: 10, // Adjust padding as needed
    fontSize: 16, // Adjust font size as needed
    color: "#333333", // Adjust text color as needed
    backgroundColor: "#FFFFFF", // Adjust background color as needed
  },

  circularPicker: {
    width: 300, // Adjust the width for circular shape
    height: 300, // Adjust the height for circular shape
  },
});

export default DropdownMenu;
