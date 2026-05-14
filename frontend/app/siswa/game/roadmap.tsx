import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';

import Svg, { Path } from 'react-native-svg';

import LevelNode from '../../../src/components/game/levelnode';
import GameHeader from '../../../src/components/game/gameHeader';

const { width } = Dimensions.get('window');

type Level = {
  id: number;
  unlocked: boolean;
};

interface RoadmapProps {
  title: string;
  levels: Level[];
  currentLevel: number;
  routePrefix: string;
  spacingY?: number;
  amplitude?: number;
}

export default function Roadmap(props: RoadmapProps) {
  const {
    title,
    levels,
    currentLevel,
    routePrefix,
    spacingY = 110,
    amplitude = 50,
  } = props;

  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const [ready, setReady] = useState(false);

  const LEVEL_COUNT = levels.length;

  const mapHeight = 120 + LEVEL_COUNT * spacingY;

  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: false });
    }, 200);
  }, []);

  useEffect(() => {
    setTimeout(() => setReady(true), 100);
  }, []);

  // 🔥 Zigzag otomatis (no hardcode)
  const getOffsetX = (index: number) => {
    return Math.sin(index * 0.8) * amplitude;
  };

  const getNodePosition = (index: number) => {
    const centerX = width / 2;
    const reversedIndex = LEVEL_COUNT - 1 - index;

    return {
      x: centerX + getOffsetX(index),
      y: 120 + reversedIndex * spacingY,
    };
  };

  // 🔥 Path smooth (Cubic Bezier)
  const generatePath = () => {
    const points = levels.map((_, i) => getNodePosition(i));
    if (points.length < 2) return '';

    let d = `M ${points[0].x} ${points[0].y}`;

    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];

      const midY = (prev.y + curr.y) / 2;

      d += `
        C ${prev.x} ${midY},
          ${curr.x} ${midY},
          ${curr.x} ${curr.y}
      `;
    }

    return d;
  };

  return (
    <View style={styles.container}>
      <GameHeader title={title} level={currentLevel} hearts={3} />

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.mapContainer, { height: mapHeight }]}>
          {/* ROAD */}
          <Svg width="100%" height={mapHeight} style={styles.road}>
            {/* Main line */}
            <Path
              d={generatePath()}
              stroke="#5CBEFA"
              strokeWidth="14"
              fill="none"
              strokeLinecap="round"
            />

            {/* Highlight (biar lebih hidup) */}
            <Path
              d={generatePath()}
              stroke="#A7D8FF"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
            />
          </Svg>

          {/* NODES */}
          {ready &&
            levels.map((item, index) => {
              const pos = getNodePosition(index);

              return (
                <View
                  key={item.id}
                  style={[
                    styles.nodeAbsolute,
                    {
                      top: pos.y,
                      left: pos.x,
                    },
                  ]}
                >
                  <LevelNode
                    level={item.id}
                    unlocked={item.unlocked}
                    onPress={() =>
                      router.push(`${routePrefix}/level/${item.id}`)
                    }
                  />

                  {/* START FLAG */}
                  {item.id === 1 && (
                    <View style={styles.startMarker}>
                      <Text style={{ fontSize: 20 }}>🚩</Text>
                    </View>
                  )}
                </View>
              );
            })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EAF6FF',
  },

  scroll: {
    paddingBottom: 60,
  },

  mapContainer: {},

  road: {
    position: 'absolute',
    left: 0,
    right: 0,
  },

  nodeAbsolute: {
    position: 'absolute',
    transform: [{ translateX: -28 }, { translateY: -28 }],
  },

  startMarker: {
    position: 'absolute',
    bottom: -30,
    alignSelf: 'center',
  },
});