const mongoose = require('mongoose');

// Dry fruit details schema
const DryFruitDetailSchema = new mongoose.Schema({
    dryFruitName: { type: String, required: true },
    dateCheckIN: { type: Date, required: true },
    weight: { type: Number, required: true },
    recordId: { type: String, required: true },
    storageDays: { type: Number }, // To store the number of storage days
    amount: { type: Number } // To store the calculated amount based on storage
});

// Monthly Invoice schema
const MonthlyInvoiceSchema = new mongoose.Schema({
    customerId: { type: String, required: true },
    dryFruitDetails: [DryFruitDetailSchema],
    grandTotalWeight: { type: Number },
    grandTotalAmount: { type: Number },
    unpaidMonthly: { type: Map, of: Number }, // Map to store month-year wise unpaid amounts
    paidMonthlyTotals: { type: Map, of: Number }, // Map to store month-year wise paid amounts
    paidGrandTotalAmounts: { type: [Number], default: [] } // Array to store paid grand total amounts
});

// Method to calculate the number of storage days, amount, and unpaidMonthly breakdown
// Method to calculate the number of storage days, amount, and unpaidMonthly breakdown
MonthlyInvoiceSchema.methods.calculateStorageAndAmount = function() {
    const currentDate = new Date();
    let totalWeight = 0;
    let totalAmount = 0;
    const monthlyBreakdown = {};

    this.dryFruitDetails.forEach(dryFruit => {
        try {
            const daysStored = Math.ceil((currentDate - dryFruit.dateCheckIN) / (1000 * 60 * 60 * 24)); // Difference in days
            const amount = dryFruit.weight * daysStored; // 1 rupee per kg per day

            // Update fields
            dryFruit.storageDays = daysStored;
            dryFruit.amount = amount;

            // Calculate totals
            totalWeight += dryFruit.weight;
            totalAmount += amount;

            // Calculate month-year wise breakdown
            const checkInDate = new Date(dryFruit.dateCheckIN);
            const monthName = checkInDate.toLocaleString('default', { month: 'short' }); // e.g., "Aug"
            const year = checkInDate.getFullYear(); // e.g., "2024"
            const yearMonth = `${monthName}-${year}`; // Format as "Aug-2024"

            if (monthlyBreakdown[yearMonth]) {
                monthlyBreakdown[yearMonth] += amount;
            } else {
                monthlyBreakdown[yearMonth] = amount;
            }
        } catch (error) {
            console.error(`Error processing dry fruit entry: ${error.message}`);
        }
    });

    // Calculate GST
    const gstRate = 0.18;
    const gstAmount = totalAmount * gstRate;

    // Update the grand total fields
    this.grandTotalWeight = totalWeight;
    this.grandTotalAmount = totalAmount + gstAmount; // Adding GST to the total amount
    this.unpaidMonthly = monthlyBreakdown;
};


// Before saving, calculate the storage days, total amount, and unpaid monthly breakdown
MonthlyInvoiceSchema.pre('save', function(next) {
    try {
        this.calculateStorageAndAmount();
        next();
    } catch (error) {
        console.error(`Error before saving invoice: ${error.message}`);
        next(error); // Pass the error to the save function
    }
});

const MonthlyInvoice = mongoose.model('MonthlyInvoice', MonthlyInvoiceSchema);

module.exports = MonthlyInvoice;
