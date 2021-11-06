import { ApolloProvider } from '@apollo/client';
import Router from 'next/router';
import NProgess from 'nprogress';
import Page from '../components/Page';
import '../components/styles/nprogress.css';
import withData from '../lib/withData';

Router.events.on('routeChangeStart', () => NProgess.start());
Router.events.on('routeChangeComplete', () => NProgess.done());
Router.events.on('routeChangeError', () => NProgess.done());

function MyApp({ Component, pageProps, apollo }) {
  return (
    <ApolloProvider client={apollo}>
      <Page>
        <Component {...pageProps} />
      </Page>
    </ApolloProvider>
  );
}

MyApp.getInitialProps = async function ({ Component, ctx }) {
  let pageProps = {};
  console.log('ctxxxxxxx', ctx);
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }
  pageProps.query = ctx.query;
  console.log('pageProps', pageProps.query);
  return { pageProps };
};

export default withData(MyApp);
