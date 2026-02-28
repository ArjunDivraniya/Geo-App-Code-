import React, { useState, useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { AuthContext } from "../context/AuthContext";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import { COLORS } from "../utils/theme";
import Toast from "react-native-toast-message";

const RegisterScreen = ({ navigation }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { register } = useContext(AuthContext);

    const handleRegister = async () => {
        if (!name || !email || !password || !confirmPassword) {
            return Toast.show({
                type: "info",
                text1: "Required",
                text2: "Please fill all fields"
            });
        }
        if (password !== confirmPassword) {
            return Toast.show({
                type: "error",
                text1: "Mismatch",
                text2: "Passwords do not match"
            });
        }

        setLoading(true);
        try {
            await register(name, email, password);
        } catch (err) {
            Toast.show({
                type: "error",
                text1: "Registration Error",
                text2: err.response?.data?.message || "Registration failed"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Text style={styles.backText}>← Back</Text>
                    </TouchableOpacity>

                    <View style={styles.header}>
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>Start logging your journey today</Text>
                    </View>

                    <View style={styles.form}>
                        <CustomInput
                            placeholder="Full Name"
                            value={name}
                            onChangeText={setName}
                        />
                        <CustomInput
                            placeholder="Email Address"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        <CustomInput
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                        <CustomInput
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                        />

                        <CustomButton title="Register" onPress={handleRegister} loading={loading} style={styles.button} />

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Already have an account? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                                <Text style={styles.link}>Login</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        flexGrow: 1,
        padding: 24,
    },
    backButton: {
        marginTop: 10,
        marginBottom: 20,
    },
    backText: {
        color: COLORS.primary,
        fontSize: 16,
        fontWeight: "600",
    },
    header: {
        marginBottom: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        color: COLORS.textPrimary,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.textSecondary,
        marginTop: 8,
    },
    form: {
        width: "100%",
    },
    button: {
        marginTop: 20,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 30,
    },
    footerText: {
        color: COLORS.textSecondary,
    },
    link: {
        color: COLORS.primary,
        fontWeight: "600",
    },
});

export default RegisterScreen;
