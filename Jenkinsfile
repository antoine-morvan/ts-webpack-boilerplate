import groovy.json.JsonSlurper

node {
  try {
    def CI = 'true'
    def NODE_IMAGE='node:12.16.1'

    cleanWs()
    notifyStarted()

    /*
     Requires Jenkins Plugin "SonarQube Scanner for Jenkins"
     then Sonar Scanner tool is defined in Jenkins under
     Manage Jenkins > Global Tool Configuration > SonarQube Scanner
     */
    def scannerHome = tool 'SonarQubeDefaultScanner'

    // checkout : 10 min timeout
    timeout(time: 10, unit: 'MINUTES') {
      stage('Clone Git Repo') {
        checkout scm

        // Get git commit information
        GIT_AUTHOR_EMAIL = sh (
              script: 'git --no-pager show -s --format=\'%ae\'',
              returnStdout: true
        ).trim()
        GIT_COMMITTER_EMAIL = sh (
              script: 'git --no-pager show -s --format=\'%ce\'',
              returnStdout: true
        ).trim()
        GIT_COMMIT_MSG = sh (
              script: "git --no-pager show -s --format='%s%n%b'",
              returnStdout: true
        )

        if (env.CHANGE_ID) {
            branchName = "PullRequest-${env.CHANGE_ID}"
        } else {
            branchName = "${env.BRANCH_NAME}"
        }
        lowCaseMsg = GIT_COMMIT_MSG.toLowerCase();
        SKIPCI = lowCaseMsg.contains("#skipci") || lowCaseMsg.contains("#noci");
        SKIPTRIGGER = lowCaseMsg.contains("#skiptrigger") || lowCaseMsg.contains("#notrigger");
      }
    }

    packageJson = readFile "${env.WORKSPACE}/package.json"
    PACKAGE_VERSION = new JsonSlurper().parseText(packageJson).version

    SONAR_PROJECT_BASE_NAME="ts-webpack-boilerplate"
    SONAR_HOST_URL="https://sonar-URL/"

    if (branchName == "master") {
        projName = "${SONAR_PROJECT_BASE_NAME}"
        projVersion = "${PACKAGE_VERSION}"
    } else {
        projName = "${SONAR_PROJECT_BASE_NAME}/$branchName"
        projVersion = "${PACKAGE_VERSION}"
    }

    echo """
    Author = ${GIT_AUTHOR_EMAIL}
    Committer = ${GIT_COMMITTER_EMAIL}
    Commit message =
    --
${GIT_COMMIT_MSG}
    --
    SonarQube config:
      -Dproject.settings=.releng/sonar-project.properties
      -Dsonar.projectKey=com.example.${SONAR_PROJECT_BASE_NAME}:$branchName
      -Dsonar.projectName=$projName
      -Dsonar.projectVersion=$projVersion
      -Dsonar.host.url=${SONAR_HOST_URL}
    Skip Continuous Integration = ${SKIPCI}
    Skip Downstream Project Trigger = ${SKIPTRIGGER}
    """

    if (!SKIPCI) {
      // Fetch : 30 min timeout
      timeout(time: 30, unit: 'MINUTES') {
        parallel 'Fetch Dependencies': {
            docker.image(NODE_IMAGE).inside() {
              sh "npm clean-install --no-optional"
            }
        }
      }

      // Linter : 5 min timeout
      timeout(time: 5, unit: 'MINUTES') {
        stage('ESLint') {
            docker.image(NODE_IMAGE).inside() {
              sh "npm run lint"
            }
        }
      }
      // Compile & Bundle : 5 min timeout
      timeout(time: 5, unit: 'MINUTES') {
        stage('Build') {
            docker.image(NODE_IMAGE).inside() {
              sh "npm run build"
            }
        }
      }

      // Test : 30 min timeout
      timeout(time: 30, unit: 'MINUTES') {
        stage('Test') {
            docker.image(NODE_IMAGE).inside() {
              sh "npm run test:unit"
            }
        }
      }


      // Sonar : 30 min timeout
      timeout(time: 30, unit: 'MINUTES') {
        stage('SonarQube Analysis') {
            /*
              Requires Jenkins Plugin "SonarQube Scanner for Jenkins"
              then Sonar Scanner tool is defined in Jenkins under
              Manage Jenkins > Global Tool Configuration > SonarQube Scanner
              */
            withSonarQubeEnv('SonarQubeDefaultServer') {
              nodejs(nodeJSInstallationName: 'Node12'){
                sonarCmdLine = "${scannerHome}/bin/sonar-scanner"
                sonarCmdLine += " -Dproject.settings=.releng/sonar-project.properties"
                sonarCmdLine += " -Dsonar.projectKey=com.example.${SONAR_PROJECT_BASE_NAME}:$branchName"
                sonarCmdLine += " -Dsonar.projectName=$projName"
                sonarCmdLine += " -Dsonar.projectVersion=$projVersion"
                sonarCmdLine += " -Dsonar.host.url=${SONAR_HOST_URL}"
                sh "${sonarCmdLine}"
              }
            }
        }
        stage('SonarQube - Quality Gate') {
            timeout(time: 1, unit: 'HOURS') {
                def qg = waitForQualityGate()
                if (qg.status != 'OK') {
                    echo """
  Pipeline aborted due to SonarQube quality gate failure: ${qg.status}
  Check status here : ${SONAR_HOST_URL}dashboard?id=com.example.${SONAR_PROJECT_BASE_NAME}:$branchName
  """
                }
            }
        }
      }
      if (!SKIPTRIGGER) {
        triggerDownstream()
      } else {
        echo 'Skipped downstream project trigger.'
      }
      notifySuccessful()
    } else {
        echo 'Skipped full build.'
    }
  } catch (e) {
    // currentBuild.result = "FAILED"
    // notifyFailed(e)
    // throw e
    notifyFailed(e)
  } finally {
    try {
      // make sure files generated inside docker containers are deletable
      docker.image("busybox").inside("--user 0:0") {
        sh "chmod 777 -R ./node_modules/ ./dist"
      }
    } catch (e) {
      // silent
    }
    cleanWs()
  }
}

def triggerDownstream() {
  echo "Triggering downstream jobs"
  echo " >> disabled"
  // def jobList = [];

  // def branch = env.BRANCH_NAME;
  // switch (branch) {
  //   case "develop":
  //     jobList.add("/otherjob")
  //     break;
  //   default:
  //     echo "No job for branch ${branch}"
  // }

  // jobList.each { jobName ->
  //   echo "Trigger downstream job ${jobName}"
  //   try {
  //     build([job: "${jobName}", propagate: false, wait: false ])
  //   } catch (err) {
  //     echo err.getMessage()
  //     echo "Job '${jobName}' not found, but we will continue."
  //   }
  // }
}


def notifyStarted() { /* .. */ }

def notifySuccessful() {
  def body = """
<p>Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' terminated successfully. See ${env.RUN_DISPLAY_URL}</p>

<p>--<br/>
<i>This is an automatic e-mail. Please do not respond.</i></p>
"""
  emailext (
      subject: "✅ 🍺 👌 Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' - SUCCESS 👌 🍺 ✅",
      body: body,
      recipientProviders: [[$class: 'CulpritsRecipientProvider'], [$class: 'RequesterRecipientProvider']],
      to: "$GIT_AUTHOR_EMAIL, $GIT_COMMITTER_EMAIL"
    )
}

def notifyFailed(e) {
  def failMessage = e.getMessage()
  def body = """

<p>FAILED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' with message</p>

<pre>
$failMessage
</pre>

<p>Check console output at "${env.RUN_DISPLAY_URL}" to view the results.</p>

<p>--<br/>
<i>This is an automatic e-mail. Please do not respond.</i></p>
"""
  emailext (
      subject: "❌ ⚠️ 😱 Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' - FAILED 😱 ⚠️ ❌",
      body: body,
      recipientProviders: [[$class: 'CulpritsRecipientProvider'], [$class: 'RequesterRecipientProvider']],
      to: "$GIT_AUTHOR_EMAIL, $GIT_COMMITTER_EMAIL"
    )
}
