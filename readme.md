Grafana k6 is an open-source load testing tool that makes performance testing easy and productive for engineering teams. k6 is free, developer-centric, and extensible.

Using k6, you can test the reliability and performance of your systems and catch performance regressions and problems earlier. k6 will help you to build resilient and performant applications that scale.

```javascript
import http from 'k6/http';
import { check, group, sleep } from 'k6';

export let options = {
    stages: [
        { duration: '1m', target: 30 }, // Ramp up to 30 virtual users over 1 minute
        { duration: '3m', target: 30 }, // Stay at 30 virtual users for 3 minutes
        { duration: '1m', target: 0 },  // Ramp down to 0 virtual users over 1 minute
    ],
    thresholds: {
        'http_req_duration{scenario:AirportByID}': ['p(95)<500'], // Define your own threshold here
    },
};

export default function () {
    group('AirportByID', function () {
        let res = http.get(`https://airportgap.dev-tester.com/api/airports/KIX`);

        check(res, {
            'Status is 200': (r) => r.status === 200,
        });

        sleep(1); // Add a short delay between requests (in seconds)
    });
}
```

In this script:

1. I import the necessary modules from K6 and define the test options.
2. The `options` object specifies the load testing stages. In this example, it starts with 30 virtual users, maintains it for 3 minutes, and then ramps down to 0 virtual users over 1 minute.
3. I define a function that represents the test scenario for retrieving airport information by ID.
4. Within the scenario, we generate a random airport ID or specify a range of IDs you want to test.
5. I make an HTTP GET request to the API with the generated airport ID.
6. I use the `check` function to validate that the response status code is 200, indicating a successful request.
7. I add a short sleep between requests to simulate user think time.

Run using VS Code Extension: https://marketplace.visualstudio.com/items?itemName=k6.k6

Result:

![](/result.png)

Let's analyze the key metrics and provide feedback:

1. **Checks**: The checks pass rate is quite low (10.68%). This suggests that a significant number of requests are failing the validation checks. You should investigate why these checks are failing and improve the reliability of your API or test script. It's essential to ensure that the responses are as expected.

2. **Data Transfer**: The data_sent and data_received metrics show low data transfer rates (225 kB sent and 2.9 MB received at 749 B/s and 9.6 kB/s, respectively). This might be fine for testing specific scenarios, but for more realistic testing, you may want to consider adjusting the payload size or increasing the load to better simulate real-world conditions.

3. **Group Duration**: The group_duration metrics show an average duration of 1.25 seconds for the "AirportByID" group. While the average response time is acceptable, you should review whether this response time aligns with your application's performance goals. If not, you may need to optimize your API or infrastructure.

4. **HTTP Request Metrics**:
   - http_req_blocked, http_req_connecting, http_req_receiving, and http_req_sending times are generally low, indicating that the requests are not significantly delayed due to the network or request setup.
   - The http_req_duration is 255.5ms on average, which is within an acceptable range, but there are occasional higher response times (up to 1.15s). You may want to investigate the cause of these occasional spikes and optimize your API or infrastructure accordingly.

5. **HTTP Request Failed**: The high failure rate (89.31%) indicates that the majority of requests are failing. Investigate why these requests are failing. It could be due to issues with the API, incorrect test setup, or insufficient resources on the server side. Ensure that the API can handle the load generated by K6.

6. **VUs and VUs Max**: You are using between 1 and 30 Virtual Users (VUs). The VUs represent the number of concurrent users making requests. The fact that you're not consistently using the maximum number of VUs indicates that your system might not be fully stressed. Consider increasing the VUs to better simulate real-world loads.

7. **Iteration Duration and Iterations**: The iteration_duration is around 1.25 seconds, and you're performing 19.2 requests per second. These metrics indicate that your test script is pacing requests at an acceptable rate.

In summary, the load testing results suggest that the API is experiencing a high failure rate and occasional response time spikes. You should focus on:

1. Investigating and resolving the issues causing request failures.
2. Identifying and optimizing the cause of occasional response time spikes.
3. Increasing the load or adjusting the payload to more accurately simulate real-world conditions.
4. Consider running longer tests to assess system stability over extended periods.
5. Continuously monitor the performance of your API to detect and address performance bottlenecks as they arise.

Remember that performance testing is an iterative process, and you may need to adjust your testing strategy based on the specific requirements and performance goals of your application.
