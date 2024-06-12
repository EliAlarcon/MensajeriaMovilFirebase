import React, { useState } from "react";
import {
  Button,
  Divider,
  IconButton,
  Modal,
  Portal,
  Text,
  TextInput,
} from "react-native-paper";
import { styles } from "../../../theme/styles";
import { View } from "react-native";
import { push, ref, set } from "firebase/database";
import { auth, dbRealTime } from "../../../configs/firebaseConfig";

//Interfaz para recibir props del componente
//Los props son propiedades que se necesitan para el componente
interface Props {
  showModalMessage: boolean;
  setShowModalMesagge: Function;
}

//Interfaz para manejar el formulario mensaje
interface FormMessage {
  to: string;
  subject: string;
  message: string
}

//En lugar de recibir props: Props, desestructuramos el objeto
export const NewMessageComponent = ({
  showModalMessage,
  setShowModalMesagge,
}: Props) => {

  //Hook useState: manipulación de la data del formulario
  const [formMessage, setFormMessage] = useState<FormMessage>({
    to:'',
    subject:'',
    message: ''
  });

  //Función que cambie los valores del formMessage
  const hadlerSetValues = (key: string, value: string)=>{
    setFormMessage({...formMessage, [key]:value})
  }

  //Función para guardar el mensaje
  const hadlerSaveMessage = async () => {
    if (!formMessage.to || !formMessage.subject || !formMessage.subject) {
      return;
    }
    //console.log(formMessage);
    /*Guardar los datos en BDD
    1. Referencia a la BDD y creación tabla */
    const dbRef = ref(dbRealTime, 'messages/'+auth.currentUser?.uid);
    //2. Crear una colección - evitando sobreescritura de la data
    const saveMessage = push(dbRef);
    //3. Almacenar en la DBB
    try {
      await set(saveMessage, formMessage);
      //4. Limpiar formulario
      setFormMessage({
        to:'',
        subject:'',
        message:''
      })
    } catch (ex) {
      console.log(ex);
      
    }
    setShowModalMesagge(false);
  }
  
  return (
    <Portal>
      <Modal visible={showModalMessage} contentContainerStyle={styles.modal}>
        <View style={styles.header}>
          <Text variant="headlineMedium">Nueva Carta</Text>
          <View style={styles.iconEnd}>
            <IconButton
              icon="close-box"
              size={28}
              onPress={() => setShowModalMesagge(false)}
            />
          </View>
        </View>
        <Divider />
        <View>
          <TextInput label="Para" 
          mode="outlined" 
          onChangeText={(value) => {hadlerSetValues('to', value)}} 
          />
          <TextInput 
          label="Asunto" 
          mode="outlined" 
          onChangeText={(value) => {hadlerSetValues('subject', value)}} 
          />
          <TextInput
            label="Mensaje"
            mode="outlined"
            multiline={true}
            numberOfLines={7}
            onChangeText={(value) => {hadlerSetValues('message', value)}}
          />
          <Button mode="contained" onPress={hadlerSaveMessage}>
            Enviar
          </Button>
        </View>
      </Modal>
    </Portal>
  );
};
