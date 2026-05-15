export interface WebsitePage {
  slug: string;
  title: string;
  path: string;
  description: string;
  content: string;
  updatedAt?: string;
}

export const websitePages: WebsitePage[] = [
  {
    slug: 'home',
    title: 'Ana Sayfa',
    path: '/',
    description: 'Ana sayfa içeriği burada yer alır.',
    content: `# Hoş Geldiniz\n\nMK Hukuk platformuna hoş geldiniz. Burada hizmetlerimiz ve uzman ekibimiz hakkında bilgi bulabilirsiniz.`,
  },
  {
    slug: 'about',
    title: 'Hakkımızda',
    path: '/hakkimizda',
    description: 'Hakkımızda sayfası içeriği burada yer alır.',
    content: `# Hakkımızda\n\nMK Hukuk, deneyimli bir hukuk ekibi ve yenilikçi çözümlerle hizmet sunmaktadır.`,
  },
  {
    slug: 'contact',
    title: 'İletişim',
    path: '/iletisim',
    description: 'İletişim sayfası içeriği burada yer alır.',
    content: `# İletişim\n\nBize ulaşmak için telefon, e-posta veya web formunu kullanabilirsiniz.`,
  },
];
