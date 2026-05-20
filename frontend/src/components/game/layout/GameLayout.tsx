import {
  View,
  StyleSheet,
} from 'react-native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import GameHeader from '../common/gameHeader';

import GameActionButton from './GameActionButton';

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

  level: number;

  hearts?: number;

  children: React.ReactNode;

  actions?: ActionButton[];
};

export default function GameLayout({
  title,
  level,
  hearts = 3,
  children,
  actions = [],
}: Props) {

  return (
    <SafeAreaView
      edges={['top', 'bottom']}
      style={styles.container}
    >

      {/* HEADER */}
      <GameHeader
        title={title}
        level={level}
        hearts={hearts}
      />

      {/* CONTENT */}
      <View style={styles.content}>
        {children}
      </View>

      {/* ACTION BUTTONS */}
      {actions.length > 0 && (
        <View style={styles.actionRow}>
          {actions.map((action, index) => (
            <GameActionButton
              key={index}
              {...action}
            />
          ))}
        </View>
      )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,

    backgroundColor: '#EAF6FF',

    justifyContent: 'space-between',
  },

  content: {
    flex: 1,

    paddingHorizontal: 20,

    paddingTop: 10,
  },

  actionRow: {
    flexDirection: 'row',

    alignItems: 'center',

    gap: 10,

    paddingHorizontal: 20,

    paddingTop: 10,

    paddingBottom: 30,
  },

});