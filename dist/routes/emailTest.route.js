"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mailer_1 = require("../utils/mailer");
const router = (0, express_1.Router)();
router.get('/test-email', async (req, res) => {
    try {
        await (0, mailer_1.sendEmail)({
            to: 'youremail@example.com',
            subject: 'Test Email',
            html: '<h1>This is a test email from Notes App</h1>',
        });
        res.send('✅ Email sent successfully');
    }
    catch (error) {
        res.status(500).send('❌ Failed to send email');
    }
});
exports.default = router;
