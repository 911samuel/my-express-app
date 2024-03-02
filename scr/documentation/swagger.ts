import swaggerAutogen from 'swagger-autogen';

const apiDoc = {
  openapi: '3.0.0',
  info: {
    title: 'MY BRAND API DOCUMENTATION',
    description: 'Documentation for the Express API endpoints',
    version: '1.0.0',
  },
  servers: [
    {
      url: 'http://localhost:3000',  
      description: 'Local server',
    },
  ],
  paths: {
    
  },  
  components: {
    securitySchemes: {
      apiKeyAuth: {
        type: 'apiKey',
        name: 'apiKey',
        in: 'header',  
      },
    },
  },
  security: [{ apiKeyAuth: [] }],  
};

const outputFilePath = './swagger_output.json';
const endpointsFilePaths = ['./scr/index.ts']; 

swaggerAutogen({ openapi: '3.0.0' })(outputFilePath, endpointsFilePaths, apiDoc);
