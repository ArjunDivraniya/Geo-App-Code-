import React from "react";
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from "react-native";
import { COLORS, SIZES, SHADOWS } from "../utils/theme";

const CustomButton = ({ title, onPress, loading, style, textStyle }) => {
    return (
        <TouchableOpacity
            style={[styles.button, SHADOWS.premium, style]}
            onPress={onPress}
            disabled={loading}
        >
            {loading ? (
                <ActivityIndicator color={COLORS.white} />
            ) : (
                <Text style={[styles.text, textStyle]}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: COLORS.primary,
        borderRadius: SIZES.radius,
        height: 55,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        marginVertical: 10,
    },
    text: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: "600",
    },
});

export default CustomButton;
