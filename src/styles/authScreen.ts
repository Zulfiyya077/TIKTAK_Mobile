import { StyleSheet } from 'react-native';
import { colors, fonts } from '../theme';

/** Login / SignUp ortaq mətn stilləri */
export const authScreenStyles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontFamily: fonts.bold,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 40,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  footerMuted: {
    fontSize: 15,
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
  footerLink: {
    fontSize: 15,
    fontFamily: fonts.medium,
    color: colors.link,
  },
});
