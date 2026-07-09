"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Button = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
exports.Button = react_1.default.forwardRef(({ children, className = '', variant = 'primary', ...props }, ref) => {
    const baseStyle = 'px-4 py-2 rounded-md font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500';
    const variantStyle = variant === 'primary'
        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200';
    return ((0, jsx_runtime_1.jsx)("button", { ref: ref, className: `${baseStyle} ${variantStyle} ${className}`, ...props, children: children }));
});
exports.Button.displayName = 'Button';
