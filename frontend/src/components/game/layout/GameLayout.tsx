import {
  View,
  StyleSheet,
} from 'react-native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import {
  useRouter,
  usePathname,
} from 'expo-router';

import GameHeader
from '../common/gameHeader';

import GameActionButton
from './GameActionButton';

type ActionButton = {
  icon?: string;

  text?: string;

  color: string;

  onPress: () => void;

  disabled?: boolean;

  flex?: number;
};

type Props = {
  title: string;

  image?: any;

  level: number;

  heart?: number;

  coin?: number;

  children: React.ReactNode;

  actions?: ActionButton[];
};

export default function GameLayout({

  title,

  image,

  level,

  heart = 3,

  coin = 0,

  children,

  actions = [],

}: Props) {

  const router =
    useRouter();

  const pathname =
    usePathname();

  // ========================================
  // HANDLE BACK
  // ========================================

  const handleBack =
    () => {

      /*
        ====================================
        EXAMPLE:
        /siswa/game/berapakahaku/level/1

        RESULT:
        /siswa/game/berapakahaku
        ====================================
      */

      const roadmapRoute =
        pathname
          .split('/level')[0];

      router.replace(
        roadmapRoute as any
      );
    };

  return (

    <SafeAreaView
      edges={['top', 'bottom']}
      style={styles.container}
    >

      {/* HEADER */}
      <GameHeader
        title={title}

        image={image}

        level={level}

        heart={heart}

        coin={coin}

        onBack={handleBack}
      />

      {/* CONTENT */}
      <View
        style={styles.content}
      >
        {children}
      </View>

      {/* ACTION BUTTONS */}
      {actions.length > 0 && (

        <View
          style={styles.actionWrapper}
        >

          <View
            style={styles.actionRow}
          >

            {actions.map(
              (
                action,
                index
              ) => (

                <GameActionButton
                  key={index}
                  {...action}
                />

              )
            )}

          </View>

        </View>

      )}

    </SafeAreaView>
  );
}

const styles =
  StyleSheet.create({

    /*
      =========================
      CONTAINER
      =========================
    */

    container: {
      flex: 1,

      backgroundColor:
        '#EAF6FF',
    },

    /*
      =========================
      CONTENT
      =========================
    */

    content: {
      flex: 1,

      paddingHorizontal: 20,

      paddingTop: 6,

      paddingBottom: 10,
    },

    /*
      =========================
      ACTION WRAPPER
      =========================
    */

    actionWrapper: {
      paddingHorizontal: 20,

      paddingBottom: 40,

      paddingTop: 8,

      backgroundColor:
        '#EAF6FF',
    },

    /*
      =========================
      ACTION BUTTONS
      =========================
    */

    actionRow: {
      flexDirection: 'row',

      alignItems: 'center',

      gap: 10,
    },
  });