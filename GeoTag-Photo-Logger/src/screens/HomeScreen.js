import React, { useState, useEffect, useCallback, useContext } from "react";
import { View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity, SafeAreaView, ActivityIndicator, Platform } from "react-native";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";
import EntryCard from "../components/EntryCard";
import { COLORS, SIZES, SHADOWS } from "../utils/theme";
import { Ionicons } from "@expo/vector-icons";

const HomeScreen = ({ navigation }) => {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const { logout } = useContext(AuthContext);

    const fetchEntries = async () => {
        try {
            const res = await API.get("/entries");
            setEntries(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchEntries();

        // Refresh entries when returning to home screen
        const unsubscribe = navigation.addListener("focus", () => {
            fetchEntries();
        });
        return unsubscribe;
    }, [navigation]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchEntries();
    }, []);

    const renderItem = ({ item }) => (
        <EntryCard
            entry={item}
            onPress={() => navigation.navigate("EntryDetails", { entry: item })}
        />
    );

    return (
        <SafeAreaView style={styles.container}>
            {loading && !refreshing ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            ) : (
                <FlatList
                    data={entries}
                    renderItem={renderItem}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons name="camera-outline" size={80} color={COLORS.textSecondary} />
                            <Text style={styles.emptyText}>No logs yet. Start capturing!</Text>
                        </View>
                    }
                />
            )}

            <TouchableOpacity
                style={[styles.fab, styles.mapFab, SHADOWS.premium]}
                onPress={() => navigation.navigate("MapDashboard")}
            >
                <Ionicons name="map" size={28} color={COLORS.white} />
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.fab, SHADOWS.premium]}
                onPress={() => navigation.navigate("Capture")}
            >
                <Ionicons name="add" size={32} color={COLORS.white} />
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.logoutButton}
                onPress={logout}
            >
                <Ionicons name="log-out-outline" size={24} color={COLORS.textSecondary} />
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
    },
    listContent: {
        padding: 20,
        paddingBottom: 100,
    },
    fab: {
        position: "absolute",
        right: 20,
        bottom: 30,
        backgroundColor: COLORS.primary,
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10,
    },
    mapFab: {
        bottom: 110,
        backgroundColor: COLORS.secondary,
    },
    logoutButton: {
        position: "absolute",
        top: Platform.OS === "ios" ? 10 : 10,
        right: 20,
        zIndex: 10,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 100,
    },
    emptyText: {
        color: COLORS.textSecondary,
        fontSize: 18,
        marginTop: 16,
        textAlign: "center",
    },
});

export default HomeScreen;
