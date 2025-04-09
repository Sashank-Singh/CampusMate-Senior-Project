import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SafeIconProps {
  name: string;
  size: number;
  color: string;
  style?: any;
}

const SafeIcon: React.FC<SafeIconProps> = ({ name, size, color, style }) => {
  try {
    // Try to render the icon
    return <Ionicons name={name as any} size={size} color={color} style={style} />;
  } catch (error) {
    console.error(`Error rendering icon "${name}":`, error);
    
    // Fallback to a simple colored box with the icon name
    return (
      <View 
        style={{
          width: size,
          height: size,
          backgroundColor: '#f0f0f0',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: size / 8,
          ...style
        }}
      >
        <Text style={{ fontSize: size / 4, color }}>
          {typeof name === 'string' ? name.slice(0, 2) : '?'}
        </Text>
      </View>
    );
  }
};

export default SafeIcon; 