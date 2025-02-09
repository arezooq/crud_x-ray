
# CRUD X-Ray Project

This project is a CRUD application built with NestJS and Docker. It integrates MongoDB for data storage and RabbitMQ for message queuing. This README provides instructions for setting up and running the project locally using Docker.

## Prerequisites

Make sure you have the following installed on your machine:

- [Docker](https://www.docker.com/get-started) (including Docker Compose)
- [Node.js](https://nodejs.org/) (for development purposes)
- [Yarn](https://classic.yarnpkg.com/en/docs/install) (for package management)

## Project Structure

- `src/`: The main source code for the application.
- `Dockerfile`: Dockerfile for building the NestJS application.
- `docker-compose.yml`: Docker Compose configuration for the entire stack, including MongoDB, RabbitMQ, and the application.
- `.env`: Environment variables for the application.

## Environment Variables

You can configure the application using environment variables in the `.env` file.

Here is an example of the `.env` file:

```env
# MongoDB connection string
MONGO_URI=mongodb://$DB_USERNAME:$DB_PASSWORD@mongodb:$DB_PORT/$DB_DATABASE

# RabbitMQ connection string
RABBITMQ_URI=amqp://guest:guest@rabbitmq:5672

# Database connection parameters (for MongoDB)
DB_PORT=27017
DB_USERNAME=root
DB_PASSWORD=
DB_DATABASE=mng_x-ray
```

## Getting Started

Follow these steps to get the project up and running on your local machine:

### 1. Clone the repository

```bash
git clone https://github.com/arezooq/crud_x-ray.git
cd crud_x-ray
```

### 2. Set up environment variables

Create a `.env` file in the root of your project directory and configure the necessary values as shown above.

### 3. Build and start the Docker containers

Run the following command to build and start all containers:

```bash
docker-compose up --build
```

This will:
- Build the NestJS app from the `Dockerfile`.
- Start the MongoDB container for data storage.
- Start the RabbitMQ container for message queuing.
- Expose the application on `localhost:3000`.

### 4. Accessing the application

Once the containers are up and running, you can access the application at:

- **Application**: `http://localhost:3000`
- **MongoDB**: Connect to the MongoDB instance using `mongodb://localhost:27017`.
- **RabbitMQ**: Access RabbitMQ on `http://localhost:15672` (default credentials: `guest/guest`).

### 5. Running the application in development mode

If you prefer to run the application locally without Docker for development purposes, follow these steps:

1. Install dependencies:

   ```bash
   yarn install
   ```

2. Set up the `.env` file with appropriate values.

3. Run the application:

   ```bash
   yarn start
   ```

   The application will run on `http://localhost:3000`.

### 6. Running tests

To run the tests for this project, use the following command:

```bash
yarn test
```

This will run the test suite and output the results in the console.

## Docker Compose Configuration

The `docker-compose.yml` file defines the services required for the application:

- **crud_x-ray**: The NestJS application that serves the API.
- **mongodb**: A container running MongoDB for data storage.
- **rabbitmq**: A container running RabbitMQ for message queuing.

Here is a brief description of the services:

```yaml
services:
  crud_x-ray:
    build:
      context: .
      dockerfile: ./Dockerfile
    container_name: crud_x-ray
    image: common/crud_x-ray:1.0.0
    restart: always
    environment:
      - NODE_ENV=development
      - RABBITMQ_CONNECTION=amqp://guest:guest@rabbitmq:5672
      - DataBase=mongo
      - mongodb_database=mng_x-ray
      - mongodb_addr=mongodb://mongodb:27017
      - mongodb_username=root
      - mongodb_password=
      - mongodb_timeout=30
      - http_port=3000
    volumes:
      - 
    ports:
      - "127.0.0.1:3000:3000"
    expose:
      - 80
    networks:
      - company_network
networks:
  arzesh_network:
    name: company_network
```

## Contributing

I welcome contributions! If you'd like to contribute to the project, feel free to fork the repository, create a new branch, and submit a pull request.

Please ensure your changes pass the test suite before submitting a pull request.
