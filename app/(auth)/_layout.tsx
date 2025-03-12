import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { useEffect } from 'react';

export default function AuthLayout() {
  const { isSignedIn } = useAuth();
  
  useEffect(() => {
    console.log('=== Auth Layout Debug Information ===');
    console.log('Auth State:', {
      isSignedIn: isSignedIn ? 'Yes' : 'No',
      layoutMounted: 'Yes',
      timestamp: new Date().toISOString(),
    });
    console.log('================================');
  }, [isSignedIn]);

  if (isSignedIn) {
    console.log('Redirecting to tabs due to signed in state');
    return <Redirect href="/(tabs)" />;
  }
  
  return (
    <Stack 
      screenOptions={{ 
        headerShown: false,
        animation: 'slide_from_right'
      }} 
    >
      <Stack.Screen 
        name="LoginScreen" 
        options={{
          title: 'Login',
        }}
      />
      <Stack.Screen 
        name="SignUp" 
        options={{
          title: 'Sign Up',
        }}
      />
    </Stack>
  );
}