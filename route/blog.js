const router = require("express").Router();
const BlogController = require("../controller/blog")

router.get('/blog-stats', BlogController.getData)
router.get('/blog-search', BlogController.searchBlogs);

module.exports = router;