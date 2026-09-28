pipeline {

    agent any

    environment {
        IMAGE_NAME = 'student-registration'
        CONTAINER_NAME = 'student-registration'
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Checking out source code from GitHub...'
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing Node.js dependencies...'
                sh 'npm ci'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Building Docker image...'
                sh 'docker build -t ${IMAGE_NAME}:latest .'
            }
        }

        stage('Deploy Container') {
            steps {
                echo 'Deploying Docker container...'

                sh '''
                    docker stop ${CONTAINER_NAME} || true
                    docker rm ${CONTAINER_NAME} || true

                    docker run -d \
                        --name ${CONTAINER_NAME} \
                        -p 5000:5000 \
                        ${IMAGE_NAME}:latest
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                echo 'Checking deployed application...'

                sh '''
                    sleep 5
                    curl -f http://localhost:5000
                '''
            }
        }
    }

    post {
        success {
            echo '======================================'
            echo 'Student Registration App deployed!'
            echo '======================================'
        }

        failure {
            echo '======================================'
            echo 'Pipeline failed!'
            echo 'Check the Jenkins console output.'
            echo '======================================'
        }
    }
}
