declare module '@expo/vector-icons' {
  import React from 'react';
  
  export interface IconProps {
    name: string;
    size?: number;
    color?: string;
    style?: any;
  }

  export class Ionicons extends React.Component<IconProps> {
    static font: {
      [key: string]: any;
    };
    static glyphMap: {
      [key: string]: any;
    };
  }
  
  export class MaterialIcons extends React.Component<IconProps> {
    static font: {
      [key: string]: any;
    };
    static glyphMap: {
      [key: string]: any;
    };
  }
  
  export class FontAwesome extends React.Component<IconProps> {
    static font: {
      [key: string]: any;
    };
    static glyphMap: {
      [key: string]: any;
    };
  }
}
