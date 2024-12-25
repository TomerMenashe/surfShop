/**
 * Basic test file for running a few route checks against the server.
 * The tests here are minimal; the main testing was done via Postman, console logs,
 * and manual verification. This file serves as a simple automated check for a
 * few critical endpoints.
 * 
 * Usage:
 *    - Ensure the server is running locally on port 5002.
 *    - Run this file using `node filename.js`.
 * 
 * Explanation:
 *    1. We define a small array of routesToTest, each with relevant information 
 *       like method, URL, expected status, etc.
 *    2. We then iterate over them, performing basic fetch requests with node-fetch.
 *    3. On success, we log a PASSED message, on failure a FAILED message.
 *    4. If the login route returns status 200, we store the returned token in authToken,
 *       allowing us to test routes that require authentication (though this example 
 *       doesn't demonstrate fully protected endpoints).
 */

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

// Define a list of routes and how we expect them to behave
const routesToTest = [
  {
    method: 'POST',
    url: 'http://localhost:5002/api/auth/login',
    description: 'Logs in a user with valid credentials',
    expectedStatus: 200,
    body: { username: 'admin', password: 'admin' },
  },
  {
    method: 'GET',
    url: 'http://localhost:5002/api/surfboards',
    description: 'Fetches the list of all surfboards',
    expectedStatus: 200,
  },
  {
    method: 'GET',
    url: 'http://localhost:5002/api/location',
    description: 'Fetches location data',
    expectedStatus: 200,
  },
  {
    method: 'GET',
    url: 'http://localhost:5002/api/reviews/ST-GLID-003',
    description: 'Fetches reviews for a specific surfboard',
    expectedStatus: 200,
  },
  {
    method: 'POST',
    url: 'http://localhost:5002/api/reviews/add',
    description: 'Adds a new review for a surfboard',
    expectedStatus: 201,
    body: {
      sku: 'ST-GLID-003',
      username: 'testuser',
      rating: 5,
      comment: 'Great board!',
    },
  },
];

// We'll store an auth token here if one is returned from the login route
let authToken = null;

/**
 * testRoute function
 * Runs a single route test by making a fetch request to the specified URL with
 * the given method, body, etc. Compares the actual status to the expectedStatus.
 * 
 * @param {Object} config
 * @param {('GET'|'POST'|'PUT'|'DELETE')} config.method - HTTP method to use
 * @param {string} config.url - The URL endpoint
 * @param {string} config.description - Brief test description
 * @param {number} config.expectedStatus - The HTTP status code we expect
 * @param {Object} [config.body] - Optional request body
 * @param {boolean} [config.requiresAuth] - Whether authentication is required (not fully used here)
 */
const testRoute = async ({ method, url, description, expectedStatus, body, requiresAuth }) => {
  try {
    //** Prepare fetch options **//
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    };

    //** If a route requires auth and we have a token, attach it (placeholder logic) **//
    if (requiresAuth && authToken) {
      options.headers['Authorization'] = `Bearer ${authToken}`;
    }

    console.log(`Running test: ${description}`);

    const response = await fetch(url, options);

    const responseBody = await response.json().catch(() => ({}));

    if (response.status === expectedStatus) {
      console.log(`PASSED: [${method}] ${url} - ${description}`);
    } else {
      console.error(`FAILED: [${method}] ${url} - ${description}`);
      console.error(`  Expected Status: ${expectedStatus}, Received: ${response.status}`);
      console.error(`  Response Body: ${JSON.stringify(responseBody, null, 2)}`);
    }

    //** If this was the login route and we got a successful 200, store any token **//
    if (url.includes('/api/auth/login') && response.status === 200) {
      authToken = responseBody.token;
    }
  } catch (error) {
    console.error(`FAILED: [${method}] ${url} - ${description}`);
    console.error(`  Error: ${error.message}`);
  }
};

/**
 * runTests
 * Iterates over the routesToTest array, running each test sequentially.
 * If a test requires auth and we don't yet have a token, tries logging in first.
 */
const runTests = async () => {
  console.log('Starting basic server-side route tests...');

  for (const route of routesToTest) {
    //** If the route requires auth but we have no token, try logging in with the first route **//
    if (route.requiresAuth && !authToken) {
      console.log('Fetching authentication token...');
      await testRoute(routesToTest[0]);
    }
    await testRoute(route);
  }

  console.log('All tests completed.');
};

runTests();
