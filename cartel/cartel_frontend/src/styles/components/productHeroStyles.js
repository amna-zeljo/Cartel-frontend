import { StyleSheet } from 'react-native';
import colors from '../../theme/colors';

export default StyleSheet.create({
  imageWrap: {
    alignItems: 'center',
    marginBottom: 12,
  },
  image: {
    width: 110,
    height: 110,
    borderRadius: 10,
    backgroundColor: colors.imagePlaceholder,
  },
  productName: {
    textAlign: 'center',
    fontSize: 28,
    color: colors.blue,
    fontWeight: '700',
    marginBottom: 6,
  },
  description: {
    textAlign: 'center',
    color: colors.secondaryText,
    fontSize: 16,
    marginBottom: 10,
  },
});
