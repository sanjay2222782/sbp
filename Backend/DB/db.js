const { connect } = require("mongoose");



connect(process.env.DB_URI).then(() => {
    console.log("Database connection successfull")
}).catch((err) => {
    console.log("database connection error", err.message);
});

    