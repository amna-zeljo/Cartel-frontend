import { StyleSheet } from 'react-native';
import colors from '../../theme/colors';

export default StyleSheet.create({
  header: {
    height: 64,
    backgroundColor: colors.blue,
    margin: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    justifyContent: 'space-between',
  },
  sideAction: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  back: {
    color: colors.white,
    fontSize: 22,
  },
  title: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
});
