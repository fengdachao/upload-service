node {
  stage('build') {
    sh 'docker build -t martin31/upload-server .'
  }
  stage('run') {
    sh 'docker run --add-host=mongo-local:172.17.0.1 --name upload-server -p 9001:9001 -p 9002:9002 -p 8080:8080 -v recording-images:/usr/src/app/images martin31/upload-server'
  }
}