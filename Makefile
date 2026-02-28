.PHONY: help dev stop lint typecheck check build clean sb-pull sb-types docker-build docker-up docker-down

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-18s\033[0m %s\n", $$1, $$2}'

# --- Dev ---

dev: ## Start Next.js dev server
	npm run dev

stop: ## Kill Next.js dev server
	@pkill -f "next dev" 2>/dev/null && echo "Stopped." || echo "Not running."

# --- Quality ---

lint: ## Run ESLint
	npx next lint

typecheck: ## Run TypeScript check
	npx tsc --noEmit

check: lint typecheck ## Run lint + typecheck

# --- Build ---

build: ## Build Next.js for production
	npm run build

clean: ## Remove build artifacts
	rm -rf .next

# --- Storyblok ---

sb-pull: ## Pull component definitions from Storyblok
	npx storyblok components pull --space 330326

sb-types: ## Generate TypeScript types from Storyblok
	bash scripts/generate-sb-types.sh

sb-sync: sb-pull sb-types ## Pull components + generate types

# --- Docker ---

docker-build: ## Build production Docker image (reads build args from .env)
	docker build -t meimberg-www \
		--build-arg NEXT_PUBLIC_STORYBLOK_TOKEN=$$(grep NEXT_PUBLIC_STORYBLOK_TOKEN .env | cut -d= -f2) \
		--build-arg NEXT_PUBLIC_STORYBOOK_DISABLECACHING=$$(grep NEXT_PUBLIC_STORYBOOK_DISABLECACHING .env | cut -d= -f2) \
		--build-arg NEXT_PUBLIC_MATOMO_TRACKER=$$(grep NEXT_PUBLIC_MATOMO_TRACKER .env | cut -d= -f2) \
		.

docker-up: ## Start production container locally (port 3010)
	docker run --rm -p 3010:3000 --env-file .env --name meimberg-www meimberg-www

docker-down: ## Stop local production container
	@docker stop meimberg-www 2>/dev/null && echo "Stopped." || echo "Not running."
