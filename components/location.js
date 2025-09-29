// import React, { useState, useEffect } from "react";
// import { View, Text, Button, StyleSheet } from "react-native";
// import * as Location from "expo-location";

// export default function location() {
//   const [location, setLocation] = useState(null);
//   const [errorMsg, setErrorMsg] = useState(null);

//   const getLocation = async () => {
//     // Ask for permission
//     let { status } = await Location.requestForegroundPermissionsAsync();
//     if (status !== "granted") {
//       setErrorMsg("Permission to access location was denied");
//       return;
//     }

//     // Get current position
//     let currentLocation = await Location.getCurrentPositionAsync({});
//     setLocation(currentLocation);
//   };

//   useEffect(() => {
//     getLocation();
//   }, []);

//   return (
//     <View style={styles.container}>
//       <Text style={styles.text}>
//         {errorMsg
//           ? errorMsg
//           : location
//           ? `Latitude: ${location.coords.latitude}, Longitude: ${location.coords.longitude}`
//           : "Fetching location..."}
//       </Text>
//       <Button title="Refresh Location" onPress={getLocation} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, alignItems: "center", justifyContent: "center" },
//   text: { fontSize: 16, marginBottom: 20 },
// });
