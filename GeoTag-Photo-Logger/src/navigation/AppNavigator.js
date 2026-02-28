import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthContext } from "../context/AuthContext";
import { ActivityIndicator, View } from "react-native";
import { COLORS } from "../utils/theme";

// Screens
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeScreen from "../screens/HomeScreen";
import CaptureScreen from "../screens/CaptureScreen";
import EntryDetailsScreen from "../screens/EntryDetailsScreen";
import MapDashboardScreen from "../screens/MapDashboardScreen";

const Stack = createStackNavigator();

const AppNavigator = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return (
            <View style={{ flex: 1, backgroundColor: COLORS.background, justifyContent: "center" }}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerStyle: {
                        backgroundColor: COLORS.background,
                        elevation: 0,
                        shadowOpacity: 0,
                    },
                    headerTintColor: COLORS.textPrimary,
                    headerTitleStyle: {
                        fontWeight: "bold",
                    },
                    cardStyle: { backgroundColor: COLORS.background },
                }}
            >
                {user ? (
                    <>
                        <Stack.Screen name="Home" component={HomeScreen} options={{ title: "GeoLogs" }} />
                        <Stack.Screen name="Capture" component={CaptureScreen} options={{ title: "New Entry" }} />
                        <Stack.Screen name="EntryDetails" component={EntryDetailsScreen} options={{ title: "Details" }} />
                        <Stack.Screen name="MapDashboard" component={MapDashboardScreen} options={{ headerShown: false }} />
                    </>
                ) : (
                    <>
                        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
