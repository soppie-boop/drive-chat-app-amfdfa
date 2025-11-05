
import React, { useState, useEffect, useRef } from "react";
import { Stack } from "expo-router";
import { 
  StyleSheet, 
  View, 
  Text, 
  Alert, 
  Platform, 
  Pressable,
  ScrollView,
  Animated,
  Dimensions
} from "react-native";
import { IconSymbol } from "@/components/IconSymbol";
import * as Location from 'expo-location';
import { Audio } from 'expo-av';
import { colors } from "@/styles/commonStyles";

interface NearbyUser {
  id: string;
  distance: number;
  name: string;
  isConnected: boolean;
}

export default function HomeScreen() {
  const [isActive, setIsActive] = useState(false);
  const [hasPermissions, setHasPermissions] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);
  const [nearbyUsers, setNearbyUsers] = useState<NearbyUser[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const locationSubscription = useRef<Location.LocationSubscription | null>(null);

  useEffect(() => {
    requestPermissions();
    return () => {
      stopVoiceChat();
    };
  }, []);

  useEffect(() => {
    if (isActive) {
      startPulseAnimation();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isActive]);

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const requestPermissions = async () => {
    try {
      // Request location permissions
      const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
      
      // Request audio permissions
      const { status: audioStatus } = await Audio.requestPermissionsAsync();
      
      if (locationStatus === 'granted' && audioStatus === 'granted') {
        setHasPermissions(true);
        console.log('All permissions granted');
      } else {
        Alert.alert(
          'Permissions Required',
          'This app needs location and microphone permissions to work. Please enable them in settings.',
          [{ text: 'OK' }]
        );
        console.log('Permissions denied');
      }
    } catch (error) {
      console.error('Error requesting permissions:', error);
      Alert.alert('Error', 'Failed to request permissions');
    }
  };

  const startLocationTracking = async () => {
    try {
      locationSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 5,
        },
        (location) => {
          setCurrentLocation(location);
          console.log('Location updated:', location.coords);
          // In a real app, you would send this to a backend to find nearby users
          simulateNearbyUsers(location);
        }
      );
    } catch (error) {
      console.error('Error starting location tracking:', error);
      Alert.alert('Error', 'Failed to start location tracking');
    }
  };

  const stopLocationTracking = () => {
    if (locationSubscription.current) {
      locationSubscription.current.remove();
      locationSubscription.current = null;
      console.log('Location tracking stopped');
    }
  };

  const simulateNearbyUsers = (location: Location.LocationObject) => {
    // Simulate finding nearby users (in a real app, this would query a backend)
    const mockUsers: NearbyUser[] = [
      { id: '1', distance: 3.2, name: 'Driver nearby', isConnected: true },
      { id: '2', distance: 5.8, name: 'Passenger', isConnected: true },
      { id: '3', distance: 7.5, name: 'Another car', isConnected: false },
    ];
    setNearbyUsers(mockUsers);
  };

  const startVoiceChat = async () => {
    if (!hasPermissions) {
      Alert.alert('Permissions Required', 'Please grant location and microphone permissions first.');
      return;
    }

    try {
      setIsActive(true);
      await startLocationTracking();
      
      // Configure audio session
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      console.log('Voice chat started');
      Alert.alert('Voice Chat Active', 'You can now talk to people within 8 meters!');
    } catch (error) {
      console.error('Error starting voice chat:', error);
      Alert.alert('Error', 'Failed to start voice chat');
      setIsActive(false);
    }
  };

  const stopVoiceChat = async () => {
    try {
      setIsActive(false);
      stopLocationTracking();
      
      if (recording) {
        await recording.stopAndUnloadAsync();
        setRecording(null);
      }
      
      setNearbyUsers([]);
      console.log('Voice chat stopped');
    } catch (error) {
      console.error('Error stopping voice chat:', error);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    console.log('Mute toggled:', !isMuted);
  };

  const renderHeaderRight = () => (
    <Pressable
      onPress={() => Alert.alert(
        "Settings",
        "Range: 8 meters\nAudio Quality: High\nBackground Mode: Enabled"
      )}
      style={styles.headerButtonContainer}
    >
      <IconSymbol name="gear" color={colors.primary} />
    </Pressable>
  );

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: "ProxiTalk",
            headerRight: renderHeaderRight,
          }}
        />
      )}
      <View style={styles.container}>
        <ScrollView 
          contentContainerStyle={[
            styles.scrollContent,
            Platform.OS !== 'ios' && styles.scrollContentWithTabBar
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Main Status Card */}
          <View style={styles.statusCard}>
            <Animated.View 
              style={[
                styles.statusIndicator,
                {
                  backgroundColor: isActive ? colors.accent : colors.textSecondary,
                  transform: [{ scale: pulseAnim }],
                }
              ]}
            >
              <IconSymbol 
                name={isActive ? "waveform" : "mic.slash"} 
                size={60} 
                color={colors.card} 
              />
            </Animated.View>
            
            <Text style={styles.statusTitle}>
              {isActive ? 'Voice Chat Active' : 'Voice Chat Inactive'}
            </Text>
            
            <Text style={styles.statusSubtitle}>
              {isActive 
                ? 'Broadcasting to nearby users within 8m' 
                : 'Tap the button below to start'}
            </Text>

            {currentLocation && isActive && (
              <View style={styles.locationInfo}>
                <IconSymbol name="location.fill" size={16} color={colors.primary} />
                <Text style={styles.locationText}>
                  Location tracking active
                </Text>
              </View>
            )}
          </View>

          {/* Nearby Users */}
          {isActive && nearbyUsers.length > 0 && (
            <View style={styles.nearbySection}>
              <Text style={styles.sectionTitle}>
                Nearby Users ({nearbyUsers.length})
              </Text>
              {nearbyUsers.map((user) => (
                <View key={user.id} style={styles.userCard}>
                  <View style={styles.userInfo}>
                    <View style={[
                      styles.userIndicator,
                      { backgroundColor: user.isConnected ? colors.accent : colors.textSecondary }
                    ]} />
                    <View style={styles.userDetails}>
                      <Text style={styles.userName}>{user.name}</Text>
                      <Text style={styles.userDistance}>
                        {user.distance.toFixed(1)}m away
                      </Text>
                    </View>
                  </View>
                  <IconSymbol 
                    name={user.isConnected ? "speaker.wave.3.fill" : "speaker.slash.fill"} 
                    size={20} 
                    color={user.isConnected ? colors.accent : colors.textSecondary} 
                  />
                </View>
              ))}
            </View>
          )}

          {/* Info Section */}
          {!isActive && (
            <View style={styles.infoSection}>
              <View style={styles.infoCard}>
                <IconSymbol name="car.fill" size={32} color={colors.primary} />
                <Text style={styles.infoTitle}>Perfect for Cars</Text>
                <Text style={styles.infoText}>
                  Communicate with other drivers and passengers nearby
                </Text>
              </View>
              
              <View style={styles.infoCard}>
                <IconSymbol name="location.circle.fill" size={32} color={colors.secondary} />
                <Text style={styles.infoTitle}>8 Meter Range</Text>
                <Text style={styles.infoText}>
                  Automatically connects to users within 8 meters
                </Text>
              </View>
              
              <View style={styles.infoCard}>
                <IconSymbol name="lock.shield.fill" size={32} color={colors.accent} />
                <Text style={styles.infoTitle}>Privacy First</Text>
                <Text style={styles.infoText}>
                  No registration required, completely anonymous
                </Text>
              </View>
            </View>
          )}

          {/* Control Buttons */}
          <View style={styles.controlsContainer}>
            {isActive && (
              <Pressable 
                style={[styles.controlButton, styles.muteButton]}
                onPress={toggleMute}
              >
                <IconSymbol 
                  name={isMuted ? "mic.slash.fill" : "mic.fill"} 
                  size={24} 
                  color={colors.card} 
                />
                <Text style={styles.controlButtonText}>
                  {isMuted ? 'Unmute' : 'Mute'}
                </Text>
              </Pressable>
            )}
            
            <Pressable 
              style={[
                styles.mainButton,
                isActive && styles.mainButtonActive
              ]}
              onPress={isActive ? stopVoiceChat : startVoiceChat}
            >
              <Text style={styles.mainButtonText}>
                {isActive ? 'Stop Voice Chat' : 'Start Voice Chat'}
              </Text>
            </Pressable>
          </View>

          {/* Permissions Warning */}
          {!hasPermissions && (
            <View style={styles.warningCard}>
              <IconSymbol name="exclamationmark.triangle.fill" size={24} color={colors.warning} />
              <Text style={styles.warningText}>
                Location and microphone permissions are required
              </Text>
              <Pressable 
                style={styles.permissionButton}
                onPress={requestPermissions}
              >
                <Text style={styles.permissionButtonText}>Grant Permissions</Text>
              </Pressable>
            </View>
          )}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  scrollContentWithTabBar: {
    paddingBottom: 120,
  },
  statusCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    marginBottom: 20,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  statusIndicator: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  statusTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  statusSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 12,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.highlight,
    borderRadius: 12,
  },
  locationText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  nearbySection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  userCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  userIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  userDetails: {
    gap: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  userDistance: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  infoSection: {
    marginBottom: 20,
    gap: 12,
  },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 12,
    marginBottom: 6,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  controlsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  controlButton: {
    backgroundColor: colors.textSecondary,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  muteButton: {
    backgroundColor: colors.secondary,
  },
  controlButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.card,
  },
  mainButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    boxShadow: '0px 4px 12px rgba(0, 122, 255, 0.3)',
    elevation: 4,
  },
  mainButtonActive: {
    backgroundColor: colors.error,
  },
  mainButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.card,
  },
  warningCard: {
    backgroundColor: '#FFF9E6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: colors.warning,
  },
  warningText: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
  },
  permissionButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 8,
  },
  permissionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.card,
  },
  headerButtonContainer: {
    padding: 6,
  },
});
