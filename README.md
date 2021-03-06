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

### Configuring

Set environment variables to configure the service.

#### `DB`

Database backend to use.

* `file` - use a local db.json file as the "database"
* `datastore` - use Google Cloud Datastore

#### `RUNNER`

Job runner to use.

* `timeout` - local, `setTimeout` based job runner
* `cron` - Google App Engine Cron Service runner

#### `READONLY`

Set to anything to disable creating new calendar events.

### Using

Visit <http://localhost:8080>.

## Deploying

### Google App Engine

```
gcloud app deploy
```

### Kubernetes

#### Build and push image

```
docker build -t gcr.io/stop-reject-think/stop-reject-think:latest .
docker push gcr.io/stop-reject-think/stop-reject-think:latest
```

#### Deploy

```
kubectl apply -f kubernetes.yaml
```
