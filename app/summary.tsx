import { StripeProvider } from '@stripe/stripe-react-native';
import * as Linking from 'expo-linking';

import Payment  from "./components/payment";

export default function SummaryScreen() {

  const publishableKey = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  return (
    <StripeProvider
      publishableKey={publishableKey!}
      merchantIdentifier="merchant.com.vavy.tranzrmoves" // required for Apple Pay
      urlScheme={Linking.createURL('/')?.split(':')[0]} // required for 3D Secure and bank redirects
    >
      <Payment />
    </StripeProvider>
  );
}
