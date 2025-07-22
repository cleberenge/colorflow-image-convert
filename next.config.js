
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
  
  // Otimizações
  compress: true,
  poweredByHeader: false,
  
  // Configuração para export estático
  distDir: 'out',
}

module.exports = nextConfig
