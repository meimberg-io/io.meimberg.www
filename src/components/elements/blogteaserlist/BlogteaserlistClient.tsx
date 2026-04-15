'use client';

import { useEffect, useState } from 'react'
import { BlogStoryblok } from '@/types/component-types-sb'
import { ISbStoryData } from '@storyblok/react'
import { TeaserlistProps, componentTypeForFolder } from './renderTeaserlist'
import { fetchStories } from '@/lib/storyblokApi'
import { BlogCardList } from './BlogCardList'


export default function BlogteaserlistClient({ props }: { props: TeaserlistProps }) {
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
    />
  )
}

