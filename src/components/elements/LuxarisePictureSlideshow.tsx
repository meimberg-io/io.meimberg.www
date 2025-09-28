'use client'

import React, { useState, useEffect } from 'react'
import { storyblokEditable } from '@storyblok/react/rsc'
import { LuxarisePictureStoryblok } from '@/types/component-types-sb'
import Image from 'next/image'
import ElementWrapper from '@/components/layout/ElementWrapper.tsx'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { getStoryblokApi } from '@/lib/storyblok'
import { ISbStoryData } from '@storyblok/react'

interface LuxarisePictureSlideshowProps {
  blok: {
    pictures: (LuxarisePictureStoryblok | string)[]
    spacing?: 'default' | 'large'
    [k: string]: any
  }
}

export default function LuxarisePictureSlideshow({ blok }: LuxarisePictureSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [resolvedPictures, setResolvedPictures] = useState<ISbStoryData<LuxarisePictureStoryblok>[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const pictures = blok.pictures || []

  // Manually resolve picture relations
  useEffect(() => {
    const resolvePictures = async () => {
      if (!pictures.length) {
        setIsLoading(false)
        return
      }

      try {
        const storyblokApi = getStoryblokApi()
        
        // Check if pictures are already resolved (objects) or are UUIDs (strings)
        const hasUnresolvedPictures = pictures.some(picture => typeof picture === 'string')
        
        if (hasUnresolvedPictures) {
          // Extract UUIDs from the pictures array
          const uuids = pictures.filter(picture => typeof picture === 'string') as string[]
          
          // Storyblok by_uuids has a limit of 25 stories per request
          // Fetch in batches of 25 to handle all pictures
          const batchSize = 25
          const batches = []
          for (let i = 0; i < uuids.length; i += batchSize) {
            batches.push(uuids.slice(i, i + batchSize))
          }
          
          // Fetch all batches in parallel
          const batchPromises = batches.map(batch => 
            storyblokApi.get('cdn/stories', {
              by_uuids: batch.join(','),
              version: 'published'
            })
          )
          
          const batchResults = await Promise.all(batchPromises)
          
          // Combine all stories from all batches
          const allStories = batchResults.flatMap(result => result.data.stories)
          
          // Map the fetched stories back to the original order
          const resolved = pictures.map(picture => {
            if (typeof picture === 'string') {
              return allStories.find(story => story.uuid === picture)
            }
            return picture
          }).filter(Boolean) as ISbStoryData<LuxarisePictureStoryblok>[]
          
          setResolvedPictures(resolved)
        } else {
          // Pictures are already resolved
          setResolvedPictures(pictures as ISbStoryData<LuxarisePictureStoryblok>[])
        }
      } catch (error) {
        console.error('Error resolving pictures:', error)
        setResolvedPictures([])
      } finally {
        setIsLoading(false)
      }
    }

    resolvePictures()
  }, [pictures])

  // Auto-advance slideshow every 15 seconds
  useEffect(() => {
    if (resolvedPictures.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === resolvedPictures.length - 1 ? 0 : prevIndex + 1
      )
    }, 15000)

    return () => clearInterval(interval)
  }, [resolvedPictures.length])

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? resolvedPictures.length - 1 : currentIndex - 1)
  }

  const goToNext = () => {
    setCurrentIndex(currentIndex === resolvedPictures.length - 1 ? 0 : currentIndex + 1)
  }

  if (isLoading) {
    return (
      <ElementWrapper spacing={blok.spacing}>
        <div {...storyblokEditable(blok)} className="text-center py-8">
          <p className="text-gray-500">Loading slideshow...</p>
        </div>
      </ElementWrapper>
    )
  }

  if (resolvedPictures.length === 0) {
    return (
      <ElementWrapper spacing={blok.spacing}>
        <div {...storyblokEditable(blok)} className="text-center py-8">
          <p className="text-gray-500">No pictures available</p>
        </div>
      </ElementWrapper>
    )
  }

  const currentPicture = resolvedPictures[currentIndex]
  const pictureContent = currentPicture?.content

  // Debug logging
  console.log('Slideshow Debug:', {
    resolvedPicturesLength: resolvedPictures.length,
    currentIndex,
    currentPicture,
    pictureContent,
    isLoading
  })

  return (
    <ElementWrapper spacing={blok.spacing}>
      <div {...storyblokEditable(blok)} className="relative">
        {/* Slideshow Container */}
        <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Navigation Buttons */}
            {resolvedPictures.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
                  aria-label="Previous picture"
                >
                  <ChevronLeftIcon className="w-6 h-6 text-gray-700" />
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
                  aria-label="Next picture"
                >
                  <ChevronRightIcon className="w-6 h-6 text-gray-700" />
                </button>
              </>
            )}

              {/* Picture Display */}
              <div className="aspect-square relative overflow-hidden bg-gray-200">
                {pictureContent?.pic_big?.filename ? (
                  <Image
                    src={pictureContent.pic_big.filename}
                    alt={pictureContent.title || pictureContent.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                    priority={currentIndex < 3}
                    unoptimized={false}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <p className="text-gray-500">
                      {typeof currentPicture === 'string'
                        ? 'Loading picture data...'
                        : 'No image available'
                      }
                    </p>
                  </div>
                )}
              </div>

          {/* Title and Abstract Box */}
          <div className="bg-white p-6">
            <h3 className="text-2xl font-bold mb-3 text-gray-900">
              {pictureContent?.title || pictureContent?.name || 
               (typeof currentPicture === 'string' ? 'Loading...' : 'Untitled')
              }
            </h3>
            {pictureContent?.abstract ? (
              <p className="text-gray-700 leading-relaxed">
                {pictureContent.abstract}
              </p>
            ) : typeof currentPicture === 'string' ? (
              <p className="text-gray-500">Loading content...</p>
            ) : null}
          </div>
        </div>

            {/* Slide Indicators */}
            {resolvedPictures.length > 1 && (
              <div className="flex justify-center mt-4 space-x-2">
                {resolvedPictures.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentIndex
                    ? 'bg-blue-600 scale-110'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Slide Counter */}
        {resolvedPictures.length > 1 && (
          <div className="text-center mt-2 text-sm text-gray-500">
            {currentIndex + 1} / {resolvedPictures.length}
          </div>
        )}
      </div>
    </ElementWrapper>
  )
}
