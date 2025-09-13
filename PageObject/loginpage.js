class AmazonLoginPage{
    async open(){
        await browser.url('https://www.amazon.in/');
    }
    get searchInput(){
        return $('#twotabsearchtextbox');
    }
    get firstSearchResultTitle(){
        // More stable selector for first search result title on Amazon search page
        return $('//*[@data-asin="B0DHL7YT5S"]/div/div/span/div/div/div/div[2]/div/div/div[1]');
    }
    get productValue(){
        return $('//*[@data-asin="B0DHL7YT5S"]/div/div/span/div/div/div/div[2]/div/div/div[3]/div[1]/div/div[1]/div[1]/div[1]/a/span[1]/span[2]/span[2]');
    }
    async searchFor(product){
        await  this.searchInput.waitForDisplayed({ timeout: 10000 });
        await  this.searchInput.setValue(product);
        await browser.keys('Enter');
        await this.firstSearchResultTitle.waitForDisplayed({ timeout: 20000 });
    }
    async getSearchResult(){
        const title = await  this.firstSearchResultTitle.getText();
        const price = await this.productValue.getText();
        console.log(`printing the title of the first product: ${title}`);
        console.log(`printing the price of the first product: ${price}`);
        return {title, price};
    }

}
module.exports = new AmazonLoginPage();