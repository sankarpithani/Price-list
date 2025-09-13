const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

class PDFAutomation {
    constructor() {
        this.pdfBuffer = null;
        this.pdfData = null;
    }

    /**
     * Load PDF from file path
     * @param {string} filePath - Path to the PDF file
     * @returns {Promise<boolean>} - Returns true if PDF loaded successfully
     */
    async loadPDF(filePath) {
        try {
            if (!fs.existsSync(filePath)) {
                throw new Error(`PDF file not found at path: ${filePath}`);
            }
            
            this.pdfBuffer = fs.readFileSync(filePath);
            this.pdfData = await pdf(this.pdfBuffer);
            console.log(`PDF loaded successfully: ${filePath}`);
            console.log(`PDF contains ${this.pdfData.numpages} pages`);
            return true;
        } catch (error) {
            console.error(`Error loading PDF: ${error.message}`);
            return false;
        }
    }

    /**
     * Load PDF from buffer (useful for downloaded PDFs)
     * @param {Buffer} buffer - PDF buffer data
     * @returns {Promise<boolean>} - Returns true if PDF loaded successfully
     */
    async loadPDFFromBuffer(buffer) {
        try {
            this.pdfBuffer = buffer;
            this.pdfData = await pdf(this.pdfBuffer);
            console.log(`PDF loaded successfully from buffer`);
            console.log(`PDF contains ${this.pdfData.numpages} pages`);
            return true;
        } catch (error) {
            console.error(`Error loading PDF from buffer: ${error.message}`);
            return false;
        }
    }

    /**
     * Check if PDF contains specific text
     * @param {string} searchText - Text to search for
     * @param {boolean} caseSensitive - Whether search should be case sensitive (default: false)
     * @returns {boolean} - Returns true if text is found
     */
    containsText(searchText, caseSensitive = false) {
        if (!this.pdfData) {
            console.error('No PDF data loaded. Please load a PDF first.');
            return false;
        }

        const textToSearch = caseSensitive ? searchText : searchText.toLowerCase();
        const pdfText = caseSensitive ? this.pdfData.text : this.pdfData.text.toLowerCase();
        
        const found = pdfText.includes(textToSearch);
        console.log(`Searching for "${searchText}" in PDF: ${found ? 'FOUND' : 'NOT FOUND'}`);
        return found;
    }

    /**
     * Check if PDF contains any of the provided texts
     * @param {string[]} searchTexts - Array of texts to search for
     * @param {boolean} caseSensitive - Whether search should be case sensitive (default: false)
     * @returns {Object} - Returns object with found texts and their positions
     */
    containsAnyText(searchTexts, caseSensitive = false) {
        if (!this.pdfData) {
            console.error('No PDF data loaded. Please load a PDF first.');
            return { found: false, results: [] };
        }

        const results = [];
        const pdfText = caseSensitive ? this.pdfData.text : this.pdfData.text.toLowerCase();

        searchTexts.forEach(searchText => {
            const textToSearch = caseSensitive ? searchText : searchText.toLowerCase();
            const found = pdfText.includes(textToSearch);
            const index = found ? pdfText.indexOf(textToSearch) : -1;
            
            results.push({
                text: searchText,
                found: found,
                position: index
            });
        });

        const foundAny = results.some(result => result.found);
        console.log(`Searching for multiple texts in PDF: ${foundAny ? 'FOUND' : 'NOT FOUND'}`);
        return { found: foundAny, results: results };
    }

    /**
     * Get all text content from PDF
     * @returns {string} - Full text content of the PDF
     */
    getFullText() {
        if (!this.pdfData) {
            console.error('No PDF data loaded. Please load a PDF first.');
            return '';
        }
        return this.pdfData.text;
    }

    /**
     * Get PDF metadata
     * @returns {Object} - PDF metadata including pages, info, etc.
     */
    getPDFInfo() {
        if (!this.pdfData) {
            console.error('No PDF data loaded. Please load a PDF first.');
            return null;
        }
        return {
            pages: this.pdfData.numpages,
            info: this.pdfData.info,
            metadata: this.pdfData.metadata,
            textLength: this.pdfData.text.length
        };
    }

    /**
     * Search for text and return context around matches
     * @param {string} searchText - Text to search for
     * @param {number} contextLength - Number of characters before and after match (default: 50)
     * @param {boolean} caseSensitive - Whether search should be case sensitive (default: false)
     * @returns {Array} - Array of objects with match details and context
     */
    searchWithContext(searchText, contextLength = 50, caseSensitive = false) {
        if (!this.pdfData) {
            console.error('No PDF data loaded. Please load a PDF first.');
            return [];
        }

        const textToSearch = caseSensitive ? searchText : searchText.toLowerCase();
        const pdfText = caseSensitive ? this.pdfData.text : this.pdfData.text.toLowerCase();
        const originalText = this.pdfData.text;
        
        const matches = [];
        let index = 0;
        
        while ((index = pdfText.indexOf(textToSearch, index)) !== -1) {
            const start = Math.max(0, index - contextLength);
            const end = Math.min(originalText.length, index + searchText.length + contextLength);
            const context = originalText.substring(start, end);
            
            matches.push({
                text: searchText,
                position: index,
                context: context,
                beforeContext: originalText.substring(start, index),
                afterContext: originalText.substring(index + searchText.length, end)
            });
            
            index += searchText.length;
        }
        
        console.log(`Found ${matches.length} matches for "${searchText}"`);
        return matches;
    }

    /**
     * Validate PDF structure and content
     * @returns {Object} - Validation results
     */
    validatePDF() {
        if (!this.pdfData) {
            return {
                valid: false,
                error: 'No PDF data loaded'
            };
        }

        const validation = {
            valid: true,
            hasText: this.pdfData.text.length > 0,
            hasPages: this.pdfData.numpages > 0,
            hasInfo: !!this.pdfData.info,
            textLength: this.pdfData.text.length,
            pageCount: this.pdfData.numpages,
            issues: []
        };

        if (!validation.hasText) {
            validation.issues.push('PDF contains no text content');
        }
        if (!validation.hasPages) {
            validation.issues.push('PDF has no pages');
        }

        if (validation.issues.length > 0) {
            validation.valid = false;
        }

        console.log(`PDF validation: ${validation.valid ? 'VALID' : 'INVALID'}`);
        if (validation.issues.length > 0) {
            console.log('Issues found:', validation.issues);
        }

        return validation;
    }
}

module.exports = new PDFAutomation();
