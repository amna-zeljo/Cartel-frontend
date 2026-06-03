import { StyleSheet } from 'react-native';
import colors from '../../theme/colors';

export default StyleSheet.create({
  listWrap: {
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 14,
    backgroundColor: colors.white,
  },
  selectedRow: {
    backgroundColor: colors.selectedSurface,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  marketName: {
    color: colors.marketHeading,
    fontSize: 20,
    fontWeight: '700',
  },
  marketTotal: {
    color: colors.marketAccent,
    fontSize: 22,
    fontWeight: '700',
  },
});
