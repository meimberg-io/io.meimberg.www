'use client';

import { useEffect, useState } from 'react'
import { BlogStoryblok } from '@/types/component-types-sb'
import { ISbStoryData } from '@storyblok/react'
import { BlogteaserlistProps } from '@/components/elements/blogteaserlist/Blogteaserlist.tsx'
import { COMPONENTTYPE_BLOG, fetchStories } from '@/lib/storyblok.ts'
import { BlogCardList } from '@/components/elements/blogteaserlist/BlogCardList.tsx'


export default function BlogteaserlistClient({ props }: { props: BlogteaserlistProps }) {
  const [blogs, setBlogs] = useState<ISbStoryData<BlogStoryblok>[] | null>(null);

  useEffect(() => {
    if (props.type === 'automatic') {
      fetchStories(props.limit, COMPONENTTYPE_BLOG, props.folder).then((response) => {
        setBlogs(response.data.stories as unknown as ISbStoryData<BlogStoryblok>[]);
      });
    } else {
      setBlogs(props.blogs);
    }
  }, [props]);

  if (!blogs) return <p>Loading...</p>;

  return <BlogCardList blogs={blogs} layout={props.layout} />;
}

