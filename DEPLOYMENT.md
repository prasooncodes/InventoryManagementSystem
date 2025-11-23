# CI/CD Pipeline with GitHub Actions and Docker for MERN Stack

This project includes a complete CI/CD pipeline using GitHub Actions and Docker to deploy a MERN stack application.

## Prerequisites

Before you begin, make sure you have:
- A GitHub account
- A Docker Hub account
- Docker installed on your local machine
- MongoDB database (Atlas or self-hosted)

## Project Structure

```
.
├── Backend/
│   ├── Dockerfile
│   └── ... (backend files)
├── Frontend1/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── ... (frontend files)
├── .github/
│   └── workflows/
│       └── main.yml
└── docker-compose.yml
```

## Setup Instructions

### Step 1: Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

Create the following secrets:
- `DOCKER_HUB_USERNAME`: Your Docker Hub username
- `DOCKER_HUB_ACCESS_TOKEN`: Your Docker Hub access token (create at hub.docker.com/settings/security)

### Step 2: Test Locally with Docker

Build and run the containers locally:

```bash
# Build images
docker-compose build

# Run containers
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down
```

### Step 3: Push to GitHub

Commit and push your changes to the main branch:

```bash
git add .
git commit -m "Add CI/CD pipeline with Docker"
git push origin main
```

The GitHub Actions workflow will automatically:
1. Checkout the code
2. Setup Node.js environment
3. Install dependencies
4. Run tests and linting
5. Build the frontend
6. Build Docker images for backend and frontend
7. Push images to Docker Hub

### Step 4: Deploy to Production

Once images are pushed to Docker Hub, you can deploy them on any server:

```bash
# Pull images
docker pull <your-dockerhub-username>/mern-backend:latest
docker pull <your-dockerhub-username>/mern-frontend:latest

# Run with docker-compose or individual containers
docker run -d -p 3001:3001 \
  -e MONGODB_URI=<your-mongodb-uri> \
  <your-dockerhub-username>/mern-backend:latest

docker run -d -p 80:80 \
  <your-dockerhub-username>/mern-frontend:latest
```

## Environment Variables

### Backend (.env)
```
MONGODB_URI=your_mongodb_connection_string
PORT=3001
NODE_ENV=production
```

### Frontend (.env)
```
VITE_API_URL=http://your-backend-url:3001/api
```

## Workflow Details

The GitHub Actions workflow (`main.yml`) performs:

1. **Code Checkout**: Gets the latest code
2. **Node.js Setup**: Installs Node.js 18
3. **Backend Build**: Installs dependencies and runs tests
4. **Frontend Build**: Installs dependencies, lints, and builds
5. **Docker Login**: Authenticates with Docker Hub
6. **Image Build & Push**: Creates and pushes Docker images with tags:
   - `latest`: Always points to the most recent build
   - `<commit-sha>`: Specific version for rollback capability

## Monitoring

Check your workflow status:
- Go to your GitHub repository
- Click on "Actions" tab
- View the workflow runs and logs

## Troubleshooting

### Build Fails
- Check GitHub Actions logs for specific errors
- Verify all secrets are correctly set
- Ensure package.json files are valid

### Docker Image Issues
- Test builds locally first: `docker build -t test-image ./Backend`
- Check Dockerfile syntax
- Verify .dockerignore is excluding unnecessary files

### Deployment Issues
- Ensure MongoDB connection string is correct
- Check environment variables are set
- Verify ports are not already in use

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Documentation](https://docs.docker.com/)
- [Docker Hub](https://hub.docker.com/)
