import React from 'react';
import { Image, ImageProps, ImageStyle, StyleProp } from 'react-native';

interface AppImageProps extends Omit<ImageProps, 'source'> {
  name: string;
  type?: 'image' | 'icon';
  width?: number;
  height?: number;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'center';
  style?: StyleProp<ImageStyle>;
}

export const AppImage: React.FC<AppImageProps> = ({
  name,
  type = 'image',
  width = 100,
  height = 100,
  resizeMode = 'contain',
  style,
  ...props
}) => {
  // Import assets
  const { IMAGES, ICONS } = require('../assets');
  const assets = type === 'icon' ? ICONS : IMAGES;

  if (!assets[name]) {
    console.warn(`Image not found: ${name}`);
    return null;
  }

  return (
    <Image
      source={assets[name]}
      style={[
        {
          width,
          height,
        },
        style,
      ]}
      resizeMode={resizeMode}
      {...props}
    />
  );
};
