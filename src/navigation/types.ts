export type AuthStackParamList = {
  Welcome: undefined;
  SignUp: undefined;
  Login: undefined;
};

export type HomeStackParamList = {
  HomeMain: undefined;
  CategoryProducts: { categoryId: number; categoryName: string };
  Cart: undefined;
  Checkout: undefined;
  OrderSuccess: undefined;
};

export type AccountStackParamList = {
  ProfileHome: undefined;
  ProfileEdit: undefined;
  OrderHistory: undefined;
  Favorites: undefined;
};

export type MainTabParamList = {
  HomeTab: undefined;
  SearchTab: undefined;
  AccountTab: undefined;
};
