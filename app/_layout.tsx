// app/_layout.tsx
import { Stack } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen 
          name="(tabs)" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="screens/LibraryDetails" 
          options={{ 
            title: 'Library',
            headerStyle: {
              backgroundColor: '#1B5E20',
            },
            headerTintColor: '#fff',
            presentation: 'modal'
          }} 
        />
        <Stack.Screen 
          name="screens/CafeteriaDetails" 
          options={{ 
            title: 'Cafeteria',
            headerStyle: {
              backgroundColor: '#1B5E20',
            },
            headerTintColor: '#fff',
            presentation: 'modal'
          }} 
        />
        <Stack.Screen 
          name="screens/GymDetails" 
          options={{ 
            title: 'Gym',
            headerStyle: {
              backgroundColor: '#1B5E20',
            },
            headerTintColor: '#fff',
            presentation: 'modal'
          }} 
        />
        <Stack.Screen 
          name="screens/StudentCenterDetails" 
          options={{ 
            title: 'Student Center',
            headerStyle: {
              backgroundColor: '#1B5E20',
            },
            headerTintColor: '#fff',
            presentation: 'modal'
          }} 
        />
      </Stack>
    </ThemeProvider>
  );
}