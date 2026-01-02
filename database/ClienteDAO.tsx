import { Platform } from "react-native";

const IP = Platform.OS === "android" ? "10.0.2.2" : "localhost";

const URL = `http://${IP}:3000/graphql`;