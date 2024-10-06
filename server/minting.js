const apiKey = your_secret.env.CROSSMINT_API_KEY;
const chain = "solana"; // or "polygon-amoy", "ethereum-sepolia", ...
const env = "staging"; // or "www"
const recipientEmail = your_secret.env.RECIPIENT_EMAIL;
const recipientAddress = `email:${recipientEmail}:${chain}`;

const url = `https://${env}.crossmint.com/api/2022-06-09/collections/default/nfts`;
const options = {
    method: "POST",
    headers: {
        accept: "application/json",
        "content-type": "application/json",
        "x-api-key": apiKey,
    },
    body: JSON.stringify({
        recipient: recipientAddress,
        metadata: {
            name: "Crossmint Test NFT",
            image: "https://picsum.photos/400",
            description: "My first NFT using Crossmint",
        },
    }),
};

fetch(url, options)
    .then((res) => res.json())
    .then((json) => console.log(json))
    .catch((err) => console.error("error:" + err));
