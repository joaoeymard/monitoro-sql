# Monitoro

Monitoro is a core agent designed for monitoring slow-running queries in SQL Server databases. This project aims to provide a simple and effective way to identify performance issues in database queries and log them for further analysis.

## Features

- Connects securely to SQL Server using environment variables for configuration.
- Monitors queries that exceed a defined execution time threshold.
- Sends logs of slow queries to an external service for tracking and analysis.
- Centralized logging using Winston for better error handling and monitoring.

## Project Structure

```
monitoro/
├── config/              # Configuration files for environment variables
│   └── index.js         # Loads and exports configuration settings
├── services/            # Service layer for database and external service interactions
│   ├── dbService.js     # Handles database connections and slow query retrieval
│   └── sendService.js   # Sends query logs to an external service
├── utils/               # Utility functions and helpers
│   └── logger.js        # Centralized logging setup
├── index.js             # Main entry point for the application
├── package.json         # Project metadata and dependencies
├── .env                 # Environment variables (not versioned)
└── README.md            # Project documentation
```

## Installation

1. Clone the repository:

   ```
   git clone <repository-url>
   cd monitoro
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create a `.env` file in the root directory and populate it with your database and external service credentials. Refer to the example below:

   ```
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_SERVER=your_server
   DB_PORT=your_port
   DB_DATABASE=your_database
   DB_TRUST_CERT=false

   QUERY_THRESHOLD=300

   EXTERNAL_SERVICE_URL=https://api.example.com/log
   EXTERNAL_SERVICE_TOKEN=your_token
   ```

## Usage

To start the monitoring process, run the following command:

```
npm start
```

This will initiate the monitoring of slow queries based on the defined threshold and send logs to the specified external service.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.
