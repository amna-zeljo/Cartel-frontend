import { StyleSheet } from 'react-native';
import colors from '../../theme/colors';

export default StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: colors.white,
  },
  left: {
    flex: 1,
  },
  right: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  linePrice: {
    marginTop: 6,
    fontSize: 14,
    color: colors.gray,
    fontWeight: '600',
  },
});
