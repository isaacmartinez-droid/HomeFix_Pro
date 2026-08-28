const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'HomeFix Pro API',
      version: '1.0.0',
      description: 'Documentación de la API de HomeFix Pro para el proyecto de Diseño de Sistemas en Internet (UNI)',
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Servidor de Desarrollo Local',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [path.join(__dirname, './routes/*.js')], // Ruta a los archivos con las anotaciones
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
