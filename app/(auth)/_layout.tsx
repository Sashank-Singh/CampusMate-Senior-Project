import { Redirect, Stack } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { usePathname } from "expo-router";

export default function AuthLayout() {
  const { isSignedIn, isLoaded } = useAuth();
  const pathname = usePathname(); // ✅ Get current route

  if (!isLoaded) return null; // ✅ Prevent flickering

  // ✅ Ensure correct navigation logic
  if (isSignedIn && pathname.startsWith("/(auth)")) {
    return <Redirect href="../tabs" />; // ✅ Fixed redirect to relative path
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" />
      <Stack.Screen name="SignUp" />
    </Stack>
  );
}

