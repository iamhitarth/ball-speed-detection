// import { StatusBar } from "expo-status-bar";
import { useEffect, useState, useRef } from "react";
import { Button, StyleSheet, Text, View, Platform } from "react-native";
import {
  useCameraDevice,
  useCameraPermission,
  Camera,
  useCameraFormat,
  FormatFilter,
} from "react-native-vision-camera";
import * as MediaLibrary from "expo-media-library";

export default function App() {
  const device = useCameraDevice("back");
  const { hasPermission, requestPermission } = useCameraPermission();
  const [isRecording, setIsRecording] = useState(false);
  const cameraRef = useRef<Camera>(null); // Add this line to create a ref
  const iosReq: FormatFilter[] = [{ fps: 240 }];
  const androidReq: FormatFilter[] = [{ videoResolution: "max" }];
  const format = useCameraFormat(
    device,
    Platform.OS === "android" ? androidReq : iosReq
  );

  useEffect(() => {
    if (!hasPermission) {
      requestPermission().catch((error) => console.error(error));
    }
  }, [hasPermission, requestPermission]);

  useEffect(() => {
    async function getPermissions() {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
    getPermissions();
  }, []);

  if (!hasPermission)
    return (
      <View>
        <Text>No Permission</Text>
      </View>
    );
  if (device == null)
    return (
      <View>
        <Text>No Camera Device Error</Text>
      </View>
    );

  const startRecording = async () => {
    setIsRecording(true);
    await cameraRef.current.startRecording({
      onRecordingFinished: async (video) => {
        console.log(video);
        const asset = await MediaLibrary.createAssetAsync(video.path);
        await MediaLibrary.createAlbumAsync("BallSpeedDetection", asset, false);
        console.log("Video saved to camera roll");
      },
      onRecordingError: (error) => console.error(error),
    });
  };

  const stopRecording = async () => {
    await cameraRef.current.stopRecording();
    setIsRecording(false);
  };

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        fps={240}
        format={format}
        video={true}
      />
      {!isRecording && (
        <View style={{ position: "absolute", bottom: 20 }}>
          <Button
            title="Start Recording"
            onPress={startRecording}
            disabled={isRecording}
          />
        </View>
      )}
      {isRecording && (
        <View style={{ position: "absolute", bottom: 20 }}>
          <Button
            title="Stop Recording"
            onPress={stopRecording}
            disabled={!isRecording}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
