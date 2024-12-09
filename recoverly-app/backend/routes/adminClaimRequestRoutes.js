const express = require('express');
const router = express.Router();
const ClaimItem = require('../models/ClaimItem');
const FoundItem = require('../models/FoundItem');

   router.get('/', async (req, res) => {
    console.log('Fetching claim requests...');
    try {
      const claimRequests = await ClaimItem.find();
      if (!claimRequests || claimRequests.length === 0) {
        return res.status(404).json({ message: 'No claim requests found' });
      }
  
      const claimRequestsWithFoundItems = await Promise.all(
        claimRequests.map(async (claim) => {
          const foundItem = await FoundItem.findById(claim.founditem_id);
          return {
            ...claim.toObject(),
            founditem_details: foundItem || null,
          };
        })
      );
  
      console.log('Claim Requests Retrieved:', claimRequestsWithFoundItems);
      res.status(200).json(claimRequestsWithFoundItems);
    } catch (error) {
      console.error('Error fetching claim requests:', error);
      res.status(500).json({ message: 'Error fetching claim requests', error: error.message });
    }
   });

   router.put('/:id/approve', async (req, res) => {
    try {
      const claimRequest = await ClaimItem.findByIdAndUpdate(
        req.params.id,
        { claimapproved: true, reason: '' },
        { new: true }
      );
  
      if (!claimRequest) {
        return res.status(404).json({ message: 'Claim request not found' });
      }

      await FoundItem.findByIdAndUpdate(claimRequest.founditem_id, { admin_approved: true });
  
      res.status(200).json({ message: 'Claim approved successfully', claimRequest });
    } catch (error) {
      console.error('Error approving claim request:', error);
      res.status(500).json({ message: 'Error approving claim request', error: error.message });
    }
  });

  router.put('/:id/reject', async (req, res) => {
    try {
      const { reason } = req.body;
  
      if (!reason || reason.trim() === '') {
        return res.status(400).json({ message: 'Reason for rejection is required' });
      }
  
      const claimRequest = await ClaimItem.findByIdAndUpdate(
        req.params.id,
        { claimapproved: false, reason },
        { new: true }
      );
  
      if (!claimRequest) {
        return res.status(404).json({ message: 'Claim request not found' });
      }
  
      res.status(200).json({ message: 'Claim rejected successfully', claimRequest });
    } catch (error) {
      console.error('Error rejecting claim request:', error);
      res.status(500).json({ message: 'Error rejecting claim request', error: error.message });
    }
  });

module.exports = router;
