# stop-reject-think

## Using locally

### Register the app

Register your local instance using the Application Registration Portal
as described
[here](https://docs.microsoft.com/en-us/outlook/rest/node-tutorial#register-the-app).

Copy `sample.env` to `.env` and set `APP_ID` and `APP_PASSWORD`
according to the values generated using the Application Registration
Portal.

### Setup

```
npm i
```

### Running

```
npm start
```

### Using

Visit <http://localhost:8080>.

## Deploying

### Build and push image

```
docker build -t gcr.io/stop-reject-think/stop-reject-think:latest
docker push gcr.io/stop-reject-think/stop-reject-think:latest
```
