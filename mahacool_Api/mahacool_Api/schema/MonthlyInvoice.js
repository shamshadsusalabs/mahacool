const mongoose = require('mongoose');

const DryFruitDetailSchema = new mongoose.Schema({
    dryFruitName: { type: String, required: true },
    dateCheckIN: { type: Date, required: true },
    weight: { type: Number, required: true },
    recordId: { type: String, required: true }
});

const MonthlyInvoiceSchema = new mongoose.Schema({
    customerId: { type: String },
    dryFruitDetails: [DryFruitDetailSchema],
    grandTotalWeight: { type: Number },
    grandTotalAmount: { type: Number },
    monthlyBreakdown: [{
        month: { type: String },
        year: { type: Number },
        totalWeight: { type: Number },
        totalAmount: { type: Number }
    }],
    monthlyTotals: {
        type: Map,
        of: Number,
    },
    paidMonthlyTotals: {
        type: Map,
        of: Number,
    },
    unpaidMonthlyTotals: {
        type: Map,
        of: Number,
    },
    paidGrandTotalAmounts: [Number],
    unpaidGrandTotalAmounts: [Number]
});

// Function to generate monthly summary
const generateMonthlySummary = function () {
    const breakdown = {};
    
    this.dryFruitDetails.forEach(detail => {
        const checkInDate = new Date(detail.dateCheckIN);
        const month = checkInDate.toLocaleString('default', { month: 'long' });
        const year = checkInDate.getFullYear();
        const key = `${month}-${year}`;

        // Initialize the breakdown for the month/year if not already done
        if (!breakdown[key]) {
            breakdown[key] = {
                month,
                year,
                totalWeight: 0,
                totalAmount: 0
            };
        }

        // Update the totals for the month/year
        breakdown[key].totalWeight += detail.weight;
        const daysStored = Math.max(Math.floor((new Date() - checkInDate) / (1000 * 60 * 60 * 24)), 1);
        const ratePerKgPerDay = 1; // Example rate
        breakdown[key].totalAmount += daysStored * detail.weight * ratePerKgPerDay;
    });

    console.log('Monthly Breakdown:', breakdown);
    
    return Object.values(breakdown);
};

// Function to calculate the grand unpaid amount with GST
const calculateGrandUnpaidAmount = function () {
    const totalAmount = this.monthlyBreakdown.reduce((acc, breakdown) => acc + breakdown.totalAmount, 0);
    const paidAmount = this.paidGrandTotalAmounts.reduce((acc, amount) => acc + amount, 0);
    const unpaidAmount = totalAmount - paidAmount;

    // Ensure unpaid total doesn't go below zero
    const grandUnpaidAmount = Math.max(unpaidAmount, 0);

    // Apply an additional 18% charge
    const grandUnpaidAmountWithCharge = grandUnpaidAmount * 1.18;

    console.log('Total Amount:', totalAmount);
    console.log('Paid Amount:', paidAmount);
    console.log('Unpaid Amount:', unpaidAmount);
    console.log('Grand Unpaid Amount:', grandUnpaidAmount);
    console.log('Grand Unpaid Amount with 18% Charge:', grandUnpaidAmountWithCharge);

    return grandUnpaidAmountWithCharge;
};

// Function to distribute unpaid total into monthly totals
const distributeUnpaidTotalToMonthly = function () {
    const monthlyTotals = {};
    const grandUnpaidAmount = this.unpaidGrandTotalAmounts[0] || 0;

    // Calculate total weight and amount per month for distribution
    const totalWeight = this.monthlyBreakdown.reduce((acc, breakdown) => acc + breakdown.totalWeight, 0);

    this.monthlyBreakdown.forEach(breakdown => {
        const weightPercentage = breakdown.totalWeight / totalWeight;
        const monthlyUnpaidAmount = grandUnpaidAmount * weightPercentage;

        monthlyTotals[`${breakdown.month}-${breakdown.year}`] = monthlyUnpaidAmount;
    });

    console.log('Monthly Totals Distribution:', monthlyTotals);

    return monthlyTotals;
};

// Pre-save hook to update breakdown, totals, and unpaid amounts
MonthlyInvoiceSchema.pre('save', function (next) {
    try {
        console.log('Pre-save hook triggered for customer ID:', this.customerId);

        // Generate monthly breakdown
        this.monthlyBreakdown = generateMonthlySummary.call(this);

        // Calculate grand unpaid amount with additional charge
        const grandUnpaidAmountWithCharge = calculateGrandUnpaidAmount.call(this);
        this.unpaidGrandTotalAmounts = [grandUnpaidAmountWithCharge];

        // Move current unpaidMonthlyTotals to paidMonthlyTotals
        this.paidMonthlyTotals = new Map(this.unpaidMonthlyTotals);

        // Calculate new unpaidMonthlyTotals based on latest data
        const unpaidMonthlyTotals = distributeUnpaidTotalToMonthly.call(this);

        // Update unpaidMonthlyTotals with new data
        this.unpaidMonthlyTotals = unpaidMonthlyTotals;

        console.log('Updated Monthly Breakdown:', this.monthlyBreakdown);
        console.log('Paid Monthly Totals:', this.paidMonthlyTotals);
        console.log('Unpaid Monthly Totals:', this.unpaidMonthlyTotals);
        console.log('Grand Unpaid Amount with 18% Charge:', this.unpaidGrandTotalAmounts);

        next();
    } catch (error) {
        console.error('Error during pre-save hook:', error);
        next(error);
    }
});



const MonthlyInvoice = mongoose.model('MonthlyInvoice', MonthlyInvoiceSchema);

module.exports = MonthlyInvoice;
