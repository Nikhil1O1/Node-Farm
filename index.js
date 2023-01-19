const fs = require('fs');
const http = require('http');
const url = require('url');

const path  = './txt/start.txt';

// const t = fs.readFileSync(path, 'utf-8');


// const hello = 'Hey';
// console.log(t);

// fs.readFile('./txt/start.txt','utf-8',(err,data1) =>{
//     fs.readFile(`./txt/${data1}.txt`,'utf-8',(err,data2) =>{          //read this in url
//         console.log(data2);
//         fs.readFile(`./txt/append.txt`,'utf-8',(err,data3) =>{
//             console.log(data3);
//             fs.writeFile('./txt/start.txt',`${data2}\n${data3}`, 'utf-8', err=>{
//                 console.log("file written");
//             })
//         });
//     });
// });
//     console.log('read ready to go');

////////////////////////////////
///SERVER

const replacteTemplate = (temp, product) => {
    let output  = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%NUTRIENT%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%ID%}/g, product.id);


    if(!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    return output;
}
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');


const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
    const {query, pathname} = url.parse(req.url, true);
    
    ///OVERVIEW PAGE
    if(pathname === '/' || pathname === '/overview'){
        res.writeHead(200,{'Content-type':'text/html'})

        const cardHtml = dataObj.map(el => replacteTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardHtml);
        res.end(output);
    }
    else if(pathname === '/product'){
        console.log(query);
        res.writeHead(200,{'Content-type':'text/html'});
        const product = dataObj[query.id];
        const output = replacteTemplate(tempProduct, product);
        res.end(output);
    }
    else if(pathname === '/api'){
    // console.log(productData);
    res.writeHead(200,{'Content-type':'application/json'})
    res.end(data);
        } 
        
    /// NOT FOUND
    else{
        res.writeHead(404,{
            'Content-type': 'text/html',
            'my-own-header': 'hello-world'
        });
        res.end('<h1>Page Not Found</h1>');
    };
    // console.log(req);                      //i forgot to comment out this part so it caused issue
    //res.end('Hello from server');
})

server.listen(8000,'127.0.0.1', () => {
    console.log("Listenning to port 8000");
})
