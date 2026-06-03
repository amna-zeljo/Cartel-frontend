import { StyleSheet } from 'react-native';
import colors from '../../theme/colors';

export default StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.screen,
  },
  card: {
    marginHorizontal: 16,
    padding: 16,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: colors.divider,
    marginBottom: 12,
  },
  sectionTitle: {
    color: colors.blue,
    fontWeight: '700',
    fontSize: 22,
    marginBottom: 8,
  },
  actionButton: {
    marginBottom: 0,
  },
});
