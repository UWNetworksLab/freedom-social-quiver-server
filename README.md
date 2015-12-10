# How to start a Quiver server on AppEngine
* Install the [Google Cloud SDK](https://cloud.google.com/sdk/) if needed
 * To install on Linux or Mac OS X, run the following: ```$ curl https://sdk.cloud.google.com | bash```
* Create new AppEngine project
 * Open the [Cloud Platform Console](https://console.cloud.google.com/?_ga=1.8589557.1999999848.1449090455).
 * In the drop-down menu at the top, select Create Project.
 * Select an App Engine location under advanced options.
 * Give your project a name.
 * Note the Project ID because it will be used for commands and in configurations.
 * [Enable billing for your project.](https://console.cloud.google.com/project/_/settings)
* Make a git clone of ```https://github.com/uProxy/freedom-social-quiver-server```
* In your freedom-social-quiver-server clone directory
 * run ```npm install```
 * Run ```gcloud init```
     * Choose ```[1] Re-initialize this configuration [default] with new settings```
     * Login to your Google account if necessary
     * Enter the project ID for your new AppEngine application
     * Answer no to this question ```Generally projects have a repository named [default]. Would you like to try clone it?```
 * Run ```gcloud preview app deploy app.yaml --promote```
* Now your quiver server is running at ```https://<your_app_id>.appspot.com```
