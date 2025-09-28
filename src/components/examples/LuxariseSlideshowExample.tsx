// Example usage of LuxarisePictureSlideshow component
// This file demonstrates how to use the slideshow component

import LuxarisePictureSlideshow from '@/components/elements/LuxarisePictureSlideshow.tsx'

// Example data structure - this would typically come from Storyblok
const examplePictures = [
  {
    component: "luxarise_picture" as const,
    _uid: "example-1",
    title: "Beautiful Landscape",
    name: "landscape-1",
    abstract: "A stunning landscape photograph showcasing the natural beauty of the mountains and valleys.",
    pic_big: {
      fieldtype: "asset" as const,
      filename: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
      alt: "Mountain landscape",
      name: "landscape",
      title: "Mountain Landscape",
      focus: null,
      id: 1
    },
    pic_thumb: {
      fieldtype: "asset" as const, 
      filename: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=150&fit=crop",
      alt: "Mountain landscape thumbnail",
      name: "landscape-thumb",
      title: "Mountain Landscape Thumbnail",
      focus: null,
      id: 2
    }
  },
  {
    component: "luxarise_picture" as const,
    _uid: "example-2", 
    title: "Ocean Sunset",
    name: "sunset-1",
    abstract: "A breathtaking sunset over the ocean with vibrant colors painting the sky.",
    pic_big: {
      fieldtype: "asset" as const,
      filename: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop",
      alt: "Ocean sunset",
      name: "sunset",
      title: "Ocean Sunset",
      focus: null,
      id: 3
    },
    pic_thumb: {
      fieldtype: "asset" as const,
      filename: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&h=150&fit=crop", 
      alt: "Ocean sunset thumbnail",
      name: "sunset-thumb",
      title: "Ocean Sunset Thumbnail",
      focus: null,
      id: 4
    }
  }
]

export default function LuxariseSlideshowExample() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Luxarise Picture Slideshow Example</h1>
      
      <LuxarisePictureSlideshow 
        blok={{
          pictures: examplePictures,
          spacing: 'large'
        }} 
      />
      
      <div className="mt-8 p-6 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Usage Instructions:</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          <li>Create a new component in Storyblok with the name &quot;luxarise_picture_slideshow&quot;</li>
          <li>Add a field called &quot;pictures&quot; of type &quot;options&quot; that references &quot;luxarise_picture&quot; content type</li>
          <li>Add an optional &quot;spacing&quot; field with options &quot;default&quot; or &quot;large&quot;</li>
          <li>The component will automatically display the pictures in a slideshow format</li>
          <li>Users can navigate using the left/right arrow buttons or click the dots below</li>
          <li>The slideshow auto-advances every 15 seconds</li>
        </ol>
      </div>
    </div>
  )
}
