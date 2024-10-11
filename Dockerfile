# Install dependencies only when needed
FROM node:20.12.2-alpine AS deps

# Instalar compatibilidad con libc6
RUN apk add --no-cache libc6-compat

# Crear directorio de trabajo
WORKDIR /app

# Copiar los archivos de dependencias
COPY package.json package-lock.json ./

# Instalar dependencias usando el lockfile
RUN npm install --frozen-lockfile

# Build the app with cached dependencies
FROM node:20.12.2-alpine AS builder

# Crear directorio de trabajo
WORKDIR /app

# Copiar las dependencias del contenedor anterior
COPY --from=deps /app/node_modules ./node_modules

# Copiar el resto de los archivos de la aplicación
COPY . .

# Ejecutar el script de build
RUN npm run build

# Production image, copy all the files and run the application
FROM node:20.12.2-alpine AS runner

# Set working directory for production
WORKDIR /usr/src/app

# Copiar package.json y lockfile para producción
COPY package.json package-lock.json ./

# Instalar solo las dependencias de producción
RUN npm install --production

# Copiar el build desde el contenedor builder
COPY --from=builder /app/dist ./dist

# Comando de inicio de la aplicación
CMD ["node", "dist/main"]
