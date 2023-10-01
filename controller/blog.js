const axios = require("axios");
const _ = require("lodash");

// Create a memoized function to cache the analytics results
const getBlogStats = _.memoize(async function () {
  try {
    const response = await axios.get("https://intent-kit-16.hasura.app/api/rest/blogs", {
      headers: {
        "x-hasura-admin-secret": "32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6"
      }
    });

    // Process the response data as needed
    const blogData = response.data.blogs; // Access the 'blogs' array within the response data

    // Calculate the total number of blogs fetched
    const totalBlogs = blogData.length;

    // Find the blog with the longest title
    const blogWithLongestTitle = _.maxBy(blogData, "title.length").title;

    // Determine the number of blogs with titles containing the word "privacy"
    const blogsWithPrivacyTitle = _.filter(blogData, (blog) => _.includes(blog.title.toLowerCase(), "privacy"));
    const numBlogsWithPrivacyTitle = blogsWithPrivacyTitle.length;

    // Create an array of unique blog titles (no duplicates)
    const uniqueBlogTitles = _.uniqBy(blogData, "title").map(blog => blog.title);

    // Return the statistics
    return {
      totalBlogs,
      longestBlogTitle: blogWithLongestTitle,
      numBlogsWithPrivacyTitle,
      uniqueBlogTitles
    };
  } catch (error) {
    // Handle any errors that occur during the API request or data processing
    console.error(error);
    throw new Error("Failed to fetch blog statistics");
  }
}, () => "blogStatsCacheKey");

module.exports.getData = async function (req, res) {
  try {
    // Get the cached results or fetch the data and store it in the cache
    const blogStats = await getBlogStats();

    // Send the cached statistics as the response
    res.json(blogStats);
  } catch (error) {
    // Handle any errors that occur during the cache retrieval or API request
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Create a memoized function to cache the search results
const searchBlogs = _.memoize(async function (query) {
  try {
    const response = await axios.get('https://intent-kit-16.hasura.app/api/rest/blogs', {
      headers: {
        'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6'
      }
    });

    const blogData = response.data.blogs; // Access the 'blogs' array within the response data

    // Filter the blogs based on the query
    const filteredBlogs = blogData.filter(blog => blog.title.toLowerCase().includes(query));

    // Extract the titles and other information from the filtered blogs
    const titles = filteredBlogs.map(blog => blog.title);
    const imageUrls = filteredBlogs.map(blog => blog.image_url);
    const ids = filteredBlogs.map(blog => blog.id);

    // Calculate the total number of filtered blogs
    const totalBlogs = filteredBlogs.length;

    // Find the blog with the longest title among the filtered blogs
    const blogWithLongestTitle = _.maxBy(filteredBlogs, 'title.length').title;

    // Return the filtered blogs and statistics
    return {
      totalBlogs,
      longestBlogTitle: blogWithLongestTitle,
      titles,
      imageUrls,
      ids
    };
  } catch (error) {
    // Handle any errors that occur during the API request, data processing, or search process
    console.error(error);
    throw new Error('Failed to fetch search results');
  }
}, (query) => `searchResultsCacheKey:${query}`);

module.exports.searchBlogs = async function (req, res) {
  try {
    const query = req.query.query.toLowerCase(); // Get the query parameter and convert it to lowercase

    // Get the cached results or fetch the data and store it in the cache
    const searchResults = await searchBlogs(query);

    // Send the cached search results as the response
    res.json(searchResults);
  } catch (error) {
    // Handle any errors that occur during the cache retrieval, API request, or search process
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};