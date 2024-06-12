//rafc
import React, { useState } from "react";
import { View } from "react-native";
import { Button, Snackbar, Text, TextInput } from "react-native-paper";
import { styles } from "../theme/styles";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../configs/firebaseConfig";
import { CommonActions, useNavigation } from "@react-navigation/native";

//Interfaz del formulario login
interface FormLogin {
  email: string;
  password: string;
}

//Interface - mensajes
interface MessageSnackbar {
  visible: boolean;
  message: string;
  color: string;
}

export const LoginScreen = () => {
  //Hook useState: formulario de inicio de sesión
  const [formLogin, setFormLogin] = useState<FormLogin>({
    email: "",
    password: "",
  });

  //Hook useState: para visualiazar u ocultar mensaje
  const [showMessage, setShowMessage] = useState<MessageSnackbar>({
    visible: false,
    message: "",
    color: "#ffff",
  });

  //Hook useNavigation: para navegar entre Screens
  const navigation = useNavigation();

  //Función que cambie los valores del formLogin
  const handlerSetValues = (key: string, value: string) => {
    //operador spread: ...saca una copia superficial de un objeto
    setFormLogin({ ...formLogin, [key]: value });
  };

  //Función que permita crear y enviar el nuevo usuario
  const handlerLogin = async () => {
    if (!formLogin.email || !formLogin.password) {
      setShowMessage({
        visible: true,
        message: "Completa todos los campos!",
        color: "#FF334F",
      });

      return;
    }
    //console.log(formLogin);
    //Siempre que nos conectemos a una API siempre es importante manejar las excepciones que se generen
    //El método signInWithEmailAndPassword nos permite 
    try {
      const response = await signInWithEmailAndPassword(
        auth,
        formLogin.email,
        formLogin.password
      );
      //console.log(response);
      navigation.dispatch(CommonActions.navigate({name:'Home'}));
    } catch (ex) {
      console.log(ex);
      setShowMessage({
        visible: true,
        message: "Usuario y/o contraseña incorrecta",
        color: "#b53333",
      });
    }
  };

  return (
    <View style={styles.root}>
      <Text style={styles.textHead}>Inicia Sesión</Text>
      <TextInput
        mode="outlined"
        label="Correo"
        placeholder="Escriba su correo"
        style={styles.inputs}
        onChangeText={(valueEmail) => handlerSetValues("email", valueEmail)}
      />
      <TextInput
        mode="outlined"
        label="Contraseña"
        placeholder="Escriba su contraseña"
        secureTextEntry
        right={<TextInput.Icon icon="eye" />}
        style={styles.inputs}
        onChangeText={(valuePassword) =>
          handlerSetValues("password", valuePassword)
        }
      />
      <Button mode="contained" onPress={handlerLogin} style={styles.button}>
        Iniciar
      </Button>
      <Text
        style={styles.textRedirect}
        onPress={() =>
          navigation.dispatch(CommonActions.navigate({ name: "Register" }))
        }
      >
        No tienes una cuenta? Regístrate ahora
      </Text>
      <Snackbar
        visible={showMessage.visible}
        onDismiss={() => setShowMessage({ ...showMessage, visible: false })}
        style={{ backgroundColor: showMessage.color }}
      >
        {showMessage.message}
      </Snackbar>
    </View>
  );
};
