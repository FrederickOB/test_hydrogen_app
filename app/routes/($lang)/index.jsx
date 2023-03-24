import { useState } from "react";
import { Button, Select } from "~/components";
import { useLoaderData, useNavigate } from '@remix-run/react';
import { json } from '@shopify/remix-oxygen';
import { cardRelationship } from '~/lib/data'

export const meta = () => {
  return {
    title: 'Hydrogen',
    description: 'A custom storefront powered by Hydrogen',
  };
};

export async function loader ({ context: { storefront } }) {
  const variables = { first: 100 }
  const { productTags } = await storefront.query(TAGS_QUERY, {
    variables: {
      ...variables,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
  });
  const { productTypes } = await storefront.query(TYPES_QUERY, {
    variables: {
      ...variables,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
  });
  return json({ productTags, productTypes })
}

export default function Index () {
  const navigate = useNavigate();
  const { productTags, productTypes } = useLoaderData();
  const [relationshipData, setRelationshipData] = useState([
    { type: "business" },
    { type: "personal" },
  ]);
  const [relationship, setRelationship] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState('');

  return (
    <div className="flex justify-center bg-[#133C4D] ">
      <div className="flex flex-col justify-between items-center py-20 h-full md:h-[90vh]  md:w-2/3">
        <h1 className="md:text-6xl text-4xl font-bold font-Inter px-10 text-white">Let us help you pick the <span className="font-normal font-GiveYouGlory text-amber-300">Perfect</span> card </h1>
        <div className="flex flex-col items-center justify- py-10 md:py-20 w-full h-[80%] text-white">
          <div className="grid w-full grid-cols-1 gap-20 p-10 md:grid-cols-3">
            <div className="">
              <Select
                data={relationshipData}
                label="relationship type"
                itemName="type"
                value={relationship}
                setValue={(value) => setRelationship(value)}
              />
            </div>
            <div className="">
              <Select
                data={productTypes.edges}
                label="what is the occasion"
                itemName="node"
                value={category}
                setValue={(value) => setCategory(value)}
              />
            </div>
            <div className="">
              <Select
                data={cardRelationship[relationship.type]}
                label="who is it for"
                itemName="name"
                value={tags}
                setValue={(value) => setTags(value)}
              />
            </div>
          </div>

        </div>
        <Button
          onClick={() => {
            return navigate(
              `/products/query/tag:${tags.node}&product_type:${category.node}`,
            );
          }}

          disabled={!category || !relationship || !tags}
          width="1/3"
        >  See Our Recommendations </Button>
      </div></div>
  );
}




const TAGS_QUERY = `#graphql
query productTags(
  $country: CountryCode
  $language: LanguageCode
) @inContext(country: $country, language: $language) {
  productTags(first: 100) {
    edges {
      cursor
      node
    }
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
  }
}
`;
const TYPES_QUERY = `#graphql
query productTypes(
  $country: CountryCode
  $language: LanguageCode
) @inContext(country: $country, language: $language) {
  productTypes(first: 100) {
    edges {
      cursor
      node
    }
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
  }
}
`;


