import { createStackNavigator } from "@react-navigation/stack";
import { LoginScreen } from "../screens/LoginScreen";
import { RegisterScreen } from "../screens/RegisterScreen";
import { HomeScreen } from "../screens/HomeScreen/HomeScreen";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../configs/firebaseConfig";
import { View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { styles } from "../theme/styles";
import { DetailMessageScreen } from "../screens/HomeScreen/DetailMessageScreen";

const Stack = createStackNavigator();

//Interfaz de rutas
interface Routes {
  name: string;
  screen: () => JSX.Element; //elemento JSX
  headerShown?: boolean;
}

//Arreglo que contiene las rutas de la aplicación
const routes: Routes[] = [
  { name: "Login", screen: LoginScreen },
  { name: "Register", screen: RegisterScreen },
  { name: "Home", screen: HomeScreen },
  { name: "DetailMessage", screen: DetailMessageScreen, headerShown: true },
];

export const StackNavigator = () => {
  //Hook useState: verifica si está autenticado o no
  const [isAuth, setIsAuth] = useState<boolean>(false);

  //Hook useState: controlar la carga del activity
  const [isLoading, setIsLoading] = useState<boolean>(false);

  //Hook useEffect: validar y obtener la data del usuario atenticado
  useEffect(() => {
    setIsLoading(true);
    onAuthStateChanged(auth, (user) => {
      //Si existe un usuario authenticado
      if (user) {
        //console.log(user);
        setIsAuth(true);
      }
      setIsLoading(false);
    });
  }, []);

  return (
    <>
      {isLoading ? (
        <View style={styles.root}>
          <ActivityIndicator size={25} />
        </View>
      ) : (
        //Incluimos lógica en la etiqueta
        //Si el usuario está autenticado me envía a Home sino voy a Login
        <Stack.Navigator initialRouteName={isAuth?'Home':'Login'}>
          {
          routes.map((item, index) => (
                <Stack.Screen
                  key={index}
                  name={item.name}
                  //Si hay un valor asignado en headerShown asignar ese valor si no asignar false
                  options={{ headerShown: item.headerShown ?? false }}
                  component={item.screen}
                />
              ))}

          {/* <Stack.Screen name="Register" options={{headerShown: false}} component={RegisterScreen} /> */}
        </Stack.Navigator>
      )}
    </>
  );
};
