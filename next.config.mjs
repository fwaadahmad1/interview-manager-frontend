import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/calendar',
        destination: '/calendar/month',
        permanent: true,
      },
    ]
  },
};

export default withNextIntl(nextConfig);
