
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
    const { paidGrandTotalAmounts } = req.body;

    try {
        const invoice = await MonthlyInvoice.findOne({ customerId });
        if (!invoice) {
            return res.status(404).json({ message: `Invoice not found for Customer ID: ${customerId}` });
        }

        // Update the paidGrandTotalAmounts array
        if (paidGrandTotalAmounts) {
            // Append new amounts to the existing array
            invoice.paidGrandTotalAmounts = [...(invoice.paidGrandTotalAmounts || []), ...paidGrandTotalAmounts];
        }

        // Ensure paidMonthlyTotals is initialized as a Map
        if (!invoice.paidMonthlyTotals) {
            invoice.paidMonthlyTotals = new Map();
        }

        // Calculate the total paid amount
        const totalPaid = (invoice.paidGrandTotalAmounts || []).reduce((sum, amount) => sum + amount, 0);
        const totalUnpaid = [...(invoice.unpaidMonthly || [])].reduce((sum, [, amount]) => sum + amount, 0);

        // If total paid covers all unpaid amounts, transfer to paidMonthlyTotals
        if (totalPaid >= totalUnpaid && invoice.unpaidMonthly) {
            invoice.unpaidMonthly.forEach((amount, month) => {
                if (invoice.paidMonthlyTotals.has(month)) {
                    // Add unpaid amount to the existing paid amount for the month
                    invoice.paidMonthlyTotals.set(month, invoice.paidMonthlyTotals.get(month) + amount);
                } else {
                    // Add new month and amount to paidMonthlyTotals
                    invoice.paidMonthlyTotals.set(month, amount);
                }
            });

            // Clear unpaidMonthly since all amounts are paid
            invoice.unpaidMonthly = new Map();
        }

        await invoice.save();

        res.status(200).json({ message: 'Paid totals updated and unpaid amounts transferred successfully', invoice });
    } catch (error) {
        console.error(`Error updating paid totals for Customer ID: ${customerId}, error: ${error}`);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;



