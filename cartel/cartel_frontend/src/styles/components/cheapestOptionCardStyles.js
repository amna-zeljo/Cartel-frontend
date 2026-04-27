import { StyleSheet } from 'react-native';
import colors from '../../theme/colors';

export default StyleSheet.create({
  cheapestBox: {
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: colors.softSurface,
  },
  cheapestLabel: {
    color: colors.marketHeading,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  cheapestRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cheapestMarket: {
    color: colors.marketText,
    fontSize: 20,
    fontWeight: '600',
    marginRight: 8,
  },
  cheapestValue: {
    color: colors.saleAccentDark,
    fontSize: 30,
    fontWeight: '700',
  },
});
