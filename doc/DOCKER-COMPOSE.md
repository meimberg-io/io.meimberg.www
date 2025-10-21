# Docker Compose Usage

Guide for using Docker Compose in local development and testing.

## Available Files

### 1. `docker-compose.yml` (Unified with Profiles)

Single file with both dev and prod configurations using profiles.

**Usage:**
```bash
# Development mode (with volume mounts)
docker compose --profile dev up

# Production mode (test production build)
docker compose --profile prod up

# Rebuild and start
docker compose --profile dev up --build

# In background
docker compose --profile dev up -d

# View logs
docker compose --profile dev logs -f

# Stop
docker compose --profile dev down
```

### 2. `docker-compose.prod.yml` (Reference Only)

This file shows what GitHub Actions automatically creates on the server. It includes Traefik labels for automatic SSL and routing. **This is for reference/documentation only** - you don't use it locally.

**What it contains:**
- Pre-built image from GitHub Container Registry
- Traefik labels for routing and SSL
- External traefik network
- Production environment variables

---

## Quick Commands

### Development Workflow

```bash
# 1. Copy environment file
cp env.example .env

# 2. Add your Storyblok token to .env
# Edit .env and set NEXT_PUBLIC_STORYBLOK_TOKEN

# 3. Start development container
docker compose --profile dev up

# 4. Access app at http://localhost:3000

# 5. Stop
docker compose --profile dev down
```

### Production Testing

```bash
# Test production build locally
docker compose --profile prod up --build

# Access at http://localhost:3000
```

### Rebuild

```bash
# Force rebuild
docker compose --profile dev build --no-cache

# Rebuild and start
docker compose --profile dev up --build
```

---

## Features

### Development Mode (`--profile dev`)

✅ **Volume mounts** - Source code mounted for changes  
✅ **Fast iteration** - No rebuild needed for code changes  
✅ **Isolated environment** - Consistent across machines  
✅ **Health checks** - Monitor container health  

**Mounted directories:**
- `./src` → `/app/src`
- `./public` → `/app/public`
- Config files (next.config.ts, tailwind.config.js, etc.)
- `node_modules` is NOT mounted (uses container's version)

### Production Mode (`--profile prod`)

✅ **No volume mounts** - Fully containerized  
✅ **Production build** - Optimized standalone output  
✅ **Production environment** - NODE_ENV=production  
✅ **Local testing** - Test production build before deploy  

---

## Configuration

### Environment Variables

Loaded from `.env` file in project root:

```bash
# .env
NODE_ENV=development
APP_PORT=3000
NEXT_PUBLIC_STORYBLOK_TOKEN=your-token-here
NEXT_PUBLIC_STORYBOOK_DISABLECACHING=false
NEXT_PUBLIC_MATOMO_TRACKER=false
NEXT_PUBLIC_STORYBLOK_EDITOR_SECRET=your-secret-here
REVALIDATE_SECRET=your-revalidate-secret-here
```

### Port Mapping

Default: `3000:3000` (host:container)

**Change port:**
```bash
# In .env
APP_PORT=3001

# Or directly
APP_PORT=3001 docker compose --profile dev up
```

### Health Checks

Both configurations include health checks:
- **Interval**: 30 seconds
- **Timeout**: 10 seconds
- **Retries**: 3
- **Start period**: 40 seconds

**View health:**
```bash
docker ps
# Look for "healthy" status

# Or detailed
docker inspect www-dev | grep -A 20 Health
```

---

## Troubleshooting

### Container won't start

```bash
# View logs
docker compose --profile dev logs

# Check if port is in use
lsof -i :3000  # Mac/Linux
netstat -ano | findstr :3000  # Windows

# Try different port
APP_PORT=3001 docker compose --profile dev up
```

### Changes not reflecting (dev mode)

```bash
# Rebuild container
docker compose --profile dev up --build

# Ensure volume mounts are working
docker compose --profile dev exec www-dev ls -la /app/src
```

### Production build fails

```bash
# Build with detailed output
docker compose --profile prod build --progress=plain

# Or build directly
docker build -t www-test .
```

### Missing Storyblok content

```bash
# Check if token is set
docker compose --profile dev exec www-dev env | grep STORYBLOK

# Verify token works
# Check Storyblok dashboard: Settings → Access Tokens
```

---

## Differences from Production Deployment

### Local Development
```yaml
services:
  www-dev:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - ./src:/app/src:ro  # Source mounted
    networks:
      - app-network
```

### Production Server (created by GitHub Actions)
```yaml
services:
  www:
    image: ghcr.io/username/repo:latest  # Pre-built image
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.www.rule=Host(`www.meimberg.io`)"
      - "traefik.http.routers.www.entrypoints=websecure"
      - "traefik.http.routers.www.tls.certresolver=le"
    networks:
      - traefik  # External network managed by Ansible
```

**Key differences:**
- Production uses **pre-built image** from GitHub Container Registry
- Production has **Traefik labels** for automatic routing and SSL
- Production uses **external traefik network** (not local bridge)
- Production doesn't expose ports directly (Traefik handles routing)

---

## Best Practices

### Development

1. **Use docker-compose --profile dev** for daily development
2. **Keep .env file updated** with required variables
3. **Don't commit .env** (use env.example)
4. **Rebuild periodically** to get dependency updates

### Testing

1. **Test production build locally** before pushing
2. **Use --profile prod** to test production environment
3. **Verify environment variables** work in production mode
4. **Check health checks** are passing

### Cleanup

```bash
# Stop and remove containers
docker compose --profile dev down

# Remove volumes
docker compose --profile dev down -v

# Remove images
docker images | grep www
docker rmi <image-id>

# Full cleanup
docker system prune -a
```

---

## Related Documentation

- [README.md](../README.md) - Main documentation
- [DEPLOYMENT.md](DEPLOYMENT.md) - Production deployment
- [GITHUB-SETUP.md](GITHUB-SETUP.md) - Initial setup
- [SETUP-CHECKLIST.md](SETUP-CHECKLIST.md) - Quick start checklist

