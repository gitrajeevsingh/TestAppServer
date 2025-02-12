const XLSX = require('xlsx');
const path = require('path');

const EXCEL_FILE_PATH = path.join(__dirname, '../data/products.xlsx');

// Helper function to read Excel file
const readExcelFile = () => {
    const workbook = XLSX.readFile(EXCEL_FILE_PATH);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(worksheet);
};

// Helper function to write Excel file
const writeExcelFile = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');
    XLSX.writeFile(workbook, EXCEL_FILE_PATH);
};

// Import data from Excel file
const importExcelData = async (req, res) => {
    try {
        const data = readExcelFile();
        res.status(200).json({ message: 'Data imported successfully', data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all products
const getAllProducts = async (req, res) => {
    try {
        const products = readExcelFile();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get product by month
const getProductByMonth = async (req, res) => {
    try {
        const products = readExcelFile();
        const product = products.find(p => p.Month.toLowerCase() === req.params.month.toLowerCase());
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update product
const updateProduct = async (req, res) => {
    try {
        const products = readExcelFile();
        const index = products.findIndex(p => p.Month.toLowerCase() === req.params.month.toLowerCase());
        
        if (index === -1) {
            return res.status(404).json({ message: 'Product not found' });
        }

        products[index] = { ...products[index], ...req.body };
        writeExcelFile(products);
        
        res.status(200).json(products[index]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete product
const deleteProduct = async (req, res) => {
    try {
        const products = readExcelFile();
        const filteredProducts = products.filter(p => p.Month.toLowerCase() !== req.params.month.toLowerCase());
        
        if (filteredProducts.length === products.length) {
            return res.status(404).json({ message: 'Product not found' });
        }

        writeExcelFile(filteredProducts);
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    importExcelData,
    getAllProducts,
    getProductByMonth,
    updateProduct,
    deleteProduct
};
