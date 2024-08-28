
// Function to fetch product info from OpenFoodFacts
async function fetchFromOpenFoodFacts(barcode) {
    const apiUrl = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`;

    try {
        const response = await fetch(apiUrl);
        const productInfo = await response.json();

        if (response.ok && productInfo.status === 1) {
            // console.log('Product found on OpenFoodFacts:', productInfo.product);
            return {
              product_name : productInfo.product.product_name,
              product_price: null,
              product_brand:productInfo.product.brands,
              product_manufacturing_date: productInfo.product.entry_dates_tags[0],
              product_expiry_date: null,
              product_country_of_origin: null,
              product_description: null,
              product_images:[productInfo.product.image_nutrition_url, productInfo.product.image_url, productInfo.product.image_front_url]
          
            };

        } else {
            throw new Error('Product not found on OpenFoodFacts');
        }
    } catch (error) {
        console.error(error.message);
        return null;
    }
}



// Function to fetch product info from UPCItemDB
async function fetchFromUPCItemDB(barcode) {
  const apiUrl = `https://api.upcitemdb.com/prod/trial/lookup?upc=${barcode}`;

  try {
      const response = await fetch(apiUrl);
      
      
      // Check if the HTTP response status is OK
      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const productInfo = await response.json();

      // Check if the response contains product information
      if (productInfo.code === 'OK' && productInfo.items.length > 0) {
        //   console.log('Product found on UPCItemDB:', productInfo.items[0]);
          const product = productInfo.items[0];
          return {
              product_name: product.title,
              product_price: product.currency  + ((product.lowest_recorded_price + product.highest_recorded_price) / 2).toFixed(2) || productInfo.offers[0].currency  + productInfo.offers[0].price,
              product_brand: product.brand,
              product_manufacturing_date: null,  // You can update this if the information is available
              product_expiry_date: null,         // You can update this if the information is available
              product_country_of_origin: product.country, // If country is available in response
              product_description: product.description,
              product_images: product.images
          };
      } else {
          throw new Error('Product not found on UPCItemDB or invalid response');
      }
  } catch (error) {
      console.error('Error fetching product info:', error.message);
      return null;
  }
}


async function lookupProduct(barcode) {
    let product = await fetchFromOpenFoodFacts(barcode);

    if (!product) {
        product = await fetchFromUPCItemDB(barcode);
    }

    if (product) {
        console.log('Final Product Info:', product);
    } else {
        console.log('Product not found in both databases.');
    }
}

// Call the function with the barcode data
// lookupProduct('5000213019160');
// lookupProduct('6034096253193');
// lookupProduct('6974162530009');
// lookupProduct('6033000089212');
// lookupProduct('9780062276452');



async function testFetch() {
    console.log(await fetchFromUPCItemDB('9780062276452'));
}

testFetch();



