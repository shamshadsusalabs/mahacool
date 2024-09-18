const express = require('express');
const router = express.Router();
const WarehouseRequested = require('../schema/WarehouseRequested'); // Adjust the path as needed

// POST route to create a new warehouse request
router.post('/warehouse-request', async (req, res) => {
  try {
    // Create a new warehouse request with the data from the request body
    const newRequest = new WarehouseRequested({
      selectedData: req.body.selectedData,
    
    });

    // Save the request to the database
    const savedRequest = await newRequest.save();

    // Send a success response with the saved data
    res.status(201).json(savedRequest);
  } catch (error) {
    // Handle any errors that occur
    res.status(500).json({ message: 'Error creating warehouse request', error });
  }
});

router.get('/getall', async (req, res) => {
  try {
    const data = await WarehouseRequested.find({ requestedWarehouseStatus: true });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data', error });
  }
}); 

router.post('/update-rates', async (req, res) => {
  try {
    const { rates } = req.body;

    if (!Array.isArray(rates)) {
      return res.status(400).json({ message: 'Invalid data format' });
    }

    // Process each rate update
    for (const { rate, requestId, iddetails } of rates) {
      // Update the rate for the specific detail
      await WarehouseRequested.updateOne(
        { _id: requestId, 'selectedData.details._iddetails': iddetails },
        { 
          $set: { 
            'selectedData.details.$.rate': rate,
            requestedWarehouseStatus: false // Set the status to false
          } 
        }
      );
    }

    res.status(200).json({ message: 'Rates updated successfully and status set to false' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating rates', error });
  }
});


router.get('/details/:customerID', async (req, res) => {
  try {
      const { customerID } = req.params;

      // Find the document where `user.customerID` matches and `requestedWarehouseStatus` is false
      const result = await WarehouseRequested.findOne({
          'selectedData.user.customerID': customerID,
          requestedWarehouseStatus: false
      });

      if (!result) {
          return res.status(404).json({ message: 'No data found' });
      }

      // Return the `details` array
      res.json(result.selectedData.details);
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
  }
});



module.exports = router;