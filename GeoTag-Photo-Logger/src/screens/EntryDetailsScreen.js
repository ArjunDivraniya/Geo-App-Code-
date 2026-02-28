import React from "react";
import { View, Text, StyleSheet, Image, ScrollView, SafeAreaView, TouchableOpacity, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { COLORS, SIZES, SHADOWS } from "../utils/theme";
import { Ionicons } from "@expo/vector-icons";
import API, { BASE_IMAGE_URL } from "../services/api";
import Toast from "react-native-toast-message";

const EntryDetailsScreen = ({ route, navigation }) => {
    const { entry } = route.params;
    const imageUrl = `${BASE_IMAGE_URL}${entry.imageUrl}`;

    const handleDelete = () => {
        Alert.alert(
            "Delete Log",
            "Are you sure you want to delete this geotagged photo?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await API.delete(`/entries/${entry._id}`);
                            Toast.show({
                                type: "success",
                                text1: "Deleted",
                                text2: "Entry removed successfully"
                            });
                            navigation.goBack();
                        } catch (err) {
                            Toast.show({
                                type: "error",
                                text1: "Error",
                                text2: "Failed to delete entry"
                            });
                        }
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Image source={{ uri: imageUrl }} style={styles.image} />

                <View style={styles.content}>
                    <View style={styles.header}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.title}>{entry.title}</Text>
                            <Text style={styles.date}>
                                Captured on {new Date(entry.createdAt).toLocaleDateString()}
                            </Text>
                        </View>
                        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                            <Ionicons name="trash-outline" size={24} color={COLORS.error} />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.description}>{entry.description || "No description provided."}</Text>

                    <View style={styles.divider} />

                    <Text style={styles.sectionTitle}>Location Details</Text>
                    {entry.address ? (
                        <View style={styles.locationRow}>
                            <Ionicons name="map-outline" size={20} color={COLORS.secondary} />
                            <Text style={styles.addressTextFull}>{entry.address}</Text>
                        </View>
                    ) : null}
                    <View style={styles.locationRow}>
                        <Ionicons name="location" size={20} color={COLORS.secondary} />
                        <Text style={styles.locationText}>
                            {entry.latitude.toFixed(6)}, {entry.longitude.toFixed(6)}
                        </Text>
                    </View>

                    <View style={[styles.mapContainer, SHADOWS.premium]}>
                        <MapView
                            style={styles.map}
                            initialRegion={{
                                latitude: entry.latitude,
                                longitude: entry.longitude,
                                latitudeDelta: 0.01,
                                longitudeDelta: 0.01,
                            }}
                        >
                            <Marker
                                coordinate={{
                                    latitude: entry.latitude,
                                    longitude: entry.longitude,
                                }}
                                title={entry.title}
                            />
                        </MapView>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    image: {
        width: "100%",
        height: 350,
        backgroundColor: COLORS.cardSurface,
    },
    content: {
        padding: 24,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: COLORS.textPrimary,
    },
    date: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginTop: 4,
    },
    deleteButton: {
        padding: 8,
    },
    description: {
        fontSize: 16,
        color: COLORS.textPrimary,
        lineHeight: 24,
        marginBottom: 24,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.cardSurface,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: COLORS.textPrimary,
        marginBottom: 12,
    },
    locationRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    locationText: {
        color: COLORS.secondary,
        fontSize: 16,
        fontWeight: "600",
        marginLeft: 8,
    },
    addressTextFull: {
        color: COLORS.textPrimary,
        fontSize: 16,
        marginLeft: 8,
        flex: 1,
    },
    mapContainer: {
        height: 250,
        width: "100%",
        borderRadius: SIZES.radius,
        overflow: "hidden",
    },
    map: {
        flex: 1,
    },
});

export default EntryDetailsScreen;
