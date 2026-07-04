import React, { useRef } from 'react';
import {
  TouchableOpacity,
  Image,
  Animated,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../theme';

interface AvatarPickerProps {
  uri?: string | null;
  size?: number;
  onImagePicked: (uri: string) => void;
  editable?: boolean;
}

export function AvatarPicker({
  uri,
  size = 80,
  onImagePicked,
  editable = true,
}: AvatarPickerProps) {
  const { theme } = useTheme();
  const { colors, radii } = theme;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = async () => {
    if (!editable) return;

    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.92, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission Required', 'Camera roll access is needed to pick a photo.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      onImagePicked(result.assets[0].uri);
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} disabled={!editable} activeOpacity={1}>
      <Animated.View
        style={{
          width: size,
          height: size,
          borderRadius: radii.full,
          backgroundColor: colors.surfaceStrong,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          borderWidth: 2,
          borderColor: colors.borderLight,
          transform: [{ scale: scaleAnim }],
        }}
      >
        {uri ? (
          <Image source={{ uri }} style={{ width: size, height: size }} />
        ) : (
          <Ionicons name="person" size={size * 0.45} color={colors.icon} />
        )}
        {editable && (
          <Ionicons
            name="camera"
            size={16}
            color={colors.textInverse}
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              backgroundColor: colors.primary,
              borderRadius: 12,
              padding: 4,
              overflow: 'hidden',
            }}
          />
        )}
      </Animated.View>
    </TouchableOpacity>
  );
}
