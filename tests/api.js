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
