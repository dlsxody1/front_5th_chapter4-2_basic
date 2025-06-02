async function loadProducts() {
  const response = await fetch("https://fakestoreapi.com/products");
  const products = await response.json();
  displayProducts(products);
}

function displayProducts(products) {
  const container = document.querySelector("#all-products .container");
  const fragment = document.createDocumentFragment();

  products.forEach((product, index) => {
    // Create the main product div
    const productElement = document.createElement("div");
    productElement.classList.add("product");

    // Create the product picture div
    const pictureDiv = document.createElement("div");
    pictureDiv.classList.add("product-picture");
    const img = document.createElement("img");

    if (index < 3) {
      img.src = product.image;
      img.loading = "eager";
    } else {
      img.src = product.image;
      img.loading = "lazy";
    }

    img.alt = `product: ${product.title}`;
    img.width = 250;
    pictureDiv.appendChild(img);

    const infoDiv = document.createElement("div");
    infoDiv.classList.add("product-info");

    const category = document.createElement("h5");
    category.classList.add("categories");
    category.textContent = product.category;

    const title = document.createElement("h4");
    title.classList.add("title");
    title.textContent = product.title;

    const price = document.createElement("h3");
    price.classList.add("price");
    const priceSpan = document.createElement("span");
    priceSpan.textContent = `US$ ${product.price}`;
    price.appendChild(priceSpan);

    const button = document.createElement("button");
    button.textContent = "Add to bag";

    infoDiv.appendChild(category);
    infoDiv.appendChild(title);
    infoDiv.appendChild(price);
    infoDiv.appendChild(button);

    productElement.appendChild(pictureDiv);
    productElement.appendChild(infoDiv);

    // DocumentFragment에 추가 (DOM에는 아직 추가 안됨)
    fragment.appendChild(productElement);
  });

  // 한 번에 DOM에 추가 (리플로우 최소화)
  container.appendChild(fragment);
}

// 무거운 연산을 requestAnimationFrame으로 분할 처리
function heavyCalculationOptimized(
  totalIterations = 10000000,
  chunkSize = 100000
) {
  return new Promise((resolve) => {
    let currentIteration = 0;

    function processChunk() {
      const endIteration = Math.min(
        currentIteration + chunkSize,
        totalIterations
      );

      for (let i = currentIteration; i < endIteration; i++) {
        const temp = Math.sqrt(i) * Math.sqrt(i);
      }

      currentIteration = endIteration;

      if (currentIteration < totalIterations) {
        requestAnimationFrame(processChunk);
      } else {
        resolve("계산 완료");
      }
    }

    processChunk();
  });
}

async function initializeApp() {
  // 1. 먼저 제품 로딩
  await loadProducts();

  // 2. UI가 준비된 후 무거운 계산 시작 (비동기)
  await heavyCalculationOptimized();
}

initializeApp();
