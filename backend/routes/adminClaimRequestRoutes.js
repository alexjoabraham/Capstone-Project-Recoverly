const express = require("express");
const router = express.Router();
const ClaimItem = require("../models/ClaimItem");
const FoundItem = require("../models/FoundItem");
const nodemailer = require("nodemailer");
const authenticateAdmin = require("../middleware/authenticateAdmin");
const User = require("../models/User");
const Admin = require("../models/Admin");
require("dotenv").config();

router.get("/", async (req, res) => {
  console.log("Fetching claim requests...");
  try {
    const claimRequests = await ClaimItem.find();
    if (!claimRequests || claimRequests.length === 0) {
      return res.status(404).json({ message: "No claim requests found" });
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

    console.log("Claim Requests Retrieved:", claimRequestsWithFoundItems);
    res.status(200).json(claimRequestsWithFoundItems);
  } catch (error) {
    console.error("Error fetching claim requests:", error);
    res
      .status(500)
      .json({ message: "Error fetching claim requests", error: error.message });
  }
});

router.put("/:id/approve", authenticateAdmin, async (req, res) => {
  try {
    const admin = await Admin.findById(req.adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    console.log("Admin details:", admin);
    const claimRequest = await ClaimItem.findByIdAndUpdate(
      req.params.id,
      { claimapproved: true, reason: "" },
      { new: true }
    );

    if (!claimRequest) {
      return res.status(404).json({ message: "Claim request not found" });
    }

    const foundItem = await FoundItem.findById(claimRequest.founditem_id);
    if (!foundItem) {
      return res.status(404).json({ message: "Found item not found" });
    }

    await FoundItem.findByIdAndUpdate(claimRequest.founditem_id, {
      admin_approved: true,
    });

    const user = await User.findById(claimRequest.user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.user_email,
      subject: "Claim Approved - Recoverly",
      html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #0056b3;">Good News!</h2>
            <p>Dear <strong>${user.user_name}</strong>,</p>
            <p>We are pleased to inform you that your claim item, <strong>${foundItem.founditem_name}</strong>, has been approved.</p>
            <p><strong>Details:</strong></p>
            <ul>
              <li><strong>Organization Name:</strong> ${admin.organization_name}</li>
              <li><strong>Address:</strong> ${admin.organization_address}</li>
            </ul>
            <p>To retrieve your item or for further assistance, please contact the admin using the details below:</p>
            <ul>
              <li><strong>Admin Name:</strong> ${admin.admin_name}</li>
              <li><strong>Admin Email:</strong> <a href="mailto:${admin.admin_email}">${admin.admin_email}</a></li>
            </ul>
            <p>Thank you for using <strong>Recoverly</strong>. We’re here to assist you every step of the way.</p>
            <p style="color: #777;">Best regards,<br/>The Recoverly Team</p>
          </div>
        `,
    };

    await transporter.sendMail(mailOptions);

    res
      .status(200)
      .json({
        message: "Claim approved successfully and email sent",
        claimRequest,
      });
  } catch (error) {
    console.error("Error approving claim request:", error);
    res
      .status(500)
      .json({ message: "Error approving claim request", error: error.message });
  }
});

router.put("/:id/reject", async (req, res) => {
  try {
    const { reason } = req.body;

    if (!reason || reason.trim() === "") {
      return res
        .status(400)
        .json({ message: "Reason for rejection is required" });
    }

    const claimRequest = await ClaimItem.findByIdAndUpdate(
      req.params.id,
      { claimapproved: false, reason },
      { new: true }
    );

    if (!claimRequest) {
      return res.status(404).json({ message: "Claim request not found" });
    }

    res
      .status(200)
      .json({ message: "Claim rejected successfully", claimRequest });
  } catch (error) {
    console.error("Error rejecting claim request:", error);
    res
      .status(500)
      .json({ message: "Error rejecting claim request", error: error.message });
  }
});

module.exports = router;
