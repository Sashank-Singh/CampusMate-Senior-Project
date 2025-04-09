import { ActivityIndicator, View } from 'react-native';

export default function AuthLoading() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#2F614A" />
    </View>
  );
} 