// import { StatusBar } from "expo-status-bar";
import { useEffect, useState, useRef } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import {
  useCameraDevice,
  useCameraPermission,
  Camera,
} from "react-native-vision-camera";
import * as FileSystem from "expo-file-system";

export default function App() {
  const device = useCameraDevice("back");
  const { hasPermission, requestPermission } = useCameraPermission();
  const [isRecording, setIsRecording] = useState(false);
  const cameraRef = useRef<Camera>(null); // Add this line to create a ref

  useEffect(() => {
    if (!hasPermission) {
      requestPermission().catch((error) => console.error(error));
    }
  }, [hasPermission, requestPermission]);

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
      onRecordingFinished: (video) => console.log(video),
      onRecordingError: (error) => console.error(error)
    })
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
