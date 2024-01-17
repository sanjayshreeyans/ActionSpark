import {
  getFirestore,
  onSnapshot,
  collection,
  addDoc,
  query,
  orderBy,
  docChanges,
} from "firebase/firestore";
import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import { v4 as uuidv4 } from "uuid";

import { GlobalStateContext } from "./GlobalState";

const GroupChatScreen = ({ route }) => {
  const { groupId } = route.params;
  const { uid, userName } = useContext(GlobalStateContext);

  const [messages, setMessages] = useState([]);
  const db = getFirestore();

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, "GroupChats", groupId, "messages"),
        orderBy("createdAt"),
      ),
      (snapshot) => {
        const messagesArray = [];
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            messagesArray.unshift({ ...change.doc.data(), _id: change.doc.id });
          }
        });
        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, messagesArray),
        );
      },
    );

    return () => unsubscribe();
  }, [groupId]);

  const onSend = async (newMessages = []) => {
    const message = newMessages[0];

    const formattedMessage = {
      _id: uuidv4(),
      text: message.text,
      user: { _id: uid, name: userName },
      createdAt: new Date().getTime(),
    };

    await addDoc(
      collection(db, "GroupChats", groupId, "messages"),
      formattedMessage,
    );
  };

  const renderBubble = (props) => {
    return (
      <>
        {props.currentMessage.user._id !== uid && (
          <View >
            
          </View>
        )}
        <Bubble
          {...props}
          wrapperStyle={{
            left: {
              backgroundColor: "#5A5A5D", // Gray color for other person's messages
            },
            right: {
              backgroundColor: "#0099FF", // Blue color for your messages
            },
          }}
          textStyle={{
            left: {
              color: "#fff",
            },
            right: {
              color: "#fff",
            },
            time: {
              color: "#000",
            },
          }}
          timeTextStyle={{
            left: {
              color: "#fff",
            },
            right: {
              color: "#fff",
            },
          }}
        />
      </>
    );
  };

  const getInitials = (name) => {
    const nameArray = name.split(" ");
    return nameArray.map((word) => word.charAt(0).toUpperCase()).join("");
  };

  return (
    <ImageBackground
      source={require("./chatBackground.jpg")}
      style={styles.background}
    >
      <GiftedChat
        messages={messages}
        onSend={(newMessages) => onSend(newMessages)}
        user={{ _id: uid, name: userName }}
        renderBubble={renderBubble}
        placeholder="Type your message here..."
        renderInputToolbar={(props) => (
          <InputToolbar
            {...props}
            containerStyle={{
              backgroundColor: "#F2F2F2",
              borderTopWidth: 0,
            }}
            placeholderTextColor="#B0B0B0"
          />
        )}
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  initialsBubble: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#0099FF", // Blue color for initials bubble
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  initialsText: {
    color: "#FFFFFF", // White color for text inside initials bubble
    fontSize: 16,
    fontWeight: "bold",
  },
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
});

export default GroupChatScreen;
