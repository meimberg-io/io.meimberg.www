# Setup Checklist

Quick reference checklist for io.meimberg.www setup and deployment.

## Local Development

### 1. Clone Repository

```bash
cd ~/workspace
git clone git@github.com:meimberg-io/io.meimberg.www.git
cd io.meimberg.www
```

### 2. Environment Setup

```bash
cp env.example .env
```

Edit `.env` with your values:
- [ ] `NEXT_PUBLIC_STORYBLOK_TOKEN` - Get from Storyblok dashboard
- [ ] `NEXT_PUBLIC_STORYBLOK_EDITOR_SECRET` - Set editor preview secret
- [ ] `NEXT_PUBLIC_STORYBOOK_DISABLECACHING` - Set to `false` for dev
- [ ] `NEXT_PUBLIC_MATOMO_TRACKER` - Set to `false` for dev

### 3. Install & Test

```bash
npm install
npm run dev         # Test locally at http://localhost:3000
npm run lint        # Check linting
npm run build       # Test build
```

### 4. Docker Development (Optional)

```bash
# Copy .env file
cp env.example .env

# Start with Docker
docker compose --profile dev up

# Access at http://localhost:3000
```

---

## Production Deployment

### 5. GitHub Variables

**Settings → Secrets and variables → Actions → Variables**

- [ ] `APP_DOMAIN` = `www.meimberg.io`
- [ ] `SERVER_HOST` = `hc-02.meimberg.io`
- [ ] `SERVER_USER` = `deploy`
- [ ] `NEXT_PUBLIC_STORYBOOK_DISABLECACHING` = `false`
- [ ] `NEXT_PUBLIC_MATOMO_TRACKER` = `true`

### 6. GitHub Secrets

**Settings → Secrets and variables → Actions → Secrets**

- [ ] `SSH_PRIVATE_KEY` - Deploy user SSH key
- [ ] `NEXT_PUBLIC_STORYBLOK_TOKEN` - Production Storyblok token
- [ ] `NEXT_PUBLIC_STORYBLOK_EDITOR_SECRET` - Editor preview secret
- [ ] `REVALIDATE_SECRET` - Cache revalidation secret

### 7. DNS Configuration

- [ ] CNAME: `www.meimberg.io` → `hc-02.meimberg.io`
- [ ] Test: `dig www.meimberg.io +short`

### 8. Server Infrastructure

- [ ] Ansible infrastructure deployed (Docker, Traefik, deploy user)
- [ ] Can SSH to server: `ssh deploy@hc-02.meimberg.io`
- [ ] Traefik network exists: `ssh deploy@hc-02.meimberg.io "docker network ls | grep traefik"`

### 9. Deploy

```bash
git add .
git commit -m "Setup deployment"
git push origin main
```

- [ ] Watch GitHub Actions: https://github.com/meimberg-io/io.meimberg.www/actions
- [ ] Verify deployment successful
- [ ] Test app at https://www.meimberg.io

---

## Verification

### Check Deployment

```bash
# Container running
ssh deploy@hc-02.meimberg.io "docker ps | grep www"

# View logs
ssh deploy@hc-02.meimberg.io "docker logs www -f"

# Test health
curl -I https://www.meimberg.io

# Check SSL
curl -vI https://www.meimberg.io 2>&1 | grep -i "subject:"
```

### Test Storyblok Integration

- [ ] Content loads on homepage
- [ ] Preview mode works (editor secret)
- [ ] Navigation works
- [ ] Images load from Storyblok

### Test Matomo Tracking

- [ ] Matomo script loads (if enabled)
- [ ] Page views tracked

---

## Common Issues

### Local Development

❌ **Missing Storyblok token** → Add to `.env`  
❌ **Port 3000 in use** → Change `APP_PORT` in `.env`  
❌ **Build fails** → Check Node version (18+)  
❌ **Content not loading** → Verify Storyblok token is correct  

### Deployment

❌ **GitHub Actions fails** → Check secrets/variables configured  
❌ **Container not starting** → Check logs with `docker logs www`  
❌ **SSL not working** → DNS not propagated or Traefik issue  
❌ **403/404 errors** → Check Traefik labels and routing  

---

## Quick Reference

### Local Commands

```bash
# Development
npm run dev

# Build
npm run build

# Lint
npm run lint

# Docker dev
docker compose --profile dev up

# Docker prod test
docker compose --profile prod up --build
```

### Production Commands

```bash
# View logs
ssh deploy@hc-02.meimberg.io "docker logs www -f"

# Restart
ssh deploy@hc-02.meimberg.io "cd /srv/projects/www && docker compose restart"

# Redeploy
ssh deploy@hc-02.meimberg.io "cd /srv/projects/www && docker compose pull && docker compose up -d"

# SSH into container
ssh deploy@hc-02.meimberg.io "docker exec -it www sh"
```

---

## Estimated Time

- **Local setup**: 5-10 minutes
- **GitHub configuration**: 5 minutes
- **First deployment**: 3-4 minutes
- **Total**: ~15-20 minutes

---

## Related Documentation

- [README.md](../README.md) - Project overview
- [GITHUB-SETUP.md](GITHUB-SETUP.md) - Detailed GitHub setup
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment operations
- [DOCKER-COMPOSE.md](DOCKER-COMPOSE.md) - Docker usage
- [Ansible Structure](../../io.meimberg.meta/doc/ANSIBLE-STRUCTURE.md) - Infrastructure overview

