
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



router.get('/getByCustomerId/:customerId', async (req, res) => {
    const { customerId } = req.params;
    
    try {
        const invoice = await MonthlyInvoice.findOne({ customerId });
        if (!invoice) {
            return res.status(404).json({ message:` Invoice not found for Customer ID: ${customerId}` });
        }
        res.status(200).json(invoice);
    } catch (error) {
        console.error(`Error fetching invoice for Customer ID: ${customerId}, error`);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/updatePaidTotals/:customerId', async (req, res) => {
    const { customerId } = req.params;
    const { paidMonthlyTotal, paidGrandTotalAmounts } = req.body;

    try {
        const invoice = await MonthlyInvoice.findOne({ customerId });
        if (!invoice) {
            return res.status(404).json({ message: `Invoice not found for Customer ID: ${customerId} `});
        }

        // Update the specific month in paidMonthlyTotals
        if (paidMonthlyTotal) {
            const month = Object.keys(paidMonthlyTotal)[0]; // Get the month key
            const amount = paidMonthlyTotal[month]; // Get the amount

            if (!invoice.paidMonthlyTotals) {
                invoice.paidMonthlyTotals = new Map();
            }
            
            // Update or add the month's total
            invoice.paidMonthlyTotals.set(month, amount);
        }

        // Update the paidGrandTotalAmounts array
        if (paidGrandTotalAmounts) {
            // Append new amounts to the existing array
            invoice.paidGrandTotalAmounts = [...(invoice.paidGrandTotalAmounts || []), ...paidGrandTotalAmounts];
        }

        await invoice.save();

        res.status(200).json({ message: 'Paid totals updated successfully', invoice });
    } catch (error) {
        console.error(Error `updating paid totals for Customer ID: ${customerId}, error`);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;



