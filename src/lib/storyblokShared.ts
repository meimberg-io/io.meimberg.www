export const COMPONENTTYPE_BLOG = 'blog'
export const COMPONENTTYPE_ARTICLE = 'article'
export const COMPONENTTYPE_PAGE = 'page'
export const COMPONENTTYPE_STUFF = 'stuff'
export const COMPONENTTYPE_SPECIAL = 'special'
export const COMPONENTTYPE_SPECIALCHAPTER = 'specialchapter'

export const STORYBLOK_FOLDER_ARTICLES = 'a/'
export const STORYBLOK_FOLDER_BLOG = 'b/'
export const STORYBLOK_FOLDER_SPECIALS = 's/'

export const RESOLVE_RELATIONS_NAV = [
  'globalsettings.topnav',
  'globalsettings.footernav'
]

export const RESOLVE_RELATIONS = [
  'linklist.links',
  'sociallink.icon',
  'sociallink.url',
  'blogteaserlist.articles',
  'articleteaserlist.articles',
  'stuffteaserlist.stuffs',
  'luxarise_picture.pic_big',
  'luxarise_picture.pic_thumb'
]

export const STORY_TYPES = [
  COMPONENTTYPE_BLOG,
  COMPONENTTYPE_ARTICLE,
  COMPONENTTYPE_STUFF,
  COMPONENTTYPE_PAGE,
  COMPONENTTYPE_SPECIAL,
  COMPONENTTYPE_SPECIALCHAPTER
].join(',')
