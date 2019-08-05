pipeline {
    agent { label 'master' }
    stages {
        stage('Check') {
            steps {
                sh 'ls'
            }
        }
        stage('Build') {
            steps {
                sh 'docker-compose build'
            }
        }/*
        stage('Test') {
            agent { docker { image 'maven:3.3.3' } }
            steps {
                sh 'mvn test'
            }
            post {
                always {
                    junit 'target/surefire-reports/*.xml'
                }
            }
        }*/
        stage('Deploy') {
            steps {
                sh 'docker stop letschat_web_server_1'
                sh 'docker stop letschat_app_1'
                sh 'docker-compose up -d'
            }
        }
    }
}
