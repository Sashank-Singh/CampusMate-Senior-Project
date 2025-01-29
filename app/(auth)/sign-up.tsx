import { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';
import { Link } from 'expo-router';

export default function SignUpScreen() {
  const { isLoaded, signUp } = useSignUp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    if (!isLoaded) return;

    try {
      await signUp.create({
        emailAddress: email,
        password,
      });
      
      // Send verification email
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <TextInput 
        placeholder="Email" 
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Sign Up" onPress={handleSignUp} />
      <Link href="/sign-in" asChild>
        <Text style={{ marginTop: 10 }}>Already have an account? Sign In</Text>
      </Link>
    </View>
  );
}