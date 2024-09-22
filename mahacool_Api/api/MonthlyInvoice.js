
const express = require('express');
const router = express.Router();
const MonthlyInvoice = require('../schema/MonthlyInvoice');
router.get('/getAll', async (req, res) => {
    try {
        const invoices = await MonthlyInvoice.find({});
        if (invoices.length === 0) {
            return res.status(404).json({ message: 'No invoices found' });
        }
        res.status(200).json(invoices);
    } catch (error) {
        console.error('Error fetching all invoices:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// 2. Route to get invoice by customerId
router.get('/getByCustomerId/:customerId', async (req, res) => {
    const { customerId } = req.params;
    
    try {
        const invoice = await MonthlyInvoice.findOne({ customerId });
        if (!invoice) {
            return res.status(404).json({ message: `Invoice not found for Customer ID: ${customerId}` });
        }
        res.status(200).json(invoice);
    } catch (error) {
        console.error(`Error fetching invoice for Customer ID: ${customerId}`, error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.post('/updatePaidTotals/:customerId', async (req, res) => {
    const { customerId } = req.params;
    const { paidGrandTotalAmounts } = req.body; // paid amount directly from the request

    // Validate input
    if (!paidGrandTotalAmounts || paidGrandTotalAmounts <= 0) {
        return res.status(400).json({ message: 'Invalid paidGrandTotalAmounts. It must be greater than zero.' });
    }

    try {
        // Find the invoice by customer ID
        const invoice = await MonthlyInvoice.findOne({ customerId });
        if (!invoice) {
            return res.status(404).json({ message: `Invoice not found for Customer ID: ${customerId}` });
        }

        // Push the new payment to the paidGrandTotalAmounts array
        invoice.paidGrandTotalAmounts.push({ 
            amount: paidGrandTotalAmounts, 
            date: new Date() 
        });

        // Process payments
        await invoice.processPayments(); 

        // Save the updated invoice
        await invoice.save();

        res.status(200).json({ message: 'Paid totals updated successfully', paidGrandTotalAmounts });
    } catch (error) {
        console.error(`Error updating paid totals for Customer ID: ${customerId}`, error);
        res.status(500).json({ message: 'Internal server error' });
    }
});





    



module.exports = router;



