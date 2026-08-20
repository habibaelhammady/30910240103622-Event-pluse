const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'EventPulse API',
      version: '1.0.0',
      description: 'EventPulse - Event Management System API Documentation',
      contact: {
        name: 'EventPulse Support',
        email: 'support@eventpulse.com'
      }
    },
    servers: [
      {
        // Relative to wherever the docs are being served from, so "Try it out"
        // works on the deployed host and locally without any extra config.
        url: '/',
        description: 'Current host'
      },
      {
        url: 'http://localhost:5000',
        description: 'Local development'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'User ID'
            },
            name: {
              type: 'string',
              description: 'User name'
            },
            email: {
              type: 'string',
              description: 'User email'
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              description: 'User role'
            }
          }
        },
        Event: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Event ID'
            },
            title: {
              type: 'string',
              description: 'Event title'
            },
            description: {
              type: 'string',
              description: 'Event description'
            },
            date: {
              type: 'string',
              format: 'date-time',
              description: 'Event date and time'
            },
            location: {
              type: 'string',
              description: 'Event location'
            },
            category: {
              type: 'string',
              description: 'Event category ID'
            }
          }
        },
        Category: {
          type: 'object',
          properties: {
            _id: {
              type: 'string'
            },
            name: {
              type: 'string'
            },
            description: {
              type: 'string'
            }
          }
        },
        Registration: {
          type: 'object',
          properties: {
            _id: {
              type: 'string'
            },
            user: {
              type: 'string',
              description: 'User ID'
            },
            event: {
              type: 'string',
              description: 'Event ID'
            },
            registeredAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
