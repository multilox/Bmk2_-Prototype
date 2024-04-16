const TOKEN_USER = "98cb699a98cb699a98cb699afb9bdc91be998cb98cb699afed0df25645ce860329b61e3";
const VERSION = "5.199";
const DOMAIN = "kubsu_official";
function getPostTextAndImages(token, version, domain) {
    return new Promise((resolve, reject) => {
        const callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
        const script = document.createElement('script');
        script.src = `https://api.vk.com/method/wall.get?access_token=${token}&v=${version}&domain=${domain}&count=10&offset=1&callback=${callbackName}`;
        script.onerror = reject;

        window[callbackName] = function(data) {
            delete window[callbackName];
            document.body.removeChild(script);
            resolve(data);
        };

        document.body.appendChild(script);
    });
}



function updateNews() {
    const newsContainer = document.getElementById("news-container");

    // Очищаем текущий контент в блоке новостей
    newsContainer.innerHTML = "";

    getPostTextAndImages(TOKEN_USER, VERSION, DOMAIN)
        .then(data => {
            const items = data.response.items;
            items.forEach(post => {
                const text = post.text;
                const attachments = post.attachments || [];
                const images = attachments
                    .filter(attachment => attachment.type === 'photo')
                    .map(attachment => attachment.photo.sizes.find(size => size.type === 'x').url);

                // Создаем элемент новости
                const newsItem = document.createElement("div");
                newsItem.classList.add("news-item");
                // Создаем текст новости
                const newsText = document.createElement("p");
                newsText.textContent = text;
                newsText.classList.add("news-text");
                newsItem.appendChild(newsText);

                // Добавляем новость в блок
                newsContainer.appendChild(newsItem);

                // Если изображений больше 1, создаем карусель
                if (images.length > 1) {
                    // Создаем карусель Bootstrap
                    const carousel = document.createElement("div");
                    carousel.classList.add("carousel");
                    carousel.classList.add("slide");
                    carousel.setAttribute("data-bs-ride", "carousel");

                    // Создаем слайды карусели
                    const inner = document.createElement("div");
                    inner.classList.add("carousel-inner");
                    images.forEach((imageUrl, index) => {
                        const slide = document.createElement("div");
                        slide.classList.add("carousel-item");
                        if (index === 0) {
                            slide.classList.add("active");
                        }
                        const image = document.createElement("img");
                        image.src = imageUrl;
                        image.classList.add("d-block");
                        image.classList.add("w-100");
                        slide.appendChild(image);
                        inner.appendChild(slide);
                    });
                    carousel.appendChild(inner);

                    // Создаем кнопки управления каруселью
                    const prevButton = document.createElement("button");
                    prevButton.classList.add("carousel-control-prev");
                    prevButton.type = "button";
                    prevButton.setAttribute("data-bs-target", "#news-carousel");
                    prevButton.setAttribute("data-bs-slide", "prev");
                    prevButton.innerHTML = `<span class="carousel-control-prev-icon" aria-hidden="true"></span><span class="visually-hidden">Previous</span>`;

                    const nextButton = document.createElement("button");
                    nextButton.classList.add("carousel-control-next");
                    nextButton.type = "button";
                    nextButton.setAttribute("data-bs-target", "#news-carousel");
                    nextButton.setAttribute("data-bs-slide", "next");
                    nextButton.innerHTML = `<span class="carousel-control-next-icon" aria-hidden="true"></span><span class="visually-hidden">Next</span>`;

                    carousel.appendChild(prevButton);
                    carousel.appendChild(nextButton);

                    // Добавляем карусель в элемент новости
                    newsItem.appendChild(carousel);
                } else if (images.length === 1) {
                    // Если изображение одно, создаем его без карусели
                    const image = document.createElement("img");
                    image.src = images[0];
                    image.classList.add("d-block");
                    image.classList.add("w-100");
                    newsItem.appendChild(image);
                }


            });
        })
        .catch(error => {
            console.error('Ошибка при получении данных:', error);
        });
}

// Вызываем функцию обновления новостей
updateNews();




