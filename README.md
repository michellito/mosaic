
# MOSAIC RAAMP2 Data Vis

This repo contains code for a prototype visualization of the MOSAIC RAAMP2 sensor dataset. The full dataset can be obtained from the [CyVerse Data Commons](https://datacommons.cyverse.org/browse/iplant/home/shared/commons_repo/curated/mosaic_raamp2).

### Clone the repository

`git clone git@github.com:michellito/mosaic.git`
  

### Download the Data

A subset of the RAAMP2 data was processed further for specific use with this prototype. It can downloaded from [Google Drive](https://drive.google.com/drive/folders/15QBcoDj0NNJ7759S05TNTI4xcI-n1CzT?usp=sharing).

Copy the `data` folder into the cloned `mosaic` folder.  The code currently expects the full dataset of 30 participants (S001-S030) so you must copy the entire folder.
 
### Install web server

This project requires a local web server to run because it fetches data locally.  I used https://github.com/tapio/live-server to take advantage of the live reload functionality (requires node.js and npm to install).

Once installed, you can run the prototype by running `live-server` in the `mosaic` directory.