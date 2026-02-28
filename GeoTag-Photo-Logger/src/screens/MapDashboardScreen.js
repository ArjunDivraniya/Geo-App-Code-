import React, { useState, useEffect } from "react";
import { View, StyleSheet, SafeAreaView, TouchableOpacity, Text, ActivityIndicator, Image } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import { COLORS, SIZES, SHADOWS } from "../utils/theme";
import { Ionicons } from "@expo/vector-icons";
import API, { BASE_IMAGE_URL } from "../services/api";

const MapDashboardScreen = ({ navigation }) => {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEntries();
    }, []);

    const fetchEntries = async () => {
        try {
            const res = await API.get("/entries");
            setEntries(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: entries.length > 0 ? entries[0].latitude : 20.5937,
                    longitude: entries.length > 0 ? entries[0].longitude : 78.9629,
                    latitudeDelta: 0.1,
                    longitudeDelta: 0.1,
                }}
            >
                {entries.map((entry) => (
                    <Marker
                        key={entry._id}
                        coordinate={{
                            latitude: entry.latitude,
                            longitude: entry.longitude,
                        }}
                    >
                        <View style={styles.markerContainer}>
                            <Image
                                source={{ uri: `${BASE_IMAGE_URL}${entry.imageUrl}` }}
                                style={styles.markerImage}
                            />
                        </View>
                        <Callout onPress={() => navigation.navigate("EntryDetails", { entry })}>
                            <View style={styles.callout}>
                                <Text style={styles.calloutTitle}>{entry.title}</Text>
                                <Text style={styles.calloutText} numberOfLines={2}>{entry.description}</Text>
                                <Text style={styles.calloutLink}>View Details →</Text>
                            </View>
                        </Callout>
                    </Marker>
                ))}
            </MapView>

            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color={COLORS.white} />
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.background,
    },
    map: {
        flex: 1,
    },
    backButton: {
        position: "absolute",
        top: 50,
        left: 20,
        backgroundColor: COLORS.primary,
        padding: 12,
        borderRadius: 30,
        ...SHADOWS.premium,
    },
    callout: {
        width: 200,
        padding: 10,
    },
    calloutTitle: {
        fontWeight: "bold",
        fontSize: 16,
        color: COLORS.black,
    },
    calloutText: {
        fontSize: 12,
        color: "#666",
        marginVertical: 4,
    },
    calloutLink: {
        fontSize: 12,
        color: COLORS.primary,
        fontWeight: "600",
    },
    markerContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: COLORS.white,
        borderWidth: 3,
        borderColor: COLORS.primary,
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
        ...SHADOWS.premium,
    },
    markerImage: {
        width: "100%",
        height: "100%",
    },
});

export default MapDashboardScreen;
