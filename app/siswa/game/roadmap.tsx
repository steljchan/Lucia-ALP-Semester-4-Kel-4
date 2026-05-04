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
}

export default function Roadmap({
  title,
  levels,
  currentLevel,
  routePrefix,
}: RoadmapProps) {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const [ready, setReady] = useState(false);

  const LEVEL_COUNT = levels.length;

  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: false });
    }, 200);
  }, []);

  useEffect(() => {
    setTimeout(() => setReady(true), 100);
  }, []);

  const getNodePosition = (index: number) => {
    const spacingY = 100;
    const centerX = width * 0.5;

    const offsets = [
      0, 30, -40, 35, -35,
      40, -30, 35, -25, 30,
      -20, 25, -15, 20, 0,
    ];

    const reversedIndex = LEVEL_COUNT - 1 - index;

    return {
      x: centerX + (offsets[index] || 0),
      y: 120 + reversedIndex * spacingY,
    };
  };

  const generatePath = () => {
    const points = levels.map((_, i) => getNodePosition(i));

    if (points.length < 2) return '';

    let d = `M ${points[0].x} ${points[0].y + 40}`;

    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];

      const controlX = (prev.x + curr.x) / 2;

      d += ` Q ${controlX} ${prev.y}, ${curr.x} ${curr.y}`;
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
        <View style={styles.mapContainer}>

          {/* ROAD */}
          <Svg width="100%" height={1700} style={styles.road}>
            <Path
              d={generatePath()}
              stroke="#5CBEFA"
              strokeWidth="14"
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

                  {/* START */}
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

  mapContainer: {
    height: 120 + 15 * 100,
  },

  road: {
    position: 'absolute',
    left: 0,
    right: 0,
  },

  nodeAbsolute: {
    position: 'absolute',
    transform: [
      { translateX: -28 },
      { translateY: -28 },
    ],
  },

  startMarker: {
    position: 'absolute',
    bottom: -30,
    alignSelf: 'center',
  },
});