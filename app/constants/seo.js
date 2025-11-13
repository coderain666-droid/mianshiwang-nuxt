export const SEO = {
	siteUrl: 'https://interview.lgdsunday.club/',
	siteName: '面试汪',
	defaultTitle: '面试汪 - AI 面试平台',
	defaultDescription:
		'面向各个职业的 AI 面试平台，支持程序员、产品经理、设计师、律师、医生等职业的智能面试训练与题库。',
	defaultKeywords:
		'AI 面试平台, 在线面试, 程序员面试, 产品经理面试, 设计师面试, 律师面试, 医生面试, 面试题库, 面试训练, 智能面试',
	ogImage: '/og-image.png',
	twitterCard: 'summary_large_image'
}

const absoluteUrl = (base, path) =>
	path.startsWith('http') ? path : `${base}${path}`

export const jsonLdWebsite = (seo = SEO) => ({
	'@context': 'https://schema.org',
	'@type': 'WebSite',
	name: seo.siteName,
	url: `${seo.siteUrl}/`,
	description: seo.defaultDescription,
	potentialAction: {
		'@type': 'SearchAction',
		target: `${seo.siteUrl}/search?q={query}`,
		'query-input': 'required name=query'
	}
})

export const jsonLdOrganization = (seo = SEO) => ({
	'@context': 'https://schema.org',
	'@type': 'Organization',
	name: seo.siteName,
	url: `${seo.siteUrl}/`,
	logo: absoluteUrl(seo.siteUrl, seo.ogImage)
})
