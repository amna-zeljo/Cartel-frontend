import { StyleSheet } from 'react-native';
import colors from '../../theme/colors';

export default StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.screen,
  },
  card: {
    marginHorizontal: 16,
    marginTop: 0,
    overflow: 'hidden',
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginLeft: 14,
  },
  summary: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '700',
  },
});
