// SkillsRequired.js

import React, { useState } from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";

const SkillsRequiredInput = ({ onChange }) => {
  const [selectedSkills, setSelectedSkills] = useState("");
  const [skillsRequired, setSkillsRequired] = useState("");

  const handleSkillsChange = (value) => {
    setSelectedSkills(value);
    setSkillsRequired(value);
    onChange(value);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Skills Required:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter skills or qualifications..."
        multiline
        numberOfLines={4} // You can adjust the number of lines
        value={skillsRequired}
        onChangeText={(text) => handleSkillsChange(text)}
      />
      {skillsRequired ? (
        <Text style={styles.previewLabel}>Preview:</Text>
      ) : null}
      <Text style={styles.previewText}>{skillsRequired}</Text>
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
  input: {
    height: 100,
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 8,
    fontSize: 16,
  },
  previewLabel: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "bold",
  },
  previewText: {
    marginTop: 8,
    fontSize: 16,
    color: "#555",
  },
});

export default SkillsRequiredInput;
