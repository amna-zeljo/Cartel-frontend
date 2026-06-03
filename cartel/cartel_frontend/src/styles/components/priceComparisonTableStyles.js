import { StyleSheet } from 'react-native';
import colors from '../../theme/colors';

export default StyleSheet.create({
  table: {
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: colors.tableRow,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  marketText: {
    color: colors.text,
    fontWeight: '600',
    fontSize: 16,
  },
  priceText: {
    color: colors.priceText,
    fontWeight: '700',
    fontSize: 26,
  },
});
