import { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import '../styles/globals.css';
import Layout from '../layout/Layout';
import { UnifiedAudioProvider } from '../components/audio/UnifiedAudioContext';
import GlobalAudioPlayer from '../components/audio/GlobalAudioPlayer';
import { CartProvider } from '../components/ui/CartContext';
import CartDrawer from '../components/ui/CartDrawer';
import ToastProvider from '../components/ui/ToastContext';

function MyApp({ Component, pageProps }: AppProps) {
  const { session, use3DSplineBackground = false, ...restPageProps } = pageProps;
  return (
    <SessionProvider session={session}>
      <CartProvider>
        <UnifiedAudioProvider>
          <ToastProvider>
            <Layout use3DSplineBackground={use3DSplineBackground}>
              <Component {...restPageProps} />
              <GlobalAudioPlayer />
              <CartDrawer />
            </Layout>
          </ToastProvider>
        </UnifiedAudioProvider>
      </CartProvider>
    </SessionProvider>
  );
}

export default MyApp;