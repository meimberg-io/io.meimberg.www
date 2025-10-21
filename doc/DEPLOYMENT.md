# Deployment

Automatic deployment on push to `main` branch.

## How It Works

Push to `main` → GitHub Actions:
1. Builds Docker image
2. Pushes to GitHub Container Registry (GHCR)
3. SSHs to server
4. Updates container with Traefik labels
5. Traefik automatically routes traffic with SSL

**Time:** ~3-4 minutes

---

## Initial Setup

**First time?** Complete setup first: [GITHUB-SETUP.md](GITHUB-SETUP.md)

This covers:
- GitHub Variables & Secrets
- DNS configuration
- Server infrastructure
- SSH keys

---

## Deploy

```bash
git push origin main
```

Watch: https://github.com/meimberg-io/io.meimberg.www/actions

---

## Operations

### View logs

```bash
ssh deploy@hc-02.meimberg.io "docker logs www -f"
```

### Restart app

```bash
ssh deploy@hc-02.meimberg.io "cd /srv/projects/www && docker compose restart"
```

### Manual redeploy

```bash
ssh deploy@hc-02.meimberg.io "cd /srv/projects/www && docker compose pull && docker compose up -d"
```

### SSH into container

```bash
ssh deploy@hc-02.meimberg.io "docker exec -it www sh"
```

### Check container status

```bash
ssh deploy@hc-02.meimberg.io "docker ps | grep www"
```

### View compose file

```bash
ssh deploy@hc-02.meimberg.io "cat /srv/projects/www/docker-compose.yml"
```

---

## Troubleshooting

### Container not starting

```bash
# View logs
ssh deploy@hc-02.meimberg.io "docker logs www"

# View full compose logs
ssh deploy@hc-02.meimberg.io "cd /srv/projects/www && docker compose logs"

# Check if container exists
ssh deploy@hc-02.meimberg.io "docker ps -a | grep www"
```

### SSL issues (502/503 errors)

```bash
# Check Traefik logs
ssh root@hc-02.meimberg.io "docker logs traefik | grep www"

# Verify labels are correct
ssh deploy@hc-02.meimberg.io "docker inspect www | grep -A 10 Labels"
```

### DNS check

```bash
# Check DNS resolution
dig www.meimberg.io +short

# Should return server IP
# If empty, DNS not configured or not propagated yet (wait up to 24h)
```

### Port conflicts

```bash
# Check if port is already in use
ssh deploy@hc-02.meimberg.io "netstat -tuln | grep 3000"

# Check all running containers
ssh deploy@hc-02.meimberg.io "docker ps"
```

### Image pull issues

```bash
# Check if image exists
ssh deploy@hc-02.meimberg.io "docker images | grep www"

# Manually pull image
ssh deploy@hc-02.meimberg.io "docker pull ghcr.io/meimberg-io/io.meimberg.www:latest"

# If authentication fails, check GITHUB_TOKEN in workflow
```

### Deployment verification failed

The workflow checks if container is running after deploy:

```bash
# Manually check
ssh deploy@hc-02.meimberg.io "docker ps | grep www"

# If not running, check why
ssh deploy@hc-02.meimberg.io "docker logs www"
```

---

## Rollback

### To previous version

```bash
# SSH to server
ssh deploy@hc-02.meimberg.io

# Go to project directory
cd /srv/projects/www

# Pull specific version (replace SHA with commit hash)
docker pull ghcr.io/meimberg-io/io.meimberg.www:main-abc123

# Update docker-compose.yml to use specific tag
nano docker-compose.yml
# Change image: line to: ghcr.io/meimberg-io/io.meimberg.www:main-abc123

# Restart
docker compose up -d
```

---

## Performance

### Check resource usage

```bash
# Container stats
ssh deploy@hc-02.meimberg.io "docker stats www --no-stream"

# Server resources
ssh deploy@hc-02.meimberg.io "df -h && free -h"
```

### View response times

```bash
# Check Traefik access logs (if enabled)
ssh root@hc-02.meimberg.io "docker logs traefik | grep www"
```

---

## Updates

### Update dependencies

```bash
# Locally
npm update
npm run test

# Commit and push
git add package*.json
git commit -m "Update dependencies"
git push origin main
```

### Update Node.js version

Update in `Dockerfile`:
```dockerfile
FROM node:18-alpine AS base  # Change version here
```

---

## Related Documentation

- [GITHUB-SETUP.md](GITHUB-SETUP.md) - Initial setup
- [SETUP-CHECKLIST.md](SETUP-CHECKLIST.md) - Quick checklist
- [DOCKER-COMPOSE.md](DOCKER-COMPOSE.md) - Local development
- [README.md](../README.md) - Project overview
