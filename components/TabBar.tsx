import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

type Tab = "Home" | "Talleres" | "Documentos";

type TabConfig = {
  key: Tab;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconActive: keyof typeof Ionicons.glyphMap;
};

const TABS: TabConfig[] = [
  { key: "Home",      label: "Inicio",   icon: "home-outline",          iconActive: "home" },
  { key: "Talleres",  label: "Talleres", icon: "map-outline",           iconActive: "map" },
  { key: "Documentos",label: "Docs",     icon: "document-text-outline", iconActive: "document-text" },
];

type Props = {
  active: Tab;
  onNavigate: (screen: Tab) => void;
};

export function TabBar({ active, onNavigate }: Props) {
  const { bottom } = useSafeAreaInsets()
  const { colors } = useTheme()
  return (
    <View style={[styles.container, { backgroundColor: colors.tabBar, borderTopColor: colors.border, paddingBottom: bottom || 4 }]}>
      {TABS.map((tab) => {
        const isActive = active === tab.key;
        return (
          <Pressable
            key={tab.key}
            style={styles.tab}
            onPress={() => onNavigate(tab.key)}
          >
            <Ionicons
              name={isActive ? tab.iconActive : tab.icon}
              size={24}
              color={isActive ? colors.accent : colors.textMuted}
            />
            <Text style={[styles.label, { color: isActive ? colors.accent : colors.textMuted }, isActive && styles.labelActive]}>
              {tab.label}
            </Text>
            {isActive && <View style={styles.indicator} />}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#1a1a2e",
    borderTopWidth: 1,
    borderTopColor: "#00d4ff33",
    paddingBottom: 4,
    paddingTop: 10,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 2,
    position: "relative",
  },
  label: {
    fontSize: 11,
    color: "#888",
    marginTop: 3,
  },
  labelActive: {
    color: "#00d4ff",
    fontWeight: "600",
  },
  indicator: {
    position: "absolute",
    top: 0,
    width: 30,
    height: 2,
    backgroundColor: "#00d4ff",
    borderRadius: 2,
  },
});
