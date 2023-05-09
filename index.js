const express = require('express');
const app = express();

const axios = require('axios');
const wpAPI = 'https://tematest.altervista.org/wp-json/wp/v2';
const WP_USERNAME = 'aiutante_mago';
const WP_PASSWORD = 'KksrV5Vk(Y&JFO*M';
const WP_API_URL = 'https://tematest.altervista.org/wp-json/wp/v2';
const CHATGPT_API_URL = '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';

const queryArray = [
    'Scrivi un articolo su un argomento di tecnologia',
    'Scrivi un articolo su un argomento di viaggio',
    'Scrivi un articolo su un argomento di cucina',
    'Scrivi un articolo su un argomento di sport',
    'Scrivi un articolo su un argomento di scienza'
];

const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

function getRandomQuery() {
    const randomIndex = Math.floor(Math.random() * queryArray.length);
    return queryArray[randomIndex];
}

async function generatePostContent(prompt, length) {
    const response = await axios.post(CHATGPT_API_URL, {
        prompt: prompt,
        max_tokens: length,
        n: 1,
        stop: '\n'
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + process.env.OPENAI_API_KEY
        }
    });
    return response.data.choices[0].text;
}

async function createNewPost(content) {
    const response = await axios.post(wpAPI, {
        title: content.title,
        content: content.content,
        status: 'publish'
    }, {
        auth: {
            username: WP_USERNAME,
            password: WP_PASSWORD
        },
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data.id;
}

async function main() {
    const query = getRandomQuery();
    const postContent = await generatePostContent(query, 500);
    const postTitle = postContent.split('\n')[0].trim();
    const postID = await createNewPost({ title: postTitle, content: postContent });
    console.log(`Post ${postID} created successfully`);
}

main();