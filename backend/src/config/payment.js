const moment = require('moment');

/**
 * Cấu hình tham số cho VNPay
 */
const vnpayConfig = {
    vnp_TmnCode: process.env.VNPAY_TMNCODE, // Lấy từ VNPay Sandbox/Production
    vnp_HashSecret: process.env.VNPAY_HASHSECRET,
    vnp_Url: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
    vnp_ReturnUrl: 'http://localhost:3000/payment-return' // URL frontend nhận kết quả
};

/**
 * Tạo URL thanh toán VNPay
 */
const createVnPayUrl = (req, amount, orderInfo, orderId) => {
    let date = new Date();
    let createDate = moment(date).format('YYYYMMDDHHmmss');
    let orderIdCode = orderId;
    let ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    let vnp_Params = {
        'vnp_Version': '2.1.0',
        'vnp_Command': 'pay',
        'vnp_TmnCode': vnpayConfig.vnp_TmnCode,
        'vnp_Locale': 'vn',
        'vnp_CurrCode': 'VND',
        'vnp_TxnRef': orderIdCode,
        'vnp_OrderInfo': orderInfo,
        'vnp_OrderType': 'billpayment',
        'vnp_Amount': amount * 100, // VNPay nhân 100
        'vnp_ReturnUrl': vnpayConfig.vnp_ReturnUrl,
        'vnp_IpAddr': ipAddr,
        'vnp_CreateDate': createDate
    };

    // Sắp xếp các tham số và ký hash (Bắt buộc theo quy định VNPay)
    // Bạn cần dùng thư viện 'qs' để tạo chuỗi query
    const sortObject = require('qs').stringify(vnp_Params, { encode: false });
    const crypto = require('crypto');
    const hmac = crypto.createHmac("sha512", vnpayConfig.vnp_HashSecret);
    const signed = hmac.update(new Buffer(sortObject, 'utf-8')).digest("hex");
    
    vnp_Params['vnp_SecureHash'] = signed;
    
    return vnpayConfig.vnp_Url + '?' + require('qs').stringify(vnp_Params, { encode: false });
};

module.exports = { createVnPayUrl };