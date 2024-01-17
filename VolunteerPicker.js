// VolunteerPicker.js

import React, { useState } from "react";
import { View, Picker, Text, StyleSheet } from "react-native";

const VolunteerPicker = ({ onChange }) => {
    const [selectedVolunteerType, setSelectedVolunteerType] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");

  const handleVolunteerChange = (value) => {
    setSelectedCategory(value);
    onChange(value);
  };

  const categories = [
    "Community Service",
    "Education and Tutoring",
    "Health and Wellness",
    "Environmental Conservation",
    "Animal Welfare",
    "Arts and Culture",
    "Hunger and Homelessness",
    "Elderly Care",
    "Emergency Response and Disaster Relief",
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Volunteer Category:</Text>
      <Picker
        selectedValue={selectedCategory}
        onValueChange={(itemValue, itemIndex) =>
          handleVolunteerChange(itemValue)
        }
      >
        <Picker.Item label="Select a category" value="" />
        {categories.map((category, index) => (
          <Picker.Item key={index} label={category} value={category} />
        ))}
      </Picker>
      {selectedCategory ? (
        <Text style={styles.selectedCategory}>
          Selected Category: {selectedCategory}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  selectedCategory: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "bold",
    color: "#009688", // You can customize the color
  },
});

export default VolunteerPicker;