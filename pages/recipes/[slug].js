import { createClient } from "contentful";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import Image from "next/image";
const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_KEY,
});
export const getStaticPaths = async () => {
  const response = await client.getEntries({
    content_type: "recipe",
  });
  const paths = response.items.map((item) => {
    return {
      params: { slug: item.fields.slug },
    };
  });
  return {
    paths,
    fallback: true,
  };
};

export async function getStaticProps({ params }) {
  const { items } = await client.getEntries({
    content_type: "recipe",
    "fields.slug": params.slug,
  });
  return {
    props: {
      recipe: items[0],
      revalidate: 1,
    },
  };
}
export default function RecipeDetails({ recipe }) {
  const { featuredImage, title, cookingTime, method, ingredients } =
    recipe.fields;
  return (
    <div className="banner">
      <Image
        src={`https:${featuredImage.fields.file.url}`}
        width={featuredImage.fields.file.details.image.width}
        height={featuredImage.fields.file.details.image.height}
      />
      <h2>{title}</h2>
      <div className="info">
        <p>Takes about {cookingTime} minutes to cook.</p>
        <h3>Ingredients</h3>
        <ol>
          {ingredients.map((ingredient) => (
            <li key={`${ingredient}-${Math.floor(Math.round(100) * 100)}`}>
              {ingredient}
            </li>
          ))}
        </ol>
      </div>
      <div className="method">
        <h3>Method</h3>
        <div>{documentToReactComponents(method)}</div>
      </div>
      <style jsx>{`
        h2,
        h3 {
          text-transform: uppercase;
        }
        .banner h2 {
          margin: 0;
          background: #fff;
          display: inline-block;
          padding: 20px;
          position: relative;
          top: -60px;
          left: -10px;
          transform: rotateZ(-1deg);
          box-shadow: 1px 3px 5px rgba(0, 0, 0, 0.1);
        }
        .info p {
          margin: 0;
        }
      `}</style>
    </div>
  );
}
