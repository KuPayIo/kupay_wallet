Wallet project build

1. Fork the following two code bases from GitHub's main library and update them to the local directory to ensure they are in the same directory
https://github.com/GaiaWorld/gaia_wallet (Logic Code Base)
https://github.com/GaiaWorld/gaia_wallet_webserver (resource server)
2. Update the pi_build library from gitlab and ensure that it is in the same directory as the above two libraries
Http://192.168.31.241:10080/tech/pi_build.git
3. Copy node_modules in pi_build to gaia_wallet
4. Compile the build.bat file in gaia_wallet_webserver, compile once after the first update of the code here, follow-up special modifications and then consider compiling
5. Start the project automatically build and ensure it is always on
Gaia_wallet\script\run build.bat
6. Start the resource server
Gaia_wallet_webserver\ PI\back\start\start.bat
7. Web login
Http://127.0.0.1/wallet/app/boot/index.html
8. Follow-up will be free to develop