import { StyleSheet } from 'react-native';
import colors from '../../theme/colors';

export default StyleSheet.create({
  saleBox: {
    borderRadius: 8,
    backgroundColor: colors.saleBackground,
    padding: 12,
    marginBottom: 14,
  },
  saleTitle: {
    color: colors.blue,
    fontWeight: '700',
    fontSize: 18,
    marginBottom: 2,
  },
  saleValue: {
    color: colors.saleAccent,
    fontWeight: '700',
    fontSize: 30,
  },
});
