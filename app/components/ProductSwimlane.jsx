import { ProductCard, Section } from '~/components';

const mockProducts = new Array(12).fill('');

export function ProductSwimlane ({
  title = 'Featured Products',
  products = mockProducts,
  count = 12,
  ...props
}) {
  return (
    <Section heading={title} padding="y" {...props} className="text-white bg-[#133C4D]">
      <div className="swimlane hiddenScroll md:pb-8 md:scroll-px-8 lg:scroll-px-12 md:px-8 lg:px-12 bg-[#133C4D] ">
        {products.map((product) => (
          <ProductCard
            product={product}
            key={product.id}
            className="snap-start w-80 text-white"
          />
        ))}
      </div>
    </Section>
  );
}
