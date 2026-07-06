import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useTheme } from '../../theme';
import { Card, Button } from '../../components';
import { useAuthStore } from '../../stores/authStore';
import { logEvent } from '../../lib/analytics';
import type { CheckerScreenProps, SkinConditionContent } from '../../navigation/types';

interface PredictionResponse {
  predicted: boolean;
  detected_class: string | null;
  confidence: number | null;
  confidence_passed: boolean;
  session_id: string;
  message?: string;
  condition_content: SkinConditionContent | null;
}

export function SkinCheckCameraScreen({ navigation, route }: CheckerScreenProps<'SkinCheckCamera'>) {
  const { theme } = useTheme();
  const { colors, spacing, radii } = theme;
  const { inputMethod } = route.params;

  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [galleryPermission, setGalleryPermission] = useState<boolean | null>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    if (inputMethod === 'gallery') {
      checkGalleryPermission();
    }
  }, [inputMethod]);

  const checkGalleryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    setGalleryPermission(status === 'granted');
    if (status === 'granted') {
      pickFromGallery();
    }
  };

  const pickFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.8,
        allowsEditing: false,
      });

      if (!result.canceled && result.assets.length > 0) {
        setImageUri(result.assets[0].uri);
      } else {
        navigation.goBack();
      }
    } catch {
      Alert.alert('Error', 'Could not open gallery. Please try again.');
    }
  };

  const handleTakePhoto = async () => {
    if (!cameraRef.current) return;

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
      });

      if (photo?.uri) {
        setImageUri(photo.uri);
      }
    } catch {
      Alert.alert('Error', 'Could not take photo. Please try again.');
    }
  };

  const handleRetake = () => {
    setImageUri(null);
    if (inputMethod === 'gallery') {
      pickFromGallery();
    }
  };

  const handleSubmit = async () => {
    if (!imageUri) return;

    setIsProcessing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      const formData = new FormData();
      const filename = imageUri.split('/').pop() || 'skin_image.jpg';
      const ext = filename.split('.').pop()?.toLowerCase() || 'jpg';
      const mimeType = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';

      formData.append('file', {
        uri: imageUri,
        name: filename,
        type: mimeType,
      } as any);

      const accessToken = useAuthStore.getState().accessToken;
      const baseUrl = __DEV__
        ? 'http://10.0.2.2:8000/api/v1'
        : 'https://api.babyguide.ph/api/v1';
      const url = `${baseUrl}/skin-check/predict?input_method=${inputMethod}&disclaimer_acknowledged=true`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {}),
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.detail || 'Analysis failed');
      }

      const data: PredictionResponse = await response.json();

      logEvent('skin_check_completed', {
        input_method: inputMethod,
        predicted: data.predicted,
        confidence: data.confidence,
        detected_class: data.detected_class,
      });

      navigation.navigate('SkinCheckResult', {
        sessionId: data.session_id,
        detectedClass: data.detected_class || undefined,
        confidence: data.confidence || undefined,
        conditionContent: data.condition_content,
        predicted: data.predicted,
        message: data.message,
      });
    } catch (error: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        'Analysis Failed',
        error.message || 'Unable to analyze the image. Please check your connection and try again.',
        [
          { text: 'Try Again', onPress: () => setIsProcessing(false) },
          { text: 'Cancel', onPress: () => navigation.goBack(), style: 'destructive' },
        ]
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBack = () => {
    if (imageUri) {
      handleRetake();
    } else {
      navigation.goBack();
    }
  };

  // ── Loading / Processing overlay ──
  if (isProcessing) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl }}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 18, color: colors.textPrimary, marginTop: spacing.lg }}>
            Analyzing image...
          </Text>
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.sm, lineHeight: 20 }}>
            Our AI is screening the image for{'\n'}common skin conditions
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // ── Image preview state (after capture/selection) ──
  if (imageUri) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={{ flex: 1 }}>
          {/* Header */}
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.base, paddingTop: 8, paddingBottom: spacing.sm }}>
            <TouchableOpacity onPress={handleRetake} style={{ height: 44, width: 44, justifyContent: 'center' }}>
              <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 18, lineHeight: 25, color: colors.textPrimary, flex: 1, marginLeft: 4 }}>
              Preview Image
            </Text>
          </View>

          <Image
            source={{ uri: imageUri }}
            style={{ flex: 1, resizeMode: 'contain', marginHorizontal: spacing.base }}
          />

          <View style={{ padding: spacing.base }}>
            <Button
              title="Analyze This Image"
              onPress={handleSubmit}
              fullWidth
              icon={<Ionicons name="scan-outline" size={16} color="#fff" />}
            />
            <View style={{ height: spacing.sm }} />
            <Button
              title="Retake"
              onPress={handleRetake}
              variant="secondary"
              fullWidth
              icon={<Ionicons name="camera-reverse-outline" size={16} color={colors.textPrimary} />}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // ── Camera view (default for 'camera' method) ──
  if (inputMethod === 'camera') {
    if (!cameraPermission) {
      return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl }}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        </SafeAreaView>
      );
    }

    if (!cameraPermission.granted) {
      return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl }}>
            <View
              style={{
                width: 88,
                height: 88,
                borderRadius: radii.xl,
                backgroundColor: colors.surfaceStrong,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: spacing.base,
              }}
            >
              <Ionicons name="camera-outline" size={44} color={colors.iconActive} />
            </View>
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 20, color: colors.textPrimary, textAlign: 'center', marginBottom: spacing.sm }}>
              Camera Access Needed
            </Text>
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, color: colors.textSecondary, textAlign: 'center', lineHeight: 20, marginBottom: spacing.lg }}>
              We need camera access to take a photo of your baby's skin. Your photos are processed securely and are not stored without your consent.
            </Text>
            <Button
              title="Grant Camera Access"
              onPress={requestCameraPermission}
              fullWidth
            />
            <View style={{ height: spacing.sm }} />
            <Button
              title="Upload from Gallery Instead"
              onPress={() => navigation.navigate('SkinCheckCamera', { inputMethod: 'gallery' })}
              variant="secondary"
              fullWidth
            />
          </View>
        </SafeAreaView>
      );
    }

    // Camera is ready — show the camera view with framing guidance overlay
    return (
      <View style={{ flex: 1, backgroundColor: '#000' }}>
        <CameraView
          ref={cameraRef}
          style={{ flex: 1 }}
          facing="back"
          onCameraReady={() => setCameraReady(true)}
        >
          {/* Top bar */}
          <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.base, paddingTop: 8 }}>
              <TouchableOpacity onPress={handleBack} style={{ height: 44, width: 44, justifyContent: 'center' }}>
                <Ionicons name="close" size={28} color="#fff" />
              </TouchableOpacity>
              <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 18, color: '#fff', flex: 1, marginLeft: 4 }}>
                Skin Check
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('SkinCheckCamera', { inputMethod: 'gallery' })}
                style={{ height: 44, paddingHorizontal: 12, justifyContent: 'center' }}
              >
                <Ionicons name="images-outline" size={26} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Framing guidance overlay */}
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: spacing.xl }}>
              <View
                style={{
                  width: '100%',
                  maxWidth: 300,
                  aspectRatio: 1,
                  borderRadius: radii.lg,
                  borderWidth: 2,
                  borderColor: 'rgba(255,255,255,0.6)',
                  borderStyle: 'dashed',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons name="scan-outline" size={48} color="rgba(255,255,255,0.4)" />
              </View>
            </View>

            {/* Guidance text and capture button */}
            <View style={{ alignItems: 'center', paddingBottom: Platform.OS === 'ios' ? 40 : 24, paddingHorizontal: spacing.base }}>
              <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, color: '#fff', textAlign: 'center', marginBottom: spacing.base, lineHeight: 20, opacity: 0.9 }}>
                Position the affected skin area within the frame.{'\n'}Ensure good lighting and avoid blurry photos.
              </Text>

              <TouchableOpacity
                onPress={handleTakePhoto}
                disabled={!cameraReady}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  borderWidth: 4,
                  borderColor: '#fff',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: cameraReady ? 1 : 0.5,
                }}
              >
                <View
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 32,
                    backgroundColor: '#fff',
                  }}
                />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </CameraView>
      </View>
    );
  }

  // ── Gallery flow (no camera) ──
  if (inputMethod === 'gallery' && galleryPermission === false) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl }}>
          <View
            style={{
              width: 88,
              height: 88,
              borderRadius: radii.xl,
              backgroundColor: colors.surfaceStrong,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: spacing.base,
            }}
          >
            <Ionicons name="images-outline" size={44} color={colors.iconActive} />
          </View>
          <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 20, color: colors.textPrimary, textAlign: 'center', marginBottom: spacing.sm }}>
            Photo Library Access Needed
          </Text>
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, color: colors.textSecondary, textAlign: 'center', lineHeight: 20, marginBottom: spacing.lg }}>
            We need access to your photo library so you can upload an image of your baby's skin for screening.
          </Text>
          <Button
            title="Grant Library Access"
            onPress={checkGalleryPermission}
            fullWidth
          />
          <View style={{ height: spacing.sm }} />
          <Button
            title="Use Camera Instead"
            onPress={() => navigation.navigate('SkinCheckCamera', { inputMethod: 'camera' })}
            variant="secondary"
            fullWidth
          />
        </View>
      </SafeAreaView>
    );
  }

  return null;
}
