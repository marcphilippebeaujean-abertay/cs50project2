pipeline {
    agent { label 'master' }
    stages {
        stage('Check') {
            steps {
                sh 'ls'
            }
        }
        stage('Test') {
            agent { docker { image 'python:latest' } }
            steps {
                sh 'python3 application/tests.py'
            }
        }
        stage('Build') {
            steps {
                sh 'docker-compose build'
            }
        }
        stage('Deploy') {
            steps {
                /* stop running containers */
                sh 'docker stop letschat_web_server_1'
                sh 'docker stop letschat_app_1'
                sh 'docker-compose up -d'
            }
        }
    }
}
