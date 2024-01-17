import { useNavigation } from "@react-navigation/native";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import React, { useContext } from "react";
import { View, StyleSheet, ImageBackground, Animated } from "react-native";
import { Button, Text, Input } from "react-native-elements";

import { firebaseConfig } from "./APIKeys";
import { GlobalStateContext } from "./GlobalState";

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const LoginScreen = () => {
  const { setLoggedIn, email, setEmail, setUid, setUserName } =
    useContext(GlobalStateContext);

  const navigation = useNavigation();
  const [email1, setEmail1] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email1, password)
      .then((userCredential) => {
        const user = userCredential.user;

        setEmail(email);

        onAuthStateChanged(auth, (user) => {
          if (user) {
            setUid(user.uid);
            setLoggedIn(true);

            console.log("Logged in as: ", user.uid);
            // Retrieve the user's name from firestore. the locations is "Users/UID" and name attribute
            const fetchData = async () => {
              const querySnapshot = await getDocs(collection(db, "/Users"));

              querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots

                if (doc.id === user.uid) {
                  console.log("Found doc");
                  setUserName(doc.data().name);
                  console.log(doc.data().name);
                  // Stop searching for other documents
                }
              });
            };

            fetchData();
            navigation.push("Home");
          } else {
            setUid("");
            setLoggedIn(false);
          }
        });
      })
      .catch((error) => {
        setEmail("");
        setLoggedIn(false);
        setUid("");

        const errorCode = error.code;
        const errorMessage = error.message;

        if (errorCode === "auth/wrong-password") {
          alert("Incorrect password");
        } else {
          setError(errorMessage);
        }
      });
  };

  return (
    <ImageBackground source={require("./coolbg.png")} style={styles.background}>
      <View style={styles.container}>
        <Text h3 style={styles.title}>
          Welcome Back!
        </Text>
        <Input
          placeholder="Email"
          value={email1}
          onChangeText={(text) => setEmail1(text)}
          inputStyle={styles.input}
          leftIcon={{ type: "material", name: "email", color: "#ffffff" }}
        />
        <Input
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
          inputStyle={styles.input}
          leftIcon={{ type: "material", name: "lock", color: "#ffffff" }}
        />
        <Button
          title="Login"
          onPress={handleLogin}
          buttonStyle={styles.button}
          titleStyle={styles.buttonTitle}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "80%",
    backgroundColor: "rgba(255, 255, 255, 0.8)", // Semi-transparent white background
    padding: 16,
    borderRadius: 15,
    alignItems: "center",
  },
  balloon: {
    width: 50,
    height: 50,
    marginBottom: 20,
  },
  title: {
    marginBottom: 24,
    fontSize: 28,
    fontWeight: "bold",
    color: "#00539c", // White color for text
  },
  input: {
    color: "#fffff", // White color for input text
  },
  button: {
    backgroundColor: "#f39c12", // Orange color for the button
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: 16,
  },
  buttonTitle: {
    fontSize: 16,
    color: "#00539c",
    fontWeight: "bold",
  },
  errorText: {
    color: "#e74c3c", // Red color for error text
    marginTop: 16,
    fontSize: 16,
  },
});

export default LoginScreen;
