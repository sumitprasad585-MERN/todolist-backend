const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'MERN Todolist Application',
    version: '1.0.0',
    description: 'A simple todo list application using Node.js with Authentication'
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },
  security: [
    {
      bearerAuth: []
    }
  ]
};

module.exports = swaggerDefinition;
