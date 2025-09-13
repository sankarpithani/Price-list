const PDFAutomation = require('../PageObject/pdfAutomation');
const path = require('path');

describe('PDF Text Validation', () => {
    let pdfPath;

    before(async () => {
        // You can specify the path to your PDF file here
        // For example: pdfPath = path.join(__dirname, '../Data/sample.pdf');
        pdfPath = path.join(__dirname, '../Data/sample.pdf');
    });

    it('should load PDF and check if it contains specific text', async () => {
        // Load the PDF
        const loaded = await PDFAutomation.loadPDF(pdfPath);
        
        if (!loaded) {
            console.log('PDF file not found or could not be loaded. Skipping test.');
            return;
        }

        // Validate PDF structure
        const validation = PDFAutomation.validatePDF();
        console.log('PDF Validation:', validation);

        // Check if PDF contains specific text
        const searchText = 'sample text'; // Replace with text you want to search for
        const containsText = PDFAutomation.containsText(searchText);
        
        console.log(`PDF contains "${searchText}": ${containsText}`);
        
        // Get PDF info
        const pdfInfo = PDFAutomation.getPDFInfo();
        console.log('PDF Info:', pdfInfo);
    });

    it('should search for multiple texts in PDF', async () => {
        const loaded = await PDFAutomation.loadPDF(pdfPath);
        
        if (!loaded) {
            console.log('PDF file not found or could not be loaded. Skipping test.');
            return;
        }

        // Search for multiple texts
        const searchTexts = ['invoice', 'total', 'amount', 'date']; // Replace with texts you want to search for
        const results = PDFAutomation.containsAnyText(searchTexts);
        
        console.log('Multiple text search results:', results);
        
        // Log which texts were found
        results.results.forEach(result => {
            console.log(`"${result.text}": ${result.found ? 'FOUND' : 'NOT FOUND'}`);
        });
    });

    it('should search for text with context', async () => {
        const loaded = await PDFAutomation.loadPDF(pdfPath);
        
        if (!loaded) {
            console.log('PDF file not found or could not be loaded. Skipping test.');
            return;
        }

        // Search for text with context
        const searchText = 'sample'; // Replace with text you want to search for
        const matches = PDFAutomation.searchWithContext(searchText, 30);
        
        console.log(`Found ${matches.length} matches for "${searchText}"`);
        matches.forEach((match, index) => {
            console.log(`Match ${index + 1}:`);
            console.log(`Position: ${match.position}`);
            console.log(`Context: ...${match.context}...`);
        });
    });

    it('should get full text content from PDF', async () => {
        const loaded = await PDFAutomation.loadPDF(pdfPath);
        
        if (!loaded) {
            console.log('PDF file not found or could not be loaded. Skipping test.');
            return;
        }

        // Get full text content
        const fullText = PDFAutomation.getFullText();
        console.log(`PDF contains ${fullText.length} characters of text`);
        console.log('First 200 characters:', fullText.substring(0, 200));
    });

    it('should demonstrate case-sensitive search', async () => {
        const loaded = await PDFAutomation.loadPDF(pdfPath);
        
        if (!loaded) {
            console.log('PDF file not found or could not be loaded. Skipping test.');
            return;
        }

        const searchText = 'Sample'; // Note the capital S
        
        // Case-insensitive search
        const caseInsensitive = PDFAutomation.containsText(searchText, false);
        console.log(`Case-insensitive search for "${searchText}": ${caseInsensitive}`);
        
        // Case-sensitive search
        const caseSensitive = PDFAutomation.containsText(searchText, true);
        console.log(`Case-sensitive search for "${searchText}": ${caseSensitive}`);
    });
});
