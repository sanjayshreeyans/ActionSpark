import { useNavigation } from "@react-navigation/native";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import React, { useState, useContext } from "react";
import { View, TextInput, StyleSheet, Image } from "react-native";
import { Button, Text, Icon } from "react-native-elements";

import { GlobalStateContext } from "./GlobalState";

const auth = getAuth();
const db = getFirestore();

const SignupScreen = () => {
  const navigation = useNavigation();

  const { setLoggedIn, setEmail, uid, setUid } = useContext(GlobalStateContext);
  const [name, setName] = useState("");
  const [email1, setEmail1] = useState("");
  const [password, setPassword] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("2008-23-11");
  const [errorColor, setErrorColor] = useState("red");

  const [errorMessage, setErrorMessage] = useState("");
  const handleSignup = () => {
    // validate name and check it is not empty
    console.log(email1);
    if (name.length === 0) {
      setErrorMessage("Invalid Name\nPlease enter a valid name");
      return;
    }
    // Validate date of birth
    const dobRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dobRegex.test(dateOfBirth)) {
      setErrorMessage(
        "Invalid Date of Birth\nPlease enter a valid date of birth (YYYY-MM-DD)",
      );
      return;
    }

    // Validate password
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setErrorMessage(
        "Invalid Password\nPlease enter a valid password\nPassword must contain at least 8 characters, one uppercase, one lowercase, one number and one special character",
      );
      return;
    }
    // Validate email
    // Trim whitespace from email
    const trimmedEmail = email1.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setErrorMessage("Invalid Email\nPlease enter a valid email address");
      return;
    }
    setEmail1(trimmedEmail);
    // Create user account with email and password
    createUserWithEmailAndPassword(auth, email1, password)
      .then((userCredential) => {
        // Signup successful
        const user = userCredential.user;
        // Put info such as email, date of birth, name in the firestore database2
        // Show success message
        // Change the color of the message to green
        setErrorColor("green");
        setErrorMessage("Processing...");
        // Go to home page
        setEmail(email1);
        setUid(user.uid);
        console.log("Global uid: " + uid, "Without inside uid", user.uid);
        setLoggedIn(true);
        saveUserData(user.uid);
      })
      .catch((error) => {
        // Signup failed
        setErrorColor("red");

        setErrorMessage("Signup Failed\n" + error.message);
      });
  };

  const saveUserData = async (uid1) => {
    try {
      console.log("UID: ", uid1);
      await setDoc(doc(db, "Users", uid1), {
        name,
        email: email1,
        dateOfBirth,
        uid: uid1,
      });

      // Code to execute after setDoc() finishes
      console.log("User data saved successfully");
      // ... Additional code here
      // Go to the home page
      // Clear form fields
      setName("");
      setEmail1("");
      setPassword("");
      setDateOfBirth("");
      setErrorMessage(
        "Signup Successful\nYour account has been created successfully",
      );
      navigation.push("Home");
    } catch (error) {
      setErrorColor("red");

      // Handle any errors that occur during setDoc()
      console.error("Error saving user data:", error);
      // ... Error handling code here
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("./coolbg2.jpg")} style={styles.backgroundImage} />

      <View style={styles.formContainer}>
        <Text h1 style={styles.title}>
          Signup
        </Text>
        <View style={styles.inputContainer}>
          <Icon name="user" type="font-awesome" color="#00539C" />
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={(text) => setName(text)}
          />
        </View>

        <View style={styles.separator} />

        <View style={styles.inputContainer}>
          <Icon name="envelope" type="font-awesome" color="#00539C" />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email1}
            onChangeText={(text) => setEmail1(text)}
          />
        </View>

        <View style={styles.separator} />

        <View style={styles.inputContainer}>
          <Icon name="lock" type="font-awesome" color="#00539C" />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
        </View>

        <View style={styles.separator} />

        <View style={styles.inputContainer}>
          <Icon name="calendar" type="font-awesome" color="#00539C" />
          <TextInput
            style={styles.input}
            placeholder="Date of Birth (YYYY-MM-DD)"
            value={dateOfBirth}
            onChangeText={(text) => setDateOfBirth(text)}
          />
        </View>

        {errorMessage ? (
          <Text style={[styles.alert, { color: errorColor }]}>
            {errorMessage}
          </Text>
        ) : null}

        <Button
          title="Signup"
          onPress={handleSignup}
          buttonStyle={styles.button}
          titleStyle={styles.buttonTitle}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    opacity: 0.8,
  },
  formContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 16,
    borderRadius: 15,
    width: "80%",
  },
  title: {
    marginBottom: 24,
    fontWeight: "bold",
    fontSize: 32,
    color: "#101820",
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: 40,
    paddingLeft: 8,
    color: "#101820",
  },
  separator: {
    height: 1,
    backgroundColor: "#00539C",
    marginVertical: 8,
  },
  alert: {
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#00539C",
    borderRadius: 15,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: 16,
  },
  buttonTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default SignupScreen;
