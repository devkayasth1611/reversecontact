const mobileEnrichmentSchema = require('../model/mobileEnrichmentModel');

// Add mobile enrichment details
exports.addMobileEnrichment = (req, res) => {
    const mobileEnrichment = new mobileEnrichmentSchema(req.body);
    if (mobileEnrichment.mobile_2 === "") {
        mobileEnrichment.mobile_2 = null;
    }
    mobileEnrichment.save()
        .then((data) => {
            if (!data) {
                res.json({
                    message: "Something went wrong while adding the details",
                    status: 400,
                    error: err,
                });
            } else {
                res.json({
                    message: "Details added successfully",
                    status: 200,
                    data: data,
                });
            }
        })
        .catch((err) => {
            res.json({
                message: "Something went wrong while adding the details",
                status: 400,
                error: err,
            });
        });
};

// Get all mobile enrichment details
exports.getMobileEnrichment = (req, res) => {
    mobileEnrichmentSchema.find()
        .then((data) => {
            if (!data) {
                res.json({
                    message: "Something went wrong while fetching the details",
                    status: 400,
                    err: error,
                });
            } else {
                res.json({
                    message: "Details fetched successfully",
                    status: 200,
                    data: data,
                });
            }
        })
        .catch((err) => {
            res.json({
                message: "Error in fetching data",
                status: 400,
                error: err,
            });
        });
};

// Fetch mobile enrichment details for a single LinkedIn URL
exports.getMobileEnrichmentBySingleLinkedInLink = (req, res) => {
    const linkedinUrl = decodeURIComponent(req.params.linkedin_url.trim()); // Decode the URL

    // Find a document with the exact LinkedIn URL in the database
    mobileEnrichmentSchema.findOne({ linkedin_url: linkedinUrl })
        .then((data) => {
            if (!data) {
                return res.status(404).json({
                    message: "No details found for the provided LinkedIn URL",
                    status: 404,
                });
            }
            res.status(200).json({
                message: "Details fetched successfully",
                status: 200,
                data: data,
            });
        })
        .catch((err) => {
            res.status(500).json({
                message: "Error in fetching data by LinkedIn URL",
                status: 500,
                error: err.message,
            });
        });
};

// Fetch mobile enrichment details for multiple LinkedIn URLs
exports.getMobileEnrichmentByMultipleLinkedInLinks = (req, res) => {
    const linkedinUrls = req.params.linkedin_urls.split(','); // Read and split the LinkedIn URLs from route params

    // Trim each URL to remove spaces and filter out any empty strings
    const trimmedUrls = linkedinUrls.map(url => url.trim()).filter(url => url !== "");

    if (trimmedUrls.length === 0) {
        return res.status(400).json({
            message: "No valid LinkedIn URLs provided",
            status: 400,
        });
    }

    mobileEnrichmentSchema.find({ linkedin_url: { $in: trimmedUrls } })
        .then((data) => {
            if (!data || data.length === 0) {
                return res.status(404).json({
                    message: "No details found for the provided LinkedIn URLs",
                    status: 404,
                });
            }
            res.status(200).json({
                message: "Details fetched successfully",
                status: 200,
                data: data,
            });
        })
        .catch((err) => {
            res.status(500).json({
                message: "Error in fetching data by LinkedIn URLs",
                status: 500,
                error: err.message,
            });
        });
};
