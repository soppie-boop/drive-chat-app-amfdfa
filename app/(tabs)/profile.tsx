
import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Platform,
  Switch,
  Pressable,
  Alert
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconSymbol } from "@/components/IconSymbol";
import { colors } from "@/styles/commonStyles";

export default function ProfileScreen() {
  const [autoConnect, setAutoConnect] = useState(true);
  const [backgroundMode, setBackgroundMode] = useState(true);
  const [highQualityAudio, setHighQualityAudio] = useState(true);
  const [notifications, setNotifications] = useState(true);

  const handleClearData = () => {
    Alert.alert(
      'Clear Data',
      'Are you sure you want to clear all app data?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: () => {
            console.log('Data cleared');
            Alert.alert('Success', 'App data has been cleared');
          }
        }
      ]
    );
  };

  const handleAbout = () => {
    Alert.alert(
      'About ProxiTalk',
      'Version 1.0.0\n\nProxiTalk enables automatic voice communication with people within 8 meters. Perfect for use in cars and other proximity-based scenarios.\n\nNo registration required. Your privacy is protected.',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.contentContainer,
          Platform.OS !== 'ios' && styles.contentContainerWithTabBar
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <IconSymbol name="waveform.circle.fill" size={80} color={colors.primary} />
          </View>
          <Text style={styles.appName}>ProxiTalk</Text>
          <Text style={styles.tagline}>Proximity Voice Communication</Text>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <View style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <IconSymbol name="link.circle.fill" size={24} color={colors.primary} />
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Auto Connect</Text>
                  <Text style={styles.settingDescription}>
                    Automatically connect to nearby users
                  </Text>
                </View>
              </View>
              <Switch
                value={autoConnect}
                onValueChange={setAutoConnect}
                trackColor={{ false: colors.textSecondary, true: colors.primary }}
                thumbColor={colors.card}
              />
            </View>
          </View>

          <View style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <IconSymbol name="moon.circle.fill" size={24} color={colors.secondary} />
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Background Mode</Text>
                  <Text style={styles.settingDescription}>
                    Keep voice chat active in background
                  </Text>
                </View>
              </View>
              <Switch
                value={backgroundMode}
                onValueChange={setBackgroundMode}
                trackColor={{ false: colors.textSecondary, true: colors.primary }}
                thumbColor={colors.card}
              />
            </View>
          </View>

          <View style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <IconSymbol name="hifi.speaker.fill" size={24} color={colors.accent} />
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>High Quality Audio</Text>
                  <Text style={styles.settingDescription}>
                    Use higher bitrate for better quality
                  </Text>
                </View>
              </View>
              <Switch
                value={highQualityAudio}
                onValueChange={setHighQualityAudio}
                trackColor={{ false: colors.textSecondary, true: colors.primary }}
                thumbColor={colors.card}
              />
            </View>
          </View>

          <View style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <IconSymbol name="bell.circle.fill" size={24} color={colors.warning} />
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Notifications</Text>
                  <Text style={styles.settingDescription}>
                    Get notified when users are nearby
                  </Text>
                </View>
              </View>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: colors.textSecondary, true: colors.primary }}
                thumbColor={colors.card}
              />
            </View>
          </View>
        </View>

        {/* Range Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connection Range</Text>
          <View style={styles.rangeCard}>
            <IconSymbol name="location.circle.fill" size={48} color={colors.primary} />
            <Text style={styles.rangeValue}>8 meters</Text>
            <Text style={styles.rangeDescription}>
              Maximum distance for voice communication
            </Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions</Text>
          
          <Pressable style={styles.actionButton} onPress={handleAbout}>
            <IconSymbol name="info.circle" size={24} color={colors.primary} />
            <Text style={styles.actionButtonText}>About ProxiTalk</Text>
            <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
          </Pressable>

          <Pressable 
            style={[styles.actionButton, styles.actionButtonDanger]} 
            onPress={handleClearData}
          >
            <IconSymbol name="trash" size={24} color={colors.error} />
            <Text style={[styles.actionButtonText, styles.actionButtonTextDanger]}>
              Clear App Data
            </Text>
            <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
          </Pressable>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            ProxiTalk v1.0.0
          </Text>
          <Text style={styles.footerSubtext}>
            Privacy-first proximity voice communication
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  contentContainerWithTabBar: {
    paddingBottom: 120,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  iconContainer: {
    marginBottom: 16,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  tagline: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  settingCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  rangeCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  rangeValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    marginTop: 12,
    marginBottom: 4,
  },
  rangeDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  actionButton: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  actionButtonDanger: {
    borderWidth: 1,
    borderColor: colors.error,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  actionButtonTextDanger: {
    color: colors.error,
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
