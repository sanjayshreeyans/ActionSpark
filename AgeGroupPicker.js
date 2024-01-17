import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

const AgeGroupPicker = ({ onChange }) => {
  const [selectedAgeGroup, setSelectedAgeGroup] = useState("");

  const ageGroups = [
    "Any Age",
    "5-10",
    "11-17",
    "18-25",
    "26-35",
    "36-45",
    "46-55",
    "56-65",
    "65+",
  ];

  const handleAgeGroupChange = (value) => {
    setSelectedAgeGroup(value);
    onChange(value);
  };

  return (
    <View>
      <Text style={styles.label}>Select Age Group:</Text>
      <Picker
        selectedValue={selectedAgeGroup}
        onValueChange={(value) => handleAgeGroupChange(value)}
      >
        {ageGroups.map((ageGroup) => (
          <Picker.Item key={ageGroup} label={ageGroup} value={ageGroup} />
        ))}
      </Picker>
      {selectedAgeGroup ? (
        <Text style={styles.selectedLabel}>Selected Age Group:</Text>
      ) : null}
      <Text style={styles.selectedText}>{selectedAgeGroup}</Text>
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
  picker: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  selectedLabel: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "bold",
  },
  selectedText: {
    marginTop: 8,
    fontSize: 16,
    color: "#555",
  },
});

export default AgeGroupPicker;
