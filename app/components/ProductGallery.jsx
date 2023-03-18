import {ATTR_LOADING_EAGER} from '~/lib/const';
import {MediaFile} from '@shopify/hydrogen-react';
import {useState} from 'react';

/**
 * A client component that defines a media gallery for hosting images, 3D models, and videos of products
 */
export function ProductGallery({media, className}) {
  if (!media.length) {
    return null;
  }

  const [selectedImage, setSelectedImage] = useState(media[0]);

  return (
    <div className=" relative w-full lg:col-span-2 justify-between flex ">
      <div
        className={`grid grid-flow-row hiddenScroll gap-2 md:p-0 md:overflow-x-auto grid-cols-1 ${className}`}
      >
        {media.map((med, i) => {
          let mediaProps = {};

          const data = {
            ...med,
            image: {
              // @ts-ignore
              ...med.image,
              altText: med.alt || 'Product image',
            },
          };

          switch (med.mediaContentType) {
            case 'IMAGE':
              mediaProps = {
                width: 800,
                widths: [400, 800, 1200, 1600, 2000, 2400],
              };
              break;
            case 'VIDEO':
              mediaProps = {
                width: '100%',
                autoPlay: true,
                controls: false,
                muted: true,
                loop: true,
                preload: 'auto',
              };
              break;
            case 'EXTERNAL_VIDEO':
              mediaProps = {width: '100%'};
              break;
            case 'MODEL_3D':
              mediaProps = {
                width: '100%',
                interactionPromptThreshold: '0',
                ar: true,
                loading: ATTR_LOADING_EAGER,
                disableZoom: true,
              };
              break;
          }

          if (i === 0 && med.mediaContentType === 'IMAGE') {
            mediaProps.loading = ATTR_LOADING_EAGER;
          }

          const style = [
            ' snap-center card-image bg-white dark:bg-contrast/10 w-full cursor-pointer',
          ].join(' ');

          return (
            <div
              onClick={() => setSelectedImage(med)}
              className={style}
              // @ts-ignore
              key={med.id || med.image.id}
            >
              {/* TODO: Replace with MediaFile when it's available */}
              {/* {med.image && (
              <img
                src={data.image.url}
                alt={data.image.altText}
                className="w-full h-full aspect-square fadeIn object-cover"
              />
            )} */}
              <MediaFile
                tabIndex="0"
                className={`w-full h-12 lg:h-28  fadeIn object-contain ${
                  selectedImage.id === med.id ? 'border-2 border-white' : ''
                }`}
                data={data}
                // sizes="(min-width: 64em) 30vw, (min-width: 48em) 25vw, 90vw"
                // @ts-ignore
                options={{
                  crop: 'center',
                  scale: 2,
                }}
                {...mediaProps}
              />
            </div>
          );
        })}
      </div>
      <MediaFile
        tabIndex="0"
        className={`w-[60vw]   lg:w-full lg:h-[60vh]  fadeIn object-contain`}
        data={selectedImage}
        // sizes="(min-width: 64em) 30vw, (min-width: 48em) 25vw, 90vw"
        // @ts-ignore
        options={{
          crop: 'center',
          scale: 2,
        }}
      />
    </div>
  );
}
