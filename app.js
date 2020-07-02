const express = require("express");
// const morgan = require("morgan");
const cors = require("cors")

const shopRoutes = require("./routes/shop-routes");
const coursesRoutes = require("./routes/courses-routes");
const categoryRoutes = require("./routes/category-routes");
const employeeRoutes = require("./routes/employee-routes");
const customerRoutes = require("./routes/customer-routes");
const OrderRoutes = require("./routes/orders-routes");
const memberRoutes = require("./routes/member-routes");
const articleRoutes = require("./routes/article-routes");

const app = express();

const corsOptions = {
  origin:[
    "http://localhost:5000",
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "http://localhost:3000"
  ],
  methods: "GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS",
  allowedHeaders:["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

const bodyParser = express.urlencoded({ extended: false });
// app.use(morgan("dev"));
// Middleware
app.use(bodyParser);
app.use(express.json());




// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin",'http://localhost:3000');
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//   );
//   res.setHeader("Access-Control-Allow-Methods", "GET, POSH, PATCH, DELETE");
//   next();
// });


// Router
app.use("/api/courses", coursesRoutes);
app.use("/api/shop", shopRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/customerRoutes", customerRoutes);
app.use("/api/user", memberRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api", employeeRoutes);
app.use("/Orders", OrderRoutes);

// Error handler
app.use((req, res, next) => {
  throw new httpError("Route can't find!", 404);
});

app.use((error, req, res, next) => {
  if (res.headerSent) return next(error);
  res
    .status(error.code || 500)
    .json({ message: error.message || "unKnown Error!" });
});

app.listen(process.env.PORT || 5000, () => console.log("server start 🥶"));

// ---------
