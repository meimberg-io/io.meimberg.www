'use client';

import { useEffect, useState } from 'react'
import { BlogStoryblok } from '@/types/component-types-sb'
import { ISbStoryData } from '@storyblok/react'
import { BlogteaserlistProps } from '@/components/elements/blogteaserlist/Blogteaserlist.tsx'
import {
  COMPONENTTYPE_ARTICLE,
  COMPONENTTYPE_BLOG,
  fetchStories,
  STORYBLOK_FOLDER_ARTICLES
} from '@/lib/storyblok.ts'

function componentTypeForFolder(folder?: string): string {
  if (folder === STORYBLOK_FOLDER_ARTICLES || folder === 'a') {
    return COMPONENTTYPE_ARTICLE
  }
  return COMPONENTTYPE_BLOG
}
import { BlogCardList } from '@/components/elements/blogteaserlist/BlogCardList.tsx'


export default function BlogteaserlistClient({ props }: { props: BlogteaserlistProps }) {
  const [blogs, setBlogs] = useState<ISbStoryData<BlogStoryblok>[] | null>(null);

  useEffect(() => {
    if (props.type === 'automatic') {
      const componentType = componentTypeForFolder(props.folder)
      fetchStories(props.limit, componentType, { folder: props.folder }).then((response) => {
        setBlogs(response.data.stories as unknown as ISbStoryData<BlogStoryblok>[]);
      });
    } else {
      setBlogs(props.blogs);
    }
  }, [props]);

  if (!blogs) return <p>Loading...</p>;

  return (
    <BlogCardList
      blogs={blogs}
      layout={props.layout}
      showImage={props.showImage}
    />
  )
}

