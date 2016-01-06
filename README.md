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

# How to start a Quiver server on Google Compute Engine
* Create a new compute engine project:
  * Open the [Cloud Platform Console](https://console.cloud.google.com/?_ga=1.8589557.1999999848.1449090455).
  * In the drop-down menu at the top, select Create Project.
  * Name your project and enable billing
* Setup your compute engine instance:
  * Click "Get started" under "Try Compute Engine"
  * Wait for initialization to complete
  * Click "Create instance"
  * Check buttons to allow http and https traffic under "Firewall"
  * Use a new static IP address:
     * Click to expand "Management, disk, networking, access & security options"
     * Click to expand "Networking"
     * Under "External IP" choose new static IP address.  Enter any name and click reserve
  * Click "Create"
* Click "SSH" under the "Connect" column.  Run the following in the SSH window to install dependencies and start a Quiver server:
  * Install dev tools:
     * ```curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash```
     * ```sudo apt-get install -y nodejs```
     * ```sudo apt-get install build-essential```
     * ```sudo apt-get install git-all```
  * Download and build the Quiver server:
     * ```sudo git clone https://github.com/uproxy/freedom-social-quiver-server /usr/local/freedom-social-quiver-server;  cd /usr/local/freedom-social-quiver-server;  npm install;```
  * Edit /etc/rc.local (requires sudo)
     * Add the following lines **BEFORE** the call to ```exit 0```
         * ```iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 3000```
         * ```PORT=3000 node /usr/local/freedom-social-quiver-server/app.js ```
  * Reboot the machine for changes to take effect: ```sudo reboot```.  You will need to reconnect to the SSH window after this.
* Test your new IP address by visiting http://**YourIPAddress**.  It should display a ```Hello; socket.io!``` page.  You can find your IP address under "External IP" in the Google Cloud Platform console.
