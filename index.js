const fs = require('fs');
const http = require('http');
const url = require('url');

const replaceTemplate = require(`./modules/replaceTemplate`);
const templateOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const templateProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const templateCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);



const server = http.createServer((req, res) => {
    const { query, pathname: path } = url.parse(req.url, true);
    // Overview page
    if (path === '/' || path === '/overview') {
        res.writeHead(200, { 'content-type': 'text/html' });
        const cardHtml = dataObj.map((element) => {
            return replaceTemplate(templateCard, element);
        }).join('');
        // console.log(cardHtml);
        const output = templateOverview.replace('{!PRODUCT_CARDS!}', cardHtml);
        res.end(output)

        // Product page
    } else if (path === '/product') {
        let product = dataObj[query.id];
        const output = replaceTemplate(templateProduct, product);
        res.end(output)

        // API page
    } else if (path === '/api') {
        res.writeHead(200, { 'content-type': 'application/json' });
        res.end(data);

        // NOT Found 
    } else {
        res.writeHead(404, {
            'content-type': 'text/html'
        })
        res.end("<h1>404 PAGE NOT FOUND</h1>");
    }
})
server.listen('8000', '127.0.0.1', () => console.log("Listening on port 8000"))