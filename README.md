<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Nest - CalendarApp

1. Clonar el repositorio

2. Ejecutar
```
  npm install
```

3. Levantar la base de datos 
```
  docker compose up -d
```

4. Clonar el archivo __.env.template__ y renombrar la copia a __.env__

5. Llenar las variables de entorno definidas en el __.env__

6. Ejecutar la aplicación con el comando 
```
  npm start:dev
```


## Stack Usado
* Mongo
* Nest

# Production Build

1. Crear el archivo __.env.prod__
2. Llenar las variables de entorno de prod
3. Crear la nueva imagen
```
  docker-compose -f docker-compose.prod.yaml --env-file .env.prod up --build
```