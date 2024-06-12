import React from "react";
import { View } from "react-native";
import { IconButton, Text } from "react-native-paper";
import { styles } from "../../../theme/styles";
import { Message } from '../HomeScreen';
import { CommonActions, useNavigation } from "@react-navigation/native";

//Props para recibir el arreglo de mensajes
interface Props {
  messages: Message;
}

export const MessageCardComponent = ({ messages }: Props) => {
  //Hook de navegación
  const navigation = useNavigation();

  return (
    <View style={styles.rootMessage}>
      <View>
        <Text variant="labelLarge">{messages.to}</Text>
        <Text variant="bodyMedium">Asunto: {messages.subject}</Text>
      </View>
      <View style={styles.iconEnd}>
        <IconButton
          icon="email-open"
          size={25}
          onPress={() =>
            navigation.dispatch(CommonActions.navigate({name: "DetailMessage", params: {messages}}))
          }
        />
      </View>
    </View>
  );
};
