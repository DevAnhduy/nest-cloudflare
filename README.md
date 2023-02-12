# Nest JS - Cloudflare



> NestJS Cloudflare is a API Tools buit by Nest.js which provides a high-level API to control
> Cloudflare 


#### What can I do?

Here are a few examples to get you started:

- Upload, serve file using R2


## Getting Started

### Before Installation
#### Module R2: 
- Your need R2 API key get from Cloudflare. Follow this document to generate key https://developers.cloudflare.com/r2/data-access/s3-api/tokens/
- Your need Account ID get from Cloudflare. Fllow this document to get account id
https://developers.cloudflare.com/fundamentals/get-started/basic-tasks/find-account-and-zone-ids/

### Installation

To install NestJS - Cloudflare:

```bash
Fork this project
or
Download as zip
```

#### Configuration

After installed, you need create a file `.env`, this file will store your keys for security

Example:
```bash
ENV=development or production (Environment of app)
PORT=1234 (Port of app)

R2_ACCOUNT_ID=string (Account ID of Cloudflare. For more detail, see section before install module R2)
R2_ACCESS_KEY_ID=string (Access Key ID of Cloudflare. For more detail, see section before install module R2)
R2_SECRET_ACCESS_KEY=string (Secret access key of Cloudflare. For more detail, see section before install module R2)
```

#### Usage
Start server
```bash
yarn start 
or
npm start
```
Call API like this document:
- [API Documentation](https://documenter.getpostman.com/view/11624893/2s935uGg5x#2b808038-086c-4112-ba46-205abac1ab21)

#### Resources
- [Cloudflare Guilde](https://developers.cloudflare.com)

## Contributing

## FAQ

