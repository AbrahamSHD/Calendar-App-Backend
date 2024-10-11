# Etapa 1: Instalar dependencias
FROM node:20.12.2-alpine AS deps

# Instalar compatibilidad con libc6
RUN apk add --no-cache libc6-compat

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package.json package-lock.json ./

# Instalar dependencias
RUN npm install --frozen-lockfile

# Etapa 2: Construir la aplicación
FROM node:20.12.2-alpine AS builder

# Establecer directorio de trabajo
WORKDIR /app

# Copiar dependencias desde la etapa anterior
COPY --from=deps /app/node_modules ./node_modules

# Copiar el resto de los archivos de la aplicación
COPY . .

# Ejecutar el script de build
RUN npm run build

# Etapa 3: Imagen de producción
FROM node:20.12.2-alpine AS runner

# Establecer directorio de trabajo
WORKDIR /usr/src/app

# Copiar archivos de producción
COPY package.json package-lock.json ./

# Instalar solo dependencias de producción
RUN npm install --production

# Copiar el build desde la etapa builder
COPY --from=builder /app/dist ./dist

# Comando para iniciar la aplicación
CMD ["node", "dist/main"]
