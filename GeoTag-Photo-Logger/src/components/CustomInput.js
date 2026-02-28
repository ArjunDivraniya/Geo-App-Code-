import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { COLORS, SIZES } from "../utils/theme";

const CustomInput = ({ value, onChangeText, placeholder, secureTextEntry, ...props }) => {
    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={COLORS.textSecondary}
                secureTextEntry={secureTextEntry}
                {...props}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        backgroundColor: COLORS.cardSurface,
        borderRadius: SIZES.radius,
        paddingHorizontal: 15,
        marginVertical: 10,
        height: 55,
        justifyContent: "center",
    },
    input: {
        color: COLORS.textPrimary,
        fontSize: 16,
    },
});

export default CustomInput;
