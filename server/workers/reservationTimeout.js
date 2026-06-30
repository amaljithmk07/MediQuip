const OrdersDB = require('../models/orderschema');
const Products = require('../models/productschema');
const PaymentDB = require('../models/paymentschema');
const AuditLogDB = require('../models/auditlogschema');
const { default: mongoose } = require('mongoose');

// Function to run every 10 minutes to check for expired reservations
const checkExpiredReservations = async () => {
  console.log('[Worker] Checking for expired reservations...');
  try {
    const now = new Date();
    // Find orders that are Awaiting Payment and reservation has expired
    const expiredOrders = await OrdersDB.find({
      orderstatus: 'Awaiting Payment',
      reservationExpiresAt: { $lte: now }
    });

    for (const order of expiredOrders) {
      const session = await mongoose.startSession();
      session.startTransaction();
      try {
        console.log(`[Worker] Expiring reservation for order: ${order._id}`);
        // 1. Revert order status
        order.orderstatus = 'Expired';
        await order.save({ session });

        // 2. Revert equipment status to Available
        if (order.product_id) {
          const product = await Products.findById(order.product_id).session(session);
          if (product) {
            product.product_status = 'Available';
            await product.save({ session });
          }
        }

        // 3. Mark payment as expired
        await PaymentDB.updateOne(
          { request_id: order._id },
          { $set: { verificationStatus: 'Expired' } },
          { session }
        );

        // 4. Audit Log
        const audit = new AuditLogDB({
          actor_id: order.login_id, // System action, but linking to user
          action: 'RESERVATION_EXPIRED',
          description: 'Reservation expired due to non-payment',
          entityId: order._id,
          entityModel: 'orders_tb',
        });
        await audit.save({ session });

        await session.commitTransaction();
        session.endSession();
      } catch (err) {
        console.error(`[Worker] Failed to expire reservation ${order._id}:`, err);
        await session.abortTransaction();
        session.endSession();
      }
    }
  } catch (err) {
    console.error('[Worker] Error checking expired reservations:', err);
  }
};

const startWorker = () => {
  // Check every 10 minutes (600000 ms)
  setInterval(checkExpiredReservations, 600000);
  // Also check once on startup
  checkExpiredReservations();
};

module.exports = startWorker;
