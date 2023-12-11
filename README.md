# magnificent-sloth
Point of Sale for Dead Mongoose

### How to install

#### Prerequisites
To install the package locally, you first have to install `nvm`. Instructions can be found [here](https://github.com/nvm-sh/nvm#installing-and-updating).
Make sure you install at least the latest LTS release.

#### Install locally
1. Clone the repo to a directory of your choice.
1. Enter the directory: `cd /path/to/your/directory`.
1. Follow the guide at "Install NFC" for making NFC Functional.
1. Run `npm i`. This will use nvm that you've installed before.
1. Copy over `sample.env` and name it `.env`: `cp sample.env .env` 
1. To update the values in `.env`, simply enter the file using your favorite editor, e.g. `nano .env`.
1. Start the application with `npm start`.

#### Update semantic-ui
If changes are made to files in the semantic folder, these changes will become active only after you run the following command:
`npm run build-semantic`.

#### Install NFC
Making a NFC Reader functional is quite a task so here is a guide how to make NFC Functional. When using Linux there is a driver in place for handling Smartcard readers. We don't use this driver so we have to disable it and use the driver provided with the native node module which has to be installed with some specific steps.

1. If you want to use NFC-PCSC you should follow their [guide](https://www.npmjs.com/package/nfc-pcsc) on how to install the extension.
1. Check if the smartcard reader is connected to your pc by running the command 
```console
lsusb -t 
  /:  Bus 01.Port 1: Dev 1, Class=root_hub, Driver=xhci_hcd/12p, 480M
      |__ Port 3: Dev 6, If 0, Class=Chip/SmartCard, Driver=pn533_usb, 12M
          ...
```
This should return something comperable to this. If you don't see `Class=Chip/SmartCard` The NFC reader is not recognized and should first troubleshoot this issue.
1. In This case you can see the driver `pn533_usb` is being used. You dont want this since we use the driver provided with pcsclite. Run 
```console
lsmod | grep pn533_usb
Module                  Size  Used by
pn533_usb              20480  0
pn533                  45056  1 pn533_usb
nfc                   131072  1 pn533
```
This will return a list of drivers being used and these need to be disabled.
1. Run `sudo nano /etc/modprobe.d` and insert all the modules likes this:
```
pn533_usb
pn533
nfc
```
1. Reboot your PC
1. After restarting run these commands
```
# systemctl enable pcscd
# systemctl start pcscd
```

#### Build application
The repository supports building a deb-package to be able to install the app on debian/ubuntu machines (or any derivatives). To create the deb-package, run the following command:

`npm run build`

The deb-package can be found in dist/installers.

When the deb-package is installed and opened via gnome, the application expects the environment file to be in `/home/$USERNAME`. Make sure you copy `sample.env` to this location, rename it to `.env`, and update its values.
You can also just run `source .env` to add your environment variables to the current shell session. Add it to your `.bashrc` to make it permanent.
