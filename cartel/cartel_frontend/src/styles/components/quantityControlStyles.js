import { StyleSheet } from 'react-native';
import colors from '../../theme/colors';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightGray,
    padding: 4,
    borderRadius: 8,
  },
  button: {
    width: 30,
    height: 30,
    borderRadius: 6,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontSize: 18,
    color: colors.blue,
    fontWeight: '600',
    lineHeight: 18,
  },
  valueWrap: {
    minWidth: 28,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  valueText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
  },
});
