import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { AppImage } from './AppImage';
import { IMAGES } from '../assets';

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  thumb: {
    width: 100,
    height: 100,
  },
  section: {
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

/**
 * Examples for using images in the project
 *
 * Three ways to use images:
 * 1. Direct import (simplest)
 * 2. AppImage component (recommended)
 * 3. Conditional rendering
 */

// METHOD 1: Direct import and use
export const Method1Example = () => (
  <View style={styles.container}>
    <Image source={IMAGES.loginBg} style={styles.thumb} resizeMode="contain" />
  </View>
);

// METHOD 2: Using AppImage component (RECOMMENDED)
export const Method2Example = () => (
  <View style={styles.container}>
    <AppImage
      name="loginBg"
      type="image"
      width={100}
      height={100}
      resizeMode="contain"
    />
  </View>
);

// METHOD 3: Using icons
export const Method3Example = () => (
  <View style={styles.container}>
    <AppImage
      name="back"
      type="icon"
      width={24}
      height={24}
    />
    <AppImage
      name="search"
      type="icon"
      width={24}
      height={24}
    />
  </View>
);
