// import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import {
  useCameraDevice,
  useCameraPermission,
  Camera,
} from "react-native-vision-camera";

export default function App() {
  const device = useCameraDevice("back");
  const { hasPermission } = useCameraPermission();

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
  return (
    <View style={styles.container}>
      <Camera style={StyleSheet.absoluteFill} device={device} isActive={true} />
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
