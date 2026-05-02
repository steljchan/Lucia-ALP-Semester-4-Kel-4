export const COLORS = {
  primary: '#5CBEFA',
  secondary: '#76CFFF', 
  background: '#F0F9FF',
  gray: '#D6D6D6',
  smoothBlue: '#D6EFFF',
  white: '#FFFFFF',
  textMain: '#091F5B',
  textSub: '#7DA1C4',
  success: '#4CAF50',
  error: '#F44336',
};

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

export const title ={ //tulisan besar
  fontSize : 20,
  fontWeight : 'bold' as const, //hrus pke const krna nnti error, biar tidak dikira string biasa
  color : COLORS.textMain
}

export const subtitle ={ //subtitle seperti utk mapel
  fontSize : 14,
  color : COLORS.textMain
}

export const caption ={ //tulisan caption seperti utk detail materi atau subtitle
  fontSize : 12,
  color : COLORS.textMain
}

export const container ={
  flex: 1,
  backgroundColor: COLORS.background,
  justifyContent: 'center' as const,
  alignItems: 'center' as const,
}