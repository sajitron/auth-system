"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const path_1 = __importDefault(require("path"));
const helmet_1 = __importDefault(require("helmet"));
// import passport from 'passport';
const errorhandler_1 = __importDefault(require("errorhandler"));
const router_1 = __importDefault(require("./routes/router"));
// Initialize configuration
dotenv_1.default.config();
const app = express_1.default();
// Secure app
app.use(helmet_1.default());
// Connect Database
db_1.default();
// compress data
app.use(compression_1.default());
// Initialize middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// log all requests
app.use(morgan_1.default('combined'));
// allow cross origin requests
app.use(cors_1.default());
// serve static files in production environment
if (process.env.NODE_ENV === 'production') {
    // set static folder
    app.use(express_1.default.static(path_1.default.join(__dirname, '../', 'client/build')));
    app.get('*', (req, res) => {
        res.sendFile(path_1.default.join(__dirname, '../', 'client/build/index.html'));
    });
}
if (process.env.NODE_ENV === 'development') {
    app.use(errorhandler_1.default());
}
// * Setup api routes here
router_1.default(app);
// serve static files in dev environment
app.use(express_1.default.static(path_1.default.join(__dirname, '../', 'dist')));
// serve default file on some error
app.get('/*', (req, res) => {
    res.sendfile('index.html', { root: path_1.default.join(__dirname, '../', './dist') });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
