

import React, { useState } from "react";
import { Button } from '~/components';
import { Link, useLoaderData, useLocation, useNavigate } from '@remix-run/react';
import { json } from '@shopify/remix-oxygen';
import { flattenConnection, Image, Money } from '@shopify/hydrogen'


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
    <>
      <div className="flex justify-start px-10 "><Button text="back" size="w-32" onClick={() => navigate(-1)} textColor="font-Inter" color="bg-transparent" hover="bg-transparent" /></div>

      <div className="flex justify-center ">
        <div className="flex flex-col justify-between items-center py-20 h-[90vh]  md:w-2/3">
          <h1 className="text-6xl font-bold font-Inter">Let us help you pick the <span className="font-normal font-GiveYouGlory text-amber-300">Perfect</span> card </h1>
          <div className="flex flex-col items-center justify-between w-full h-full pt-10">
            <div className="grid grid-cols-1 gap-20 md:grid-cols-3">
              {products?.slice(0, 3).map((cardInfo) => (
                <SuggestionsCard key={cardInfo.id} cardInfo={cardInfo} />
              ))}
            </div>
            <div className="flex items-center justify-center w-full">
              <div className="grid grid-cols-1 md:grid-cols-4 w-[30rem] ">
                {products?.slice(4, 8).map((cardInfo) => (
                  <SuggestionsCardSmall key={cardInfo.id} cardInfo={cardInfo} />
                ))}
              </div>
            </div>
            <Button
              size="w-1/3"
              textColor="text-white font-Inter"
              text="Shuffle"
              onClick={() => {
                let shuffled = [...shuffleArray(products)];
                setProducts(shuffled);
              }}
            />
          </div>
        </div>
      </div></>
  );
};

export default Index;




const SuggestionsCard = ({ cardInfo }) => {
  const { productTitle, creator } = separateTitleAndCreator(cardInfo.title)
  return (
    <div className="flex flex-col items-center justify-center space-y-4" >
<Link to={`/products/${cardInfo.handle}`}>
      {cardInfo.featuredImage.url && (

        <Image
          width={500}
          height={700}
          data={cardInfo.featuredImage}
          className="object-contain object-center rounded w-52 h-72 hover:border"
          alt={cardInfo.title}
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
