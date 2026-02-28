import React from "react";
import { AuthProvider } from "./src/context/AuthContext";
import AppNavigator from "./src/navigation/AppNavigator";
import { registerRootComponent } from "expo";
import "react-native-gesture-handler";
import Toast from "react-native-toast-message";

const App = () => {
    return (
        <AuthProvider>
            <AppNavigator />
            <Toast />
        </AuthProvider>
    );
};

export default registerRootComponent(App);
