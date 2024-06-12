import React, { useEffect, useState } from "react";
import { View } from "react-native";
import {
  Avatar,
  Button,
  Divider,
  FAB,
  IconButton,
  Modal,
  Portal,
  Text,
  TextInput,
} from "react-native-paper";
import { styles } from "../../theme/styles";
import { onAuthStateChanged, signOut, updateProfile } from "firebase/auth";
import firebase from "firebase/auth";
import { auth, dbRealTime } from "../../configs/firebaseConfig";
import { FlatList } from "react-native-gesture-handler";
import { MessageCardComponent } from "./components/MessageCardComponent";
import { NewMessageComponent } from "./components/NewMessageComponent";
import { onValue, ref } from "firebase/database";
import { CommonActions, useNavigation } from "@react-navigation/native";

//Interfaz que va a tener la data del usuario
interface FormUser {
  name: string;
}

//Interfaz para nuestros mensajes
export interface Message {
  id: string;
  to: string;
  subject: string;
  message: string;
}

export const HomeScreen = () => {
  //Hook useState: para ir trabajando la data del usuario
  const [formUser, setFormUser] = useState<FormUser>({
    name: "",
  });

  //Hook useState: que me permita trabajar con la data del usuario autenticado
  //Inicia en null
  const [userAuth, setUserAuth] = useState<firebase.User | null>(null);

  //Hook useEffect: para capturar la data del usuario autenticado
  useEffect(() => {
    //OnAuthStateChange: permite capturar la información del usuario autenticado
    /* onAuthStateChanged(auth, (user) => {
      if (user) {
        //console.log(user);
        setUserData({
          //displayName es una clave
          name: user.displayName ?? "NA",
        });
      }
    }); */

    //Obtener el usuario logueado con current (otro método para capturar datos)
    setUserAuth(auth.currentUser);
    //El signo de pregunta en userAuth nos permite decir que si es null no siga ejecutándose la línea de código
    setFormUser({ name: auth.currentUser?.displayName ?? "" });
    //Llamamos a la función que me va a permitir enlistar todos mis mensajes
    getAllMessages();
  }, []);

  //Hook useState: para manipular el modal
  const [showModal, setShowModal] = useState<boolean>(false);

  //Hook useState: para manipular el modal de añadir mensaje
  const [showModalMessage, setShowModalMesagge] = useState<boolean>(false);

  //Hook useState: para listas los mensajes
  const [messages, setMessages] = useState<Message[]>([]);

  //Hook de navegación
  const navigation = useNavigation();

  //Función que cambie los valores del formUser
  const handlerSetValues = (key: string, value: string) => {
    setFormUser({ ...formUser, [key]: value });
  };

  //Función actualizar la data del usuario autenticado
  const handlerUpdateUser = async () => {
    await updateProfile(userAuth!, {
      displayName: formUser.name,
    });
    setShowModal(false);
  };

  //Función para consultar la data desde firebase
  const getAllMessages = () => {
    //1. Referencia a la BDD - tabla
    //La consulta se va a realizar en base al usuario autenticado
    const dbRef = ref(dbRealTime, "messages/"+auth.currentUser?.uid);
    //2. Consultar data
    onValue(dbRef, (snapshot) => {
      //3. Capturar data
      const data = snapshot.val(); //Obtener los valores en un formato esperado
      //Validación: Si la data está vacía envío un return y ya no ejecuto lo demas del código
      if(!data) return;
      //4. Obtener keys data
      const getKeys = Object.keys(data);
      //5. Crear un arreglo de tipo Message[] para obtener una lista de mensajes
      const listMessages: Message[] = [];
      getKeys.forEach((key) => {
        /*Sacamos una copia de nuestra data y vamos a ir directo a la key 
        e indicamos que el atributo del objeto que va a coincidir con la key es id*/
        const value = { ...data[key], id: key };
        //Insertamos la información encontrada en el arreglo creado con el método push
        listMessages.push(value);
      });
      //Seteamos la data al arreglo messages con la ayuda del Hook useState
      setMessages(listMessages);
    });
  };

  //Función cerrar sesión
  const handlerSignOut = async () => {
    await signOut(auth);
    /*Aquí para navegar a Login vamos a utilizar reset
    El reset nos va a permitir resetear todas las rutas de navegación
    E indicar en que pantalla deseo iniciar*/
    navigation.dispatch(
      CommonActions.reset({ index: 0, routes: [{ name: "Login" }] })
    );
    //Cerramos también nuestro Modal
    setShowModal(false);
  };

  return (
    <>
      <View style={styles.rootHome}>
        <View style={styles.header}>
          <Avatar.Text size={50} label="MI" />
          <View>
            <Text variant="bodySmall">Bienvenido</Text>
            <Text variant="labelLarge">{userAuth?.displayName}</Text>
          </View>
          <View style={styles.iconEnd}>
            <IconButton
              icon="account-edit"
              mode="contained"
              size={32}
              onPress={() => setShowModal(true)}
            />
          </View>
        </View>
        <View>
          <FlatList
            data={messages}
            renderItem={({ item }) => <MessageCardComponent messages={item} />}
            keyExtractor={(item) => item.id}
          />
        </View>
      </View>

      <Portal>
        <Modal visible={showModal} contentContainerStyle={styles.modal}>
          <View style={styles.header}>
            <Text variant="headlineMedium">Mi Perfil</Text>
            <View style={styles.iconEnd}>
              <IconButton
                icon="close-box"
                size={28}
                onPress={() => setShowModal(false)}
              />
            </View>
          </View>
          <Divider />
          <TextInput
            mode="outlined"
            label="Escribe tu Nombre"
            value={formUser.name}
            onChangeText={(value) => handlerSetValues("name", value)}
          />
          {/* El ! junto a email le indica que el valor va a ser solo string no string | null */}
          <TextInput
            mode="outlined"
            label="Correo"
            value={userAuth?.email!}
            disabled
          />
          <Button
            mode="contained"
            onPress={() => {
              handlerUpdateUser();
            }}
          >
            Actualizar
          </Button>
          <View>
            <IconButton
              icon="logout-variant"
              mode="contained"
              size={32}
              onPress={handlerSignOut}
            />
          </View>
        </Modal>
      </Portal>
      <FAB
        icon="plus"
        style={styles.fabMessage}
        onPress={() => setShowModalMesagge(true)}
      />
      <NewMessageComponent
        showModalMessage={showModalMessage}
        setShowModalMesagge={setShowModalMesagge}
      />
    </>
  );
};
