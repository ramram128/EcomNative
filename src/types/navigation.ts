import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Product } from './product';

export type RootStackParamList = {
  Home: undefined;
  ProductDetails: { product: Product };
};

export type HomeProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
export type DetailsProps = NativeStackScreenProps<RootStackParamList, 'ProductDetails'>;