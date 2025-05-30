/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuração correta para definir a porta do servidor
  serverExternalPackages: [],
  compiler: {
    styledComponents: true
  },
  images: {
    domains: ['localhost', '127.0.0.1', 'veg-backend.onrender.com'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'veg-backend.onrender.com',
        pathname: '/**',
      },
    ],
    unoptimized: true, // Necessário para exportação estática
  },
  // Configuração para exportação estática
  output: 'export',
  // Desabilitar o roteamento baseado em páginas para usar o roteamento do Django
  trailingSlash: true,
  // Configurar o diretório de saída
  distDir: 'out',
  async headers() {
    // Determinar a origem da API com base no ambiente
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: apiUrl },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ];
  },
  async redirects() {
    return [];
  },
}

module.exports = nextConfig