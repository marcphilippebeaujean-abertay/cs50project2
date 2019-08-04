pipeline {
    agent { label 'master' }
    stages {
        stage('Check') {
            steps {
                sh 'ls'
            }
        }
        /*stage('Build') {
            agent { docker { image 'maven:3.3.3' } }
            steps {
                sh 'mvn -B -DskipTests clean package'
            }
        }
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
                sh 'docker-compose up'
            }
        }
    }
}
