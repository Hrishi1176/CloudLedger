"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = require("@sales-crm/auth");
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../.env') });
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '10mb' }));
// Authentication Middleware
async function authenticateTenant(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
    }
    const token = authHeader.split(' ')[1];
    const payload = await (0, auth_1.verifyJWT)(token);
    if (!payload) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
    req.tenant = payload;
    next();
}
// Public Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'sales-crm-api' });
});
// Start Express Server
app.listen(PORT, () => {
    console.log(`🚀 Sales CRM API Gateway running on port ${PORT}`);
});
