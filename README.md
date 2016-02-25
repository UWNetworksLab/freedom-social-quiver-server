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

# How to start a Quiver server on Digital Ocean
* Create a new Digital Ocean account and setup billing at [digitalocean.com](http://digitalocean.com)
* Click "Create Droplet"
 * Choose Ubuntu, $5/mo, any region
 * No additional option are necessary
 * Add SSH keys following [these instructions](https://www.digitalocean.com/community/tutorials/how-to-use-ssh-keys-with-digitalocean-droplets)
 * Click "Create"
* SSH into your Droplet by running ```ssh -i <path_to_your_ssh_key> root@<your_ip_address>```, then follow instructions from **How to setup uProxy using SSH**

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
* Click "SSH" under the "Connect" column.  Then see the section titled **How to setup uProxy using SSH**

# How to setup uProxy using SSH
* SSH into your machine.  See above instructions for help with setting up a virtual machine on Google Compute Engine or Digital Ocean
* Install dev tools:
 * ```curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash```
 * ```sudo apt-get install -y nodejs```
 * ```sudo apt-get install -y build-essential```
 * ```sudo apt-get install -y git-all```
* Download and build the Quiver server:
 * ```sudo git clone https://github.com/uproxy/freedom-social-quiver-server /usr/local/freedom-social-quiver-server;  cd /usr/local/freedom-social-quiver-server;  npm install;```
* Edit /etc/rc.local (requires sudo)
  * Add the following lines **BEFORE** the call to ```exit 0```
     * ```iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 3000;```
     * ```PORT=3000 DEBUG=stats node /usr/local/freedom-social-quiver-server/app.js 2>&1 | logger -t quiver;```
* Reboot the machine for changes to take effect: ```sudo reboot```.  You will need to reconnect to the SSH window after this.
* Test your new IP address by visiting http://**YourIPAddress**.  It should display a ```Hello; socket.io!``` page.  You can find your IP address under "External IP" in the Google Cloud Platform console.
* Logs for your Quiver server will be in your system logs with the "quiver" tag.  To see the logs you can run ```grep quiver /var/log/syslog```.

# How to setup Amazon CloudFront for your Quiver server
* [Login to AWS via CloudFront page](https://aws.amazon.com/cloudfront/)
 * Note: info@uproxy.org is already setup for an account
* Click CloudFront under "Storage & Content Delivery"
* Click Create Distribution
* Under "Web", click "Get Started"
* Configure your distribution:
 * Under "Origin Settings":
     * Enter Origin Domain Name, e.g. "quiver-test.appspot.com". Note if you don't have a domain name, you can use xip.io, e.g. "123.234.345.456.xip.io"
     * Make sure "Origin Protocol Policy" is "HTTP Only" (Quiver server on GCE currently only supports HTTP traffic, however traffic to cloudfront will be encrypted and all data passed through the Quiver server is end-to-end encrypted by freedom-social-quiver client).
     * Use default values for all other fields in Origin Settings
 * Under "Default Cache Behavior Settings":
     * Set "Viewer Protocol Policy" to "HTTPS Only" (only allow secure traffic from client to CloudFront)
     * Set "Allowed HTTP Methods" to "GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE"
     * Set "Forward Headers" to "Whitelist"
     * Add the following 5 headers to "Whitelist Headers": ```Content-type``` ```Origin``` ```User-Agent``` ```X-DevTools-Emulate-Network-Conditions-Client-Id``` ```X-Session-Id```
     * Set "Forward Cookies" to "All"
     * Set "Forward Query Strings" to "Yes"
     * All other fields can use the default values in "Default Cache Behavior Settings"
 * Use default settings for all fields in "Distribution Settings"
 * Click "Create Distribution"
* Once your distribution is created, visit the "General" settings page for that distribution:
 * Wait for "Distribution Status" to be Deployed
 * Copy the Domain Name (e.g. d1j0v91oi5t6ys.cloudfront.net)
* Once your new distribution is created and deployed, you can disguise traffic to the Quiver server by making HTTPS requests to "https://a0.awsstatic.com" and setting the "Host" header to your Domain Name (e.g. "d1j0v91oi5t6ys.cloudfront.net")
