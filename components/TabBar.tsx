import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

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
  return (
    <View style={styles.container}>
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
              color={isActive ? "#00d4ff" : "#888"}
            />
            <Text style={[styles.label, isActive && styles.labelActive]}>
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
    paddingBottom: 8,
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
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
