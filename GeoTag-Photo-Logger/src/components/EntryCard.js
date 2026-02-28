import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import Animated, { FadeInUp, Layout } from "react-native-reanimated";
import { COLORS, SIZES, SHADOWS } from "../utils/theme";
import { BASE_IMAGE_URL } from "../services/api";

const EntryCard = ({ entry, onPress }) => {
    // Using centralized BASE_IMAGE_URL from api service
    const imageUrl = `${BASE_IMAGE_URL}${entry.imageUrl}`;

    return (
        <Animated.View
            entering={FadeInUp.duration(600).springify()}
            layout={Layout.springify()}
        >
            <TouchableOpacity style={[styles.card, SHADOWS.premium]} onPress={onPress}>
                <Image source={{ uri: imageUrl }} style={styles.image} />
                <View style={styles.content}>
                    <Text style={styles.title} numberOfLines={1}>{entry.title}</Text>
                    {entry.address ? <Text style={styles.address} numberOfLines={1}>{entry.address}</Text> : null}
                    <Text style={styles.description} numberOfLines={2}>{entry.description}</Text>
                    <View style={styles.footer}>
                        <Text style={styles.coords}>
                            {entry.latitude.toFixed(4)}, {entry.longitude.toFixed(4)}
                        </Text>
                        <Text style={styles.date}>
                            {new Date(entry.createdAt).toLocaleDateString()}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.cardSurface,
        borderRadius: SIZES.radius,
        marginBottom: 20,
        overflow: "hidden",
    },
    image: {
        width: "100%",
        height: 200,
        backgroundColor: COLORS.background,
    },
    content: {
        padding: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: COLORS.textPrimary,
    },
    address: {
        fontSize: 14,
        color: COLORS.secondary,
        fontWeight: "600",
        marginTop: 2,
    },
    description: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginTop: 4,
        lineHeight: 20,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 12,
        alignItems: "center",
    },
    coords: {
        fontSize: 12,
        color: COLORS.secondary,
        fontWeight: "600",
    },
    date: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
});

export default EntryCard;
