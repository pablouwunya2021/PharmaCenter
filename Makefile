.PHONY: help dev prod stop clean logs build fresh restart db-reset

# Colores para output
GREEN=\033[32m
BLUE=\033[34m
RED=\033[31m
YELLOW=\033[33m
NC=\033[0m

help: ## Muestra esta ayuda
	@echo "$(BLUE)Comandos disponibles para PharmaCente:$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "$(GREEN)%-15s$(NC) %s\n", $$1, $$2}'

dev: ## Inicia el entorno de desarrollo
	@echo "$(BLUE)🚀 Iniciando entorno de desarrollo...$(NC)"
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build -d
	@echo "$(GREEN)✅ Entorno de desarrollo iniciado!$(NC)"
	@echo "$(YELLOW)Frontend: http://localhost:5173$(NC)"
	@echo "$(YELLOW)API: http://localhost:3000$(NC)"
	@echo "$(YELLOW)Adminer: http://localhost:8080$(NC)"

fresh: ## Limpia todo y inicia desarrollo desde cero
	@echo "$(YELLOW)🧹 Limpiando entorno...$(NC)"
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml down --volumes --remove-orphans
	docker system prune -f
	@echo "$(BLUE)🏗️ Construyendo desde cero...$(NC)"
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml build --no-cache
	@echo "$(GREEN)🚀 Iniciando entorno limpio...$(NC)"
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
	@echo "$(GREEN)✅ ¡Proyecto limpio y actualizado!$(NC)"
	@echo "$(YELLOW)Frontend: http://localhost:5173$(NC)"
	@echo "$(YELLOW)API: http://localhost:3000$(NC)"

stop: ## Detiene todos los contenedores
	@echo "$(RED)🛑 Deteniendo contenedores...$(NC)"
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml down

clean: ## Limpia contenedores, imágenes y volúmenes
	@echo "$(RED)🗑️ Limpiando contenedores, imágenes y volúmenes...$(NC)"
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml down --volumes --rmi all --remove-orphans
	docker system prune -af --volumes

logs: ## Muestra los logs de todos los servicios
	@echo "$(BLUE)📋 Mostrando logs...$(NC)"
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml logs -f

git-sync: ## Sincroniza con git y reinicia desarrollo
	@echo "$(BLUE)📥 Sincronizando con Git...$(NC)"
	git pull origin main
	@make fresh