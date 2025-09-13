let AmazonLoginPage = require('../PageObject/loginpage');
let {sendMail} = require('../Utils/mailler');
let fs = require('fs');

describe('Amazon Search', () => {
    it('should search for a product', async () => { 
        await AmazonLoginPage.open();
        const producttitle = await AmazonLoginPage.searchFor('samsung s24 fe');
        console.log(`Found first result: ${producttitle}`);
        const{title, price} = await AmazonLoginPage.getSearchResult();
        console.log(`first product tiltle ${title}`)
        console.log(`first product price ${price}`)
        const record = { product: title, Price: price, timestamp: new Date().toLocaleString() };
        console.log(`Recorded price: ${JSON.stringify(record)}`);
        let history = [];
        if(fs.existsSync('./Data/priceHistory.json')){
            try {
                const fileContent = fs.readFileSync('./Data/priceHistory.json', 'utf8');
                if (fileContent.trim()) {
                    history = JSON.parse(fileContent);
                }
            } catch (error) {
                console.log('Error parsing priceHistory.json, starting with empty array:', error.message);
                history = [];
            }
        }
        history.push(record);
        fs.writeFileSync('./Data/priceHistory.json', JSON.stringify(history));
        await sendMail('Amazon Price Alert', `Price for ${title} is now ${price}`);
        console.log('Email sent successfully');
        
    })
})