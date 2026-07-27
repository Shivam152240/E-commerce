const razorpay = require("../config/razorpay");

const createRazorpayOrder = async (req, res) => {
    try {
        const { amount } = req.body;

        if (!amount) {
            return res.status(400).json({
                message: "Amount is required"
            });
        }

        const options = {
            amount: Math.round(amount * 100),
            currency: "INR",
            receipt: `receipt_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);

        res.status(200).json({
            success: true,
            order
        });

    } catch (error) {
        console.error("Razorpay Order Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createRazorpayOrder
};