// app/_layout.tsx
import { Stack } from "expo-router";
import "../app/globals.css";

export default function RootLayout() {
  return <Stack screenOptions={{ headerShown: true }} />;
}
