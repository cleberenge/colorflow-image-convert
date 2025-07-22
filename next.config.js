
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Export estático para GitHub Pages
  output: 'export',
  trailingSlash: true,
  
  // Desabilita otimização de imagens (GitHub Pages não suporta)
  images: {
    unoptimized: true
  },
  
  // Configuração para domínio customizado
  assetPrefix: '',
  basePath: '',
  
  // Headers importantes para WebAssembly/Workers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
        ],
      },
    ]
  },
  
  // Otimizações
  compress: true,
  poweredByHeader: false,
}

module.exports = nextConfig
