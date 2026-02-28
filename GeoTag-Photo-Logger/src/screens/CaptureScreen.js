import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, ScrollView, SafeAreaView, ActivityIndicator } from "react-native";
import { Camera, CameraView, useCameraPermissions } from "expo-camera";
import * as Location from "expo-location";
import * as ImageManipulator from "expo-image-manipulator";
import Toast from "react-native-toast-message";
import { COLORS, SIZES, SHADOWS } from "../utils/theme";
import CustomButton from "../components/CustomButton";
import { Ionicons } from "@expo/vector-icons";
import API from "../services/api";

const CaptureScreen = ({ navigation }) => {
    const [permission, requestPermission] = useCameraPermissions();
    const [locationPermission, requestLocationPermission] = Location.useForegroundPermissions();
    const [photo, setPhoto] = useState(null);
    const [location, setLocation] = useState(null);
    const [address, setAddress] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isCapturing, setIsCapturing] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isGettingLocation, setIsGettingLocation] = useState(false);

    const cameraRef = useRef(null);

    useEffect(() => {
        (async () => {
            await requestPermission();
            await requestLocationPermission();
        })();
    }, []);

    const takePicture = async () => {
        if (cameraRef.current) {
            setIsCapturing(true);
            try {
                const photoData = await cameraRef.current.takePictureAsync({ quality: 0.8 });

                // Compress image further
                const manipulated = await ImageManipulator.manipulateAsync(
                    photoData.uri,
                    [{ resize: { width: 1200 } }],
                    { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
                );

                setPhoto(manipulated);
                getLocation();
            } catch (e) {
                Toast.show({
                    type: "error",
                    text1: "Error",
                    text2: "Failed to take picture"
                });
            } finally {
                setIsCapturing(false);
            }
        }
    };

    const getLocation = async () => {
        setIsGettingLocation(true);
        try {
            const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
            setLocation(loc);

            // Perform Reverse Geocoding
            const reverse = await Location.reverseGeocodeAsync({
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
            });
            if (reverse.length > 0) {
                const addr = reverse[0];
                setAddress(`${addr.name || ""}, ${addr.city || ""}, ${addr.region || ""}`.replace(/^, /, ""));
            }
        } catch (e) {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "Could not get location"
            });
        } finally {
            setIsGettingLocation(false);
        }
    };

    const handleUpload = async () => {
        if (!title || !photo || !location) {
            return Toast.show({
                type: "info",
                text1: "Missing Info",
                text2: "Please ensure title, photo, and location are present."
            });
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("latitude", location.coords.latitude.toString());
        formData.append("longitude", location.coords.longitude.toString());
        formData.append("address", address);

        const filename = photo.uri.split("/").pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;

        formData.append("image", {
            uri: photo.uri,
            name: filename,
            type: type,
        });

        try {
            await API.post("/entries", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            Toast.show({
                type: "success",
                text1: "Success",
                text2: "Log uploaded successfully!"
            });
            navigation.navigate("Home");
        } catch (err) {
            console.error(err);
            Toast.show({
                type: "error",
                text1: "Upload Failed",
                text2: err.response?.data?.message || "Something went wrong"
            });
        } finally {
            setIsUploading(false);
        }
    };

    if (!permission || !locationPermission) {
        return <View style={styles.center}><ActivityIndicator color={COLORS.primary} /></View>;
    }

    if (!permission.granted || !locationPermission.granted) {
        return (
            <View style={styles.center}>
                <Text style={styles.permissionText}>We need camera and location permissions</Text>
                <CustomButton title="Grant Permission" onPress={() => { requestPermission(); requestLocationPermission(); }} />
            </View>
        );
    }

    if (photo) {
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <Image source={{ uri: photo.uri }} style={styles.previewImage} />

                    <View style={styles.form}>
                        <Text style={styles.label}>Log Entry Details</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Title (e.g., Beach Sunset)"
                            placeholderTextColor={COLORS.textSecondary}
                            value={title}
                            onChangeText={setTitle}
                        />
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Description (Optional)"
                            placeholderTextColor={COLORS.textSecondary}
                            value={description}
                            onChangeText={setDescription}
                            multiline
                            numberOfLines={3}
                        />

                        <View style={styles.locationInfo}>
                            <Ionicons name="location" size={20} color={COLORS.secondary} />
                            <View style={{ marginLeft: 10 }}>
                                <Text style={styles.locationText}>
                                    {isGettingLocation ? "Fetching coordinates..." : location ? `${location.coords.latitude.toFixed(6)}, ${location.coords.longitude.toFixed(6)}` : "No location data"}
                                </Text>
                                {location && (
                                    <Text style={styles.accuracyText}>
                                        Accuracy: ±{location.coords.accuracy?.toFixed(1) || 0}m
                                    </Text>
                                )}
                                {address ? <Text style={styles.addressText}>{address}</Text> : null}
                            </View>
                        </View>

                        <View style={styles.actions}>
                            <TouchableOpacity style={styles.retakeButton} onPress={() => setPhoto(null)}>
                                <Text style={styles.retakeText}>Retake</Text>
                            </TouchableOpacity>
                            <CustomButton
                                title="Upload Log"
                                onPress={handleUpload}
                                loading={isUploading}
                                style={styles.uploadButton}
                            />
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }

    return (
        <View style={styles.container}>
            <CameraView style={styles.camera} ref={cameraRef}>
                <View style={styles.cameraUI}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Ionicons name="close-circle" size={40} color={COLORS.white} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.captureButton}
                        onPress={takePicture}
                        disabled={isCapturing}
                    >
                        <View style={styles.captureInner} />
                    </TouchableOpacity>
                </View>
            </CameraView>
        </View>
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
        padding: 20,
        backgroundColor: COLORS.background,
    },
    permissionText: {
        color: COLORS.textPrimary,
        fontSize: 18,
        textAlign: "center",
        marginBottom: 20,
    },
    camera: {
        flex: 1,
    },
    cameraUI: {
        flex: 1,
        backgroundColor: "transparent",
        justifyContent: "space-between",
        padding: 30,
    },
    backButton: {
        alignSelf: "flex-start",
    },
    captureButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 6,
        borderColor: COLORS.white,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        marginBottom: 20,
    },
    captureInner: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: COLORS.white,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    previewImage: {
        width: "100%",
        height: 400,
        backgroundColor: COLORS.cardSurface,
    },
    form: {
        padding: 20,
    },
    label: {
        fontSize: 22,
        fontWeight: "bold",
        color: COLORS.textPrimary,
        marginBottom: 20,
    },
    input: {
        backgroundColor: COLORS.cardSurface,
        borderRadius: SIZES.radius,
        padding: 15,
        color: COLORS.textPrimary,
        fontSize: 16,
        marginBottom: 15,
    },
    textArea: {
        height: 100,
        textAlignVertical: "top",
    },
    locationInfo: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 25,
    },
    locationText: {
        color: COLORS.textSecondary,
        fontSize: 14,
    },
    accuracyText: {
        color: COLORS.textSecondary,
        fontSize: 12,
        fontWeight: "bold",
        fontStyle: "italic",
        marginBottom: 2,
    },
    addressText: {
        color: COLORS.secondary,
        fontSize: 12,
        marginTop: 2,
        fontWeight: "500",
    },
    actions: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    retakeButton: {
        flex: 1,
        marginRight: 15,
        height: 55,
        justifyContent: "center",
        alignItems: "center",
    },
    retakeText: {
        color: COLORS.error,
        fontSize: 18,
        fontWeight: "600",
    },
    uploadButton: {
        flex: 2,
    },
});

export default CaptureScreen;
