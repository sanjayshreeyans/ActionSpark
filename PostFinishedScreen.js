import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, Button } from "react-native";

const PostFinishedScreen = () => {
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.push("Home");
  };
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <MaterialIcons name="check-circle" size={100} color="green" />
      <Text style={{ fontSize: 24, fontWeight: "bold", marginVertical: 20 }}>
        Successfully Posted!
      </Text>
      <Button title="Go Back to Home" onPress={handleGoBack} />
    </View>
  );
};

export default PostFinishedScreen;
