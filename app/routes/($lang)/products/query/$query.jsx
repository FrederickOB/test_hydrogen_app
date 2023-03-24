

import React, { useState } from "react";
import { Button, Text } from '~/components';
import { Link, useLoaderData, useLocation, useNavigate } from '@remix-run/react';
import { json } from '@shopify/remix-oxygen';
import { flattenConnection, Image, Money } from '@shopify/hydrogen'
import { getImageLoadingPriority } from "~/lib/const";


export const meta = () => {
  return {
    title: 'Hydrogen',
    description: 'A custom storefront powered by Hydrogen',
  };
};

export async function loader ({ context: { storefront }, params }) {
  const { query } = params;
  const params_split = query.split("&")
  const query_params = params_split.map((text) => {
    if (text === params_split[params_split.length - 1]) {
      return `(${text})`
    } else return `(${text}) AND `
  }).join("")

  const variables = { first: 100 }
  const { products } = await storefront.query(PRODUCTS_QUERY, {
    variables: {
      ...variables, query: query_params,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
  });
  return json({ productsRes: products })
}

const Index = () => {
  const navigate = useNavigate()
  const { productsRes } = useLoaderData();
  console.log(productsRes.nodes)
  const [products, setProducts] = useState(productsRes.nodes);
  return (
    <div className="relative px-10 w-screen  bg-[#133C4D]">
      <div onClick={() => navigate(-1)} className="cursor-pointer text-white flex justify-start  absolute left-10 mt-10 space-x-4 "><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
      </svg>
        <Text className="text-white " >
          Back</Text>
      </div>

      <div className="flex justify-center ">
        <div className="flex flex-col  items-center py-20 h-full lg:min-h-[90vh] w-full  md:w-2/3">
          <h1 className="md:text-6xl text-4xl font-bold font-Inter  text-white">Let us help you pick the <span className="font-normal font-GiveYouGlory text-amber-300">Perfect</span> card </h1>
          <div className="flex flex-col items-center space-y-8 w-full h-full pt-16 ">
            <div className="grid grid-cols-1 gap-20 md:grid-cols-3">
              {products?.slice(0, 3).map((cardInfo, i) => (
                <SuggestionsCard key={cardInfo.id} cardInfo={cardInfo} i={i} />
              ))}
            </div>
            <div className="flex items-center justify-center w-full my-8 md:my-0">
              <div className="grid grid-cols-4 md:grid-cols-4 md:w-[30rem] w-fit gap-2 md:gap-0">
                {products?.slice(4, 8).map((cardInfo) => (
                  <SuggestionsCardSmall key={cardInfo.id} cardInfo={cardInfo} />
                ))}
              </div>
            </div>
            <Button
              size="w-1/3"
              onClick={() => {
                let shuffled = [...shuffleArray(products)];
                setProducts(shuffled);
              }}
            >Other Options</Button>
          </div>
        </div>
      </div>
      <div
        onClick={() => navigate('/products')}
        className="cursor-pointer flex absolute bottom-2 lg:bottom-10 right-10 space-x-4 bg-[#133C4D] py-2 justify-end text-white"
      >
        <Text className="text-white " >
          View All Our Cards</Text>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-white">
          <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
        </svg>

      </div>
    </div>
  );
};

export default Index;




const SuggestionsCard = ({ cardInfo, i }) => {
  const { productTitle, creator } = separateTitleAndCreator(cardInfo.title)
  return (
    <div className="flex flex-col items-center justify-center space-y-4 text-white" >
      <Link to={`/products/${cardInfo.handle}`}>
        {cardInfo.featuredImage.url && (

          <Image
            className="aspect-[4/5] w-full object-cover fadeIn hover:border rounded"
            widths={[320]}
            sizes="320px"
            loaderOptions={{
              crop: 'center',
              scale: 2,
              width: 320,
              height: 400,
            }}
            data={cardInfo.featuredImage}
            // className="object-contain object-center rounded w-52 h-72 hover:border"
            alt={cardInfo.title}
            loading={getImageLoadingPriority(i)}
          />
        )
        }
        <h2 className="text-xl font-bold">{productTitle}</h2>
        <p>By {creator}</p>
      </Link>
    </div >
  );
};
const SuggestionsCardSmall = ({ cardInfo }) => {
  return (
    <div className="flex items-center justify-center">
      <Link to={`/products/${cardInfo.handle}`}>
        {cardInfo.featuredImage.url && (

          <Image
            width={500}
            height={700}
            data={cardInfo.featuredImage}
            className="object-cover object-center w-20 h-32 rounded hover:border"
            alt={cardInfo.title}
          />
        )
        }
      </Link>
    </div>
  );
};

const separateTitleAndCreator = (title) => {
  const separated_title_and_creator = title.split(' by ')
  const productTitle = separated_title_and_creator[0].replace(/['"]+/g, '')
  const creator = separated_title_and_creator[1]
  return { productTitle, creator }
}


function shuffleArray (array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}


const PRODUCTS_QUERY = `#graphql
query products(
    $query: String,
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    products(first: 100, query: $query) {
    pageInfo {
      hasPreviousPage
        hasNextPage
        startCursor
        endCursor
    }

     nodes {
        id
        tags
        handle
        featuredImage{
          url
          id
          altText
          height
          width
        }
        productType
        title
      }

}
  }
`;
