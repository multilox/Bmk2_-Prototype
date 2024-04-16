async function getPostTextAndImages(token, version, domain) {
    try {
        const response = await fetch(`https://api.vk.com/method/wall.get?access_token=${token}&v=${version}&domain=${domain}&count=1`);
        const data = await response.json();
        const items = data.response.items;
        if (items.length > 0) {
            const post = items[0];
            const text = post.text; // текст поста
            const attachments = post.attachments || [];
            const images = attachments
                .filter(attachment => attachment.type === 'photo')
                .map(attachment => attachment.photo.sizes.find(size => size.type === 'x').url); // массив URL изображений

            if (images.length > 0) {
                return { text, images };
            } else {
                return { text, images: [] };
            }
        } else {
            return { text: '', images: [] };
        }
    } catch (error) {
        console.error('Ошибка при запросе к API VK:', error);
        return { text: '', images: [] };
    }
}

// Пример использования функции:
const TOKEN_USER = "98cb699a98cb699a98cb699afb9bdc91be998cb98cb699afed0df25645ce860329b61e3";
const VERSION = "5.199";
const DOMAIN = "kubsu_official";

getPostTextAndImages(TOKEN_USER, VERSION, DOMAIN)
    .then(({ text, images }) => {
        console.log('Текст поста:', text);
        if (images.length > 0) {
            console.log('URL изображений:', images);
        } else {
            console.log('Изображений нет.');
        }
    });