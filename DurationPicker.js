import React, { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { DatePickerModal } from "react-native-paper-dates";

const DurationPicker = ({ onChange }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [open, setOpen] = useState(false);
    const handleDurationChange = (startDate, endDate) => {
      // Call the parent component's callback
      onChange(startDate, endDate);
    };
  const onDismiss = React.useCallback(() => {
    setOpen(false);
  }, []);

  const onConfirm = React.useCallback(
    ({ startDate, endDate }) => {
      setStartDate(startDate);
      setEndDate(endDate);
          setOpen(false);
    handleDurationChange(startDate, endDate);
    },
    [setStartDate, setEndDate],
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Duration:</Text>

      <Button title="Select Duration" onPress={() => setOpen(true)} />

      {startDate && endDate && (
        <Text style={styles.selectedLabel}>
          Selected Duration: {startDate.toDateString()} to{" "}
          {endDate.toDateString()}
        </Text>
      )}

      <DatePickerModal
        locale="en"
        mode="range"
        visible={open}
        onDismiss={onDismiss}
        startDate={startDate}
        endDate={endDate}
        labelColor="#1E6738"
        presentationStyle="overFullScreen"
        onCancel={onDismiss}
        onConfirm={onConfirm}
        saveLabel="Save"
      />
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
  selectedLabel: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
  },
});

export default DurationPicker;
