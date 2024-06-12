import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  inputs: {
    width: "90%",
  },
  textHead: {
    fontSize: 25,
    fontWeight: "bold",
  },
  button: {
    width: "90%",
  },
  textRedirect: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: "bold",
    color: "#5322af",
  },
  rootHome: {
    flex: 1,
    marginVertical: 50,
    marginHorizontal: 25,
  },
  header: {
    flexDirection: "row",
    gap: 15,
    alignItems: "center",
  },
  iconEnd: {
    alignItems: "flex-end",
    flex: 1,
  },
  modal: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginHorizontal: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    gap: 10,
  },
  rootMessage: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 20,
    alignItems: "center",
  },
  fabMessage: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
  rootDetail: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
    gap: 20
  },
  texDetail: {
    fontWeight: 'bold',
    fontSize: 20
  }
});
