import React, { useState } from "react";
import { View } from "react-native";
import { Button, Divider, Text, TextInput } from "react-native-paper";
import { styles } from "../../theme/styles";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Message } from "./HomeScreen";
import { useEffect } from "react";
import { ref, remove, update } from "firebase/database";
import { dbRealTime } from "../../configs/firebaseConfig";

export const DetailMessageScreen = () => {
  //Hook para tomar las propiedades de la ruta
  const route = useRoute();
  //console.log(route);
  //@ts-ignore
  const { messages } = route.params;
  //console.log(messages);

  //Hook de navegación
  const navigation = useNavigation();

  //Hook para manipular
  const [editFormMessage, setEditFormMessage] = useState<Message>({
    id: "",
    to: "",
    subject: "",
    message: "",
  });

  //Hook useEffect para mostar la información del mensaje nen el formulario
  useEffect(() => {
    setEditFormMessage(messages);
  }, []);

  //Función para cambiar los datos del formulario
  const handlerSetValue = (key: string, value: string) => {
    setEditFormMessage({ ...editFormMessage, [key]: value });
  };

  //Función para actualizar la data del mensaje
  const handlerUpdateMessage = async () => {
    //console.log(editFormMessage);
    //1. Referencia a la BDD - tabla
    const dbRef = ref(dbRealTime, "messages/" + editFormMessage.id);
    await update(dbRef, {
      message: editFormMessage.message,
      subject: editFormMessage.subject,
    });
    navigation.goBack();
  };

  //Función para eliminar la data del mensaje
  const handlerDeletMessage = async () => {
    //1. Referencia a la BDD - tabla
    const dbRef = ref(dbRealTime, "messages/" + editFormMessage.id);
    await remove(dbRef);
    navigation.goBack();
  };

  return (
    <View style={styles.rootDetail}>
      <View>
        <Text variant="titleLarge">Asunto:</Text>
        <TextInput
          value={editFormMessage.subject}
          onChangeText={(value) => handlerSetValue("subject", value)}
        />
        <Divider />
      </View>
      <View>
        <Text variant="bodyLarge">Para: {editFormMessage.to}</Text>
        <Divider />
      </View>
      <View style={{ gap: 20 }}>
        <Text style={styles.texDetail}>Mensaje</Text>
        <TextInput
          value={editFormMessage.message}
          multiline={true}
          numberOfLines={5}
          onChangeText={(value) => handlerSetValue("message", value)}
        />
      </View>
      <Button
        icon="email-sync"
        mode="contained"
        style={styles.button}
        onPress={handlerUpdateMessage}
      >
        Actualizar
      </Button>
      <Button
        icon="email-remove"
        mode="contained"
        style={styles.button}
        onPress={handlerDeletMessage}
      >
        Eliminar
      </Button>
    </View>
  );
};
