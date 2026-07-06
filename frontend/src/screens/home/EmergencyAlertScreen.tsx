import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Animated,
  Easing,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import { Button } from '../../components';
import type { HomeScreenProps } from '../../navigation/types';
import { logEvent } from '../../lib/analytics';

const ALERT_RED = '#E0524C';

export function EmergencyAlertScreen({ navigation, route }: HomeScreenProps<'EmergencyAlert'>) {
  const { theme } = useTheme();
  const { colors, spacing } = theme;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const reduceMotion = theme.isDark; // approximation: use dark mode as reduced-motion proxy

  useEffect(() => {
    logEvent('emergency_alert_viewed').catch(() => {});

    if (!reduceMotion) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 0.7,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [reduceMotion]);

  const handleCallEmergency = () => {
    logEvent('emergency_call_placed').catch(() => {});
    Linking.openURL('tel:911');
  };

  const handleGoToGuide = () => {
    navigation.replace('EmergencyGuide');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: ALERT_RED }}>
      <View style={{ flex: 1, paddingHorizontal: spacing.lg, justifyContent: 'center', alignItems: 'center' }}>
        {/* Pulsing Alert Icon */}
        <Animated.View
          style={[
            {
              width: 120,
              height: 120,
              borderRadius: 60,
              backgroundColor: 'rgba(255,255,255,0.2)',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: spacing.xl,
            },
            reduceMotion ? {} : { transform: [{ scale: pulseAnim }] },
          ]}
        >
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: 'rgba(255,255,255,0.3)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="alert-circle" size={48} color="#fff" />
          </View>
        </Animated.View>

        {/* Alert Text */}
        <Text
          style={{
            fontFamily: 'Inter_700Bold',
            fontSize: 28,
            lineHeight: 34,
            color: '#fff',
            textAlign: 'center',
            marginBottom: spacing.sm,
          }}
        >
          Seek Emergency Care{'\n'}Immediately
        </Text>
        <Text
          style={{
            fontFamily: 'Inter_400Regular',
            fontSize: 16,
            lineHeight: 22,
            color: 'rgba(255,255,255,0.85)',
            textAlign: 'center',
            marginBottom: spacing.xl,
            paddingHorizontal: spacing.base,
          }}
        >
          Your baby's symptoms match conditions that require urgent medical attention. Please call for help or go to the nearest hospital now.
        </Text>

        {/* Call-to-Action Buttons */}
        <Button
          title="Call 911 Now"
          onPress={handleCallEmergency}
          variant="secondary"
          fullWidth
          icon={<Ionicons name="call" size={18} color={ALERT_RED} />}
          style={{
            marginBottom: spacing.sm,
            backgroundColor: '#fff',
            borderColor: '#fff',
            height: 56,
          }}
          textStyle={{
            fontFamily: 'Inter_700Bold',
            fontSize: 18,
            color: ALERT_RED,
          }}
        />

        <Button
          title="View Emergency Guide"
          onPress={handleGoToGuide}
          variant="tertiary"
          fullWidth
          icon={<Ionicons name="information-circle-outline" size={18} color="rgba(255,255,255,0.9)" />}
          textStyle={{ color: 'rgba(255,255,255,0.9)' }}
        />

        <Button
          title="Back to Home"
          onPress={() => navigation.navigate('Home')}
          variant="tertiary"
          fullWidth
          icon={<Ionicons name="home-outline" size={18} color="rgba(255,255,255,0.7)" />}
          textStyle={{ color: 'rgba(255,255,255,0.7)' }}
          style={{ marginTop: spacing.sm }}
        />
      </View>
    </SafeAreaView>
  );
}
