import { StyleSheet } from 'react-native';
import colors from '../../theme/colors';

export default StyleSheet.create({
  button: {
    backgroundColor: colors.blue,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  secondary: {
    backgroundColor: colors.lightBlue,
  },
  text: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 16,
  },
});
