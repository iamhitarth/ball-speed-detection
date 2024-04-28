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
  const cameraRef = useRef(null); // Add this line to create a ref

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
    if (cameraRef.current) {
      setIsRecording(true);
      const video = await cameraRef.current.startRecording({
        onRecordingFinished: (video) => {
          // Save the video to local storage
          // You can use 'react-native-fs' or Expo's 'FileSystem' API to save the video file
        },
        onRecordingError: (error) => console.error(error),
      });
    }
  };

  const stopRecording = async () => {
    if (cameraRef.current && isRecording) {
      const video = await cameraRef.current.stopRecording();
      // Save the video to local storage
      const uri = video.path; // This is the local URI to the recorded video
      const newUri = FileSystem.documentDirectory + "video.mp4";
      await FileSystem.moveAsync({
        from: uri,
        to: newUri,
      });
      setIsRecording(false);
    }
  };

  const saveVideo = async (videoUri) => {
    const fileInfo = await FileSystem.getInfoAsync(videoUri);
    if (fileInfo.exists) {
      const newUri = FileSystem.documentDirectory + `${Date.now()}_video.mp4`;
      await FileSystem.moveAsync({
        from: videoUri,
        to: newUri,
      });
      console.log("Video saved to:", newUri);
    }
  };
  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        video
      />
      {!isRecording && <View style={{ position: "absolute", bottom: 20 }}>
        <Button
          title="Start Recording"
          onPress={startRecording}
          disabled={isRecording}
        />
      </View>}
      {isRecording && <View style={{ position: "absolute", bottom: 20 }}>
        <Button
          title="Stop Recording"
          onPress={stopRecording}
          disabled={!isRecording}
        />
      </View>}
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
