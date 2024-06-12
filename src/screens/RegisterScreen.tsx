//rafc
import React, { useState } from "react";
import { View } from "react-native";
import { Button, Snackbar, Text, TextInput } from "react-native-paper";
import { styles } from "../theme/styles";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../configs/firebaseConfig";
import { CommonActions, useNavigation } from "@react-navigation/native";

//Interfaz del formulario de registro
interface FormRegister {
  email: string;
  password: string;
}

//Interface - mensajes
interface MessageSnackbar {
  visible: boolean;
  message: string;
  color: string;
}

export const RegisterScreen = () => {
  //Hook useState: manipulación del formulario
  const [formRegister, setFormRegister] = useState<FormRegister>({
    //Le damos el valor inicial al objeto (clave:valor)
    email: "",
    password: "",
  });

  //Hook useState: para visualiazar u ocultar mensaje
  const [showMessage, setShowMessage] = useState<MessageSnackbar>({
    visible: false,
    message:'',
    color: '#ffff'
  });

  //Hook useState: para visualizar la contraseña
  const [hiddenPassword, setHiddenPassword] = useState<boolean>(false)

  //Hook useNavigation: para navegar entre Screens
  const navigation = useNavigation();

  //Función que cambie los valores del formRegister
  const handlerSetValues = (key: string, value: string) => {
    //operador spread: ...saca una copia superficial de un objeto
    setFormRegister({ ...formRegister, [key]: value });
  };

  //Función que permita crear y enviar el nuevo usuario
  const handlerRegister = async () => {
    if (!formRegister.email || !formRegister.password) {
      setShowMessage({visible:true, message:'Completa todos los campos!', color: '#FF334F'});
      return;
    }
    //console.log(formRegister);
    //Código para registrar usuario
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        formRegister.email,
        formRegister.password
      );
      setShowMessage({visible: true, message: 'Registro exitoso!', color:'#16AD01'});
    } catch (ex) {
      console.log(ex);
      setShowMessage({visible: true, message: 'No se completó el registro. Inténtelo mas tarde', color:'#FF334F'});
    }
  };

  return (
    <View style={styles.root}>
      <Text style={styles.textHead}>Regístrate</Text>
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
        style={styles.inputs}
        onChangeText={(valuePassword) =>
          handlerSetValues("password", valuePassword)
        }
      />
      <Button mode="contained" onPress={handlerRegister} style={styles.button}>
        Registrar
      </Button>
      <Text style={styles.textRedirect}
      onPress={()=>navigation.dispatch(CommonActions.navigate({name: "Login"}))}>Ya tienes una cuenta? Inicia Sesión</Text>
      <Snackbar
        visible={showMessage.visible}
        onDismiss={() => setShowMessage({...showMessage, visible:false})}
        style={{backgroundColor: showMessage.color}}
      >
        {showMessage.message}
      </Snackbar>
    </View>
  );
};
