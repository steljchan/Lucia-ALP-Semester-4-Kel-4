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

import LevelNode from '../../../src/components/game/common/levelnode';
import GameHeader from '../../../src/components/game/common/gameHeader';

const { width } = Dimensions.get('window');

type Level = {
  id: number;
  unlocked: boolean;
  played?: boolean;
  stars?: number;
};

interface RoadmapProps {
  title: string;
  levels: Level[];

  currentLevel: number;
  routePrefix: string;

  heart?: number;
  coin?: number;

  spacingY?: number;
  amplitude?: number;
}

export default function Roadmap(props: RoadmapProps) {
  const {
    title,
    levels,
    currentLevel,
    routePrefix,

    heart = 3,
    coin = 0,

    spacingY = 120,
    amplitude = 55,
  } = props;

  const router = useRouter();

  const scrollRef = useRef<ScrollView>(null);

  const [ready, setReady] = useState(false);

  const LEVEL_COUNT = levels.length;

  const mapHeight = 180 + LEVEL_COUNT * spacingY;

  useEffect(() => {
    setTimeout(() => {
      const currentIndex = levels.findIndex(
        (l) => l.id === currentLevel
      );

      if (currentIndex >= 0) {
        const reversedIndex =
          LEVEL_COUNT - 1 - currentIndex;

        const targetY =
          reversedIndex * spacingY;

        scrollRef.current?.scrollTo({
          y: Math.max(targetY - 250, 0),
          animated: false,
        });
      }
    }, 300);
  }, []);

  useEffect(() => {
    setTimeout(() => setReady(true), 100);
  }, []);

  // Zigzag path
  const getOffsetX = (index: number) => {
    return Math.sin(index * 0.8) * amplitude;
  };

  const getNodePosition = (index: number) => {
    const centerX = width / 2;

    const reversedIndex =
      LEVEL_COUNT - 1 - index;

    return {
      x: centerX + getOffsetX(index),
      y: 140 + reversedIndex * spacingY,
    };
  };

  // Smooth road path
  const generatePath = () => {
    const points = levels.map((_, i) =>
      getNodePosition(i)
    );

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
      <GameHeader
        title={title}
        level={currentLevel}
        heart={heart}
        coin={coin}
      />

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.mapContainer,
            { height: mapHeight },
          ]}
        >
          {/* ROAD */}
          <Svg
            width="100%"
            height={mapHeight}
            style={styles.road}
          >
            {/* Main Road */}
            <Path
              d={generatePath()}
              stroke="#5CBEFA"
              strokeWidth="16"
              fill="none"
              strokeLinecap="round"
            />

            {/* Highlight */}
            <Path
              d={generatePath()}
              stroke="#BFE7FF"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
            />
          </Svg>

          {/* LEVEL NODES */}
          {ready &&
            levels.map((item, index) => {
              const pos =
                getNodePosition(index);

              const isCurrent =
                item.id === currentLevel;

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
                  <View
                    style={[
                      styles.nodeWrapper,

                      isCurrent &&
                        styles.currentNode,
                    ]}
                  >
                    <LevelNode
                      level={item.id}
                      unlocked={item.unlocked}
                      current={item.id === currentLevel}
                      played={item.played}
                      stars={item.stars}
                      onPress={() => {
                        if (item.unlocked) {
                          router.push(
                            `${routePrefix}/level/${item.id}`
                          );
                        }
                      }}
                    />
                  </View>

                  {/* START */}
                  {item.id === 1 && (
                    <View
                      style={
                        styles.startMarker
                      }
                    >
                      <Text
                        style={{
                          fontSize: 22,
                        }}
                      >
                        🚩
                      </Text>
                    </View>
                  )}

                  {/* CURRENT LABEL */}
                  {isCurrent && (
                    <View
                      style={
                        styles.currentBadge
                      }
                    >
                      <Text
                        style={
                          styles.currentBadgeText
                        }
                      >
                        CURRENT
                      </Text>
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
    paddingBottom: 80,
  },

  mapContainer: {},

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

  nodeWrapper: {
    alignItems: 'center',
  },

  currentNode: {
    shadowColor: '#5CBEFA',
    shadowOpacity: 0.35,
    shadowRadius: 15,
    elevation: 10,
  },

  startMarker: {
    position: 'absolute',
    bottom: -34,
    alignSelf: 'center',
  },

  currentBadge: {
    position: 'absolute',
    top: -28,
    alignSelf: 'center',

    backgroundColor: '#5CBEFA',

    paddingHorizontal: 10,
    paddingVertical: 4,

    borderRadius: 20,
  },

  currentBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});