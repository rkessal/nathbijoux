import { createClient, groq } from "next-sanity";
import _ from "lodash";
import { Product, Taxon, Taxonomy, Variant } from "@typings/models";
import {
  SanityCountry,
  SanityProduct,
  SanityTaxon,
  SanityTaxonomy,
  SanityVariant
} from "./typings";
import { parseLocale } from "@utils/parser";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID as string,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET as string,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION as string,
  useCdn: process.env.NODE_ENV === "production" // `false` to ensure fresh data
});

const parsingVariant = (variants: SanityVariant[]): Variant[] => {
  return !_.isEmpty(variants)
    ? variants.map((variant) => {
        const localization = {
          name: variant?.name?.["en_us"] || "",
          size: { name: variant?.size?.name?.["en_us"] || "" }
        };
        return { ...variant, ...localization };
      })
    : [];
};

const parsingProduct = (
  products: SanityProduct[] | SanityProduct,
  ): Product[] | Product => {
  return _.isArray(products)
    ? products.map((product) => {
        const localization = {
          name: product?.name["en_us"] ?? null,
          slug: product?.slug["en_us"].current,
          description: product.description ? product?.description["en_us"] : null as any,
          variants: parsingVariant(product?.variants) as Variant[]
        };
        return { ...product, ...localization };
      })
    : {
        ...products,
        name: products?.name["en_us"] ?? null,
        slug: products?.slug["en_us"].current,
        description: products?.description ? products?.description["en_us"] : null as any,
        variants: parsingVariant(products?.variants) as Variant[]
      };
};

const parsingTaxon = (taxons: SanityTaxon[], lang = "en_us"): Taxon[] => {
  return taxons.map((taxon) => {
    const localization = {
      slug: taxon?.slug[lang]?.current,
      name: taxon?.name[lang] ?? null,
      label: taxon?.label[lang],
      products: taxon?.products ? (parsingProduct(taxon.products) as Product[]) : []
    };
    return { ...taxon, ...localization };
  });
};

const parsingTaxonomies = (taxonomies: SanityTaxonomy[], locale = "en-US"): Taxonomy[] => {
  const lang = parseLocale(locale, "_", "-", "lowercase");
  const items = taxonomies.map((taxonomy) => {
    const localization = {
      name: taxonomy?.name[lang],
      label: taxonomy?.label[lang],
      taxons: parsingTaxon(taxonomy?.taxons, lang)
    };
    return { ...taxonomy, ...localization };
  });
  return items;
};

const getAllCountries = async (locale = "en-US") => {
  const lang = parseLocale(locale, "_", "-", "lowercase");
  const query = groq`*[_type == "country"]{
    name,
    code,
    marketId,
    defaultLocale,
    "image": {
      "url": image.asset->url
    },
    'catalog': {
      'id': catalog->_id
    }
  } | order(name["${lang}"] asc)`;
  const countries = await client.fetch<SanityCountry[]>(query);
  return countries.map((country) => {
    const localization = {
      name: country?.name[lang]
    };
    return { ...country, ...localization };
  });
};

const getAllTaxonomies = async (catalogId: string, locale = "en-US") => {
  const query = groq`*[_type == "catalog" && _id == '${catalogId}']{
    'taxonomies': taxonomies[]->{
      label,
      name,
      'taxons': taxons[]->{
        label,
        name,
        slug,
        'products': products[]->{
          name,
          description,
          reference,
          slug,
          'images': images[]->{
            'url': images.asset->url
          },
          'variants': variants[]->{
            code,
            name,
            size->,
          }    
        }
      }
    }
  }  | order(name asc)`;
  const items: any[] = await client.fetch(query);
  return parsingTaxonomies(_.first(items)?.taxonomies, locale);
};

const getProduct = async (slug: string) => {
  const query = groq`*[_type == "product" && slug.en_us.current == '${slug}']{
    name,
    description,
    reference,
    slug,
    'images': images[]->{
      'url': images.asset->url
    },
    'variants': variants[]->{
      label,
      code,
      name,
      size->,
      'images': images[]->{
        'url': images.asset->url
      }
    }    
  }`;
  const item: any[] = await client.fetch(query);
  return parsingProduct(_.first(item));
};

// const images = async () => {

// function normalizeName(name) {
//   return name
//     .replace(/\([0-9]+\)/g, "") // (2), (3)
//     .replace(/\(face[^\)]*\)/gi, "") // (face 1), (face 2)
//     .replace(/[ _-]+$/, "") // trailing _, -, space
//     .trim();
// }


//   async function linkImages() {
//   // 1️⃣ Fetch product images
//   const images = await client.fetch("*[_type == \"productImage\"]{_id, name {en_us}}");

//   // 2️⃣ Group images by normalized name
//   const imageMap = {};
//   images.forEach(img => {
//     console.log(img);
//     const norm = normalizeName(img.name.en_us);
//     if (!imageMap[norm]) imageMap[norm] = [];
//     imageMap[norm].push(img._id);
//   });

//   // 3️⃣ Fetch variants
//   const variants = await client.fetch(`*[_type == "variant"]{
//     _id,
//     name,
//   }`);

//   // 4️⃣ Patch variants with references
//   for (const variant of variants) {
//     const norm = normalizeName(variant.name.en_us);
//     const imageIds = imageMap[norm];
//     if (imageIds && imageIds.length > 0) {
//       const references = imageIds.map(id => ({
//         _key: Math.random().toString(36).substr(2, 8),
//         _ref: id,
//         _type: "reference"
//       }));
//       await client.patch(variant._id)
//         .set({ description: variant.name.en_us })
//         .commit();
//       console.log(`✅ Linked ${references.length} images (${imageMap[norm]}) to variant "${variant.name.en_us}"`);
//     }
//   }
// }
// linkImages().catch(console.error);
// };

// const mapVariantsToProducts = async () => {
//   function normalizeName(name) {
//     return name
//       .replace(/\([0-9]+\)/g, "") // Remove (2), (3), etc.
//       .replace(/\(face[^\)]*\)/gi, "") // Remove (face 1), (face 2), etc.
//       .replace(/\s+[0-9]+mm/gi, "") // Remove standalone numbers with mm (e.g., "5mm")
//       .replace(/\s+[0-9]+$/g, "") // Remove trailing standalone numbers
//       .replace(/[ *-]+$/, "") // Remove trailing *, -, space
//       .trim();
//   }

//   function normalizeSlug(name) {
//     return name
//       .toLowerCase()
//       .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric with hyphen
//       .replace(/^-+|-+$/g, "") // Trim leading/trailing hyphens
//       .replace(/-+/g, "-"); // Collapse multiple hyphens
//   }

//   async function createProductsFromVariants() {
//     const products = await client.fetch("*[_type == \"product\"][dateTime(_createdAt) > dateTime(now()) - 60*10]{_id}");
//     products.forEach(async (product) => {
//       await new Promise((resolve) => setTimeout(resolve, 500));
//       // await client.delete(product._id);
//       console.log(`Deleted product ${product._id}`);
//     });

//     console.log(products.length);
//     console.log("🔍 Starting variant to product mapping and creation...\n");
//     return;

//     // 1️⃣ Fetch all variants
//     const variants = await client.fetch(`*[_type == "variant"][dateTime(_createdAt) > dateTime(now()) - 60*60*24]{
//       _id,
//       code,
//       name,
//       images
//     }`);

//     console.log(`📦 Found ${variants.length} variants\n`);

//     // 2️⃣ Create mapping from variants to products
//     const productMap = {};
//     const variantToProductList = [];

//     variants.forEach(variant => {
//       const originalName = variant.name.en_us;
//       const productName = normalizeName(originalName);
//       const code = variant.code;
//       const slug = normalizeSlug(productName);
//       const image = variant.images;
//       console.log(variant);

//       const mapping = {
//         variantId: variant._id,
//         variantName: originalName,
//         productName: productName,
//         productSlug: slug,
//         productImage: image,
//         code
//       };

//       variantToProductList.push(mapping);

//       // Group variants by product name
//       if (!productMap[productName]) {
//         productMap[productName] = [];
//       }
//       productMap[productName].push(mapping);
//     });
//     console.log(productMap);

//     // 3️⃣ Create products and link variants
//     console.log("🏭 Creating products and linking variants...\n");

//     for (const [productName, variantMappings] of Object.entries(productMap)) {
//       // Use the code from the last variant (or only variant)
//       const lastVariant = variantMappings[variantMappings.length - 1];
//       const productCode = lastVariant.code;

//       console.log(`Creating product "${productName}" with code "${productCode}"`);

//       // Create the product document
//       const productDoc = {
//         _type: "product",
//         name: {
//           en_us: productName
//         },
//         description: { en_us: productName },
//         reference: productCode,
//         images: lastVariant.productImage,
//         slug: {
//           _type: "slug",
//           en_us: {
//             current: lastVariant.productSlug
//         } },
//         // Create references to all variants for this product
//         variants: variantMappings.map(mapping => ({
//           _key: Math.random().toString(36).substr(2, 8),
//           _ref: mapping.variantId,
//           _type: "reference"
//         }))
//       };

//       console.log(productDoc);

//       try {
//         // const createdProduct = await client.createIfNotExists(productDoc);
//         console.log(`✅ Created product "${productName}" (ID: ${createdProduct._id}) with ${variantMappings.length} variant(s)`);

//         // Log which variants are linked
//         variantMappings.forEach((mapping, index) => {
//           console.log(`   ${index + 1}. "${mapping.variantName}" (${mapping.variantId})`);
//         });
//         console.log();

//       } catch (error) {
//         // console.error(`❌ Failed to create product "${productName}":`, error.message);
//       }
//     }

//     // 4️⃣ Summary statistics
//     console.log("📊 SUMMARY:");
//     console.log("=" .repeat(60));
//     console.log(`Total variants processed: ${variants.length}`);
//     console.log(`Total products created: ${Object.keys(productMap).length}`);

//     const multiVariantProducts = Object.entries(productMap).filter(([, variants]) => variants.length > 1);
//     console.log(`Products with multiple variants: ${multiVariantProducts.length}`);

//     if (multiVariantProducts.length > 0) {
//       console.log("\n🔄 Products with multiple variants:");
//       multiVariantProducts.forEach(([productName, variants]) => {
//         const lastVariantCode = variants[variants.length - 1].code;
//         console.log(`   • "${productName}" (${variants.length} variants, code: ${lastVariantCode})`
//         );
//       });
//     }

//     return { productMap, variantToProductList };
//   }

//   // Execute the creation
//   const result = await createProductsFromVariants();
//   return result;
// };
// ment to run:
// mapVariantsToProducts().catch(console.error);

const sanityApi: Record<string, any> = {
  getAllCountries,
  getAllTaxonomies,
  getProduct
};

export default sanityApi;
