import { ImageStyle, TextStyle, ViewStyle } from "react-native";

export const COLORS = {
  primary: '#5CBEFA',
  secondary: '#76CFFF', 
  background: '#F0F9FF',
  smoothBlue: '#D6EFFF',
  white: '#FFFFFF',
  textMain: '#091F5B',
  textSub: '#7DA1C4',
  success: '#4CAF50',
  error: '#F44336',
  gray: '#D6D6D6',
  darkGray: '#939393',
  yellow: '#F8B64C',
  red: '#FF383C'
};

export const SafeArea ={
  flex: 1,
  backgroundColor: '#EAF6FF',
}

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const BORDER_RADIUS = {
  s: 10,
  m: 20,
  l: 30,
};

export const MARGIN_HORIZONTAL = 20;

export const scrollContent={
  paddingBottom: 130,
  paddingHorizontal: 20,
} 

export const title ={ //tulisan besar
  fontSize : 20,
  fontWeight : 'bold' as const, //hrus pke const krna nnti error, biar tidak dikira string biasa
  color : COLORS.textMain
}

export const subtitle ={ //subtitle seperti utk mapel
  fontSize : 14,
  color : COLORS.textMain,
  fontWeight : 'bold' as const,
}

export const moreSubtitle ={ //tulisan caption seperti utk detail materi atau subtitle
  fontSize : 12,
  color : COLORS.textMain,
  fontWeight : 'bold' as const,
}

export const container ={
  flex: 1,
  backgroundColor: COLORS.background,
  justifyContent: 'center' as const,
  alignItems: 'center' as const,
}

export const containerHeader ={
  flex: 1,
  backgroundColor: COLORS.background,
}

export const TEXT ={
  bigTitle:{
    fontSize : 24,
    fontWeight : 'bold' as const, //hrus pke const krna nnti error, biar tidak dikira string biasa
    color : COLORS.textMain,
    textAlign : 'center' as const,
  },

  subBigTitle:{
    fontSize: 14, 
    color: COLORS.primary, 
    fontWeight: '700' as const, 
    marginTop: -5,
    textAlign : 'center' as const,
  },
}

export const BTN = {
  primary: {
    // Style untuk tombolnya
    box: {
      backgroundColor: COLORS.primary,
      height: 55,
      borderRadius: 15,
      justifyContent: 'center', 
      alignItems: 'center',
      // shadowColor: '#000',
      // shadowOffset: { width: 0, height: 2 },
      // shadowOpacity: 0.25,
      // shadowRadius: 3.84,
      // elevation: 5,
    } as ViewStyle,

    // Style untuk teks di dalamnya
    text: {
      color: COLORS.white, 
      fontSize: 18, 
      fontWeight: 'bold' 
    } as TextStyle,

    
  },
  
  logout: {
    box: {
      flexDirection: 'row' as const,
      backgroundColor: COLORS.red,
      marginTop: 20,
      padding: 15,
      borderRadius: 20,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
    } as ViewStyle,

    text: {
      color: COLORS.white, 
      fontSize: 18, 
      fontWeight: 'bold' 
    } as TextStyle,
  }
};

export const PROFILE = {
  avatar: {
    width: 130 as const,
    height: 130 as const,
    borderRadius: 65 as const,
    borderWidth: 3 as const,
    borderColor: COLORS.primary, 
    // backgroundColor: COLORS.smoothBlue,
  } as ImageStyle,
  
  cameraBtn: {
    position: 'absolute' as const,
    right: 5,
    top: 5,
    backgroundColor: COLORS.white,
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.secondary,
  } as ViewStyle,

  studentId: {
    fontSize: 16,
    color: COLORS.textSub, 
    marginTop: 4,
    textAlign: 'center' as const,
  } as TextStyle,

  emailBadge: {
    backgroundColor: COLORS.smoothBlue,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 8,
    alignItems: 'center' as const,
  } as ViewStyle,
};