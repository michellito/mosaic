# MOSAIC RAAMP2 Data Visualization
------------

This repo contains code for a prototype visualization of the MOSAIC RAAMP2 sensor dataset. The full dataset can be obtained from the [CyVerse Data Commons](https://datacommons.cyverse.org/browse/iplant/home/shared/commons_repo/curated/mosaic_raamp2).

## Notes

To view this project, clone this repository and open `index.html` in a web browser, preferably Google Chrome.

The webpage also includes answers to the written questions.

## Included files

* a04.js - contains implementation for drawing tree maps using size, count, best direction, and squarify methods
* d3.v5.js - d3 code bundle
* flare.js - contains a tree dataset of the files in the source code of Flare, a library for creating data visualizations
* index.css - custom css
* index.html - html template for the tree map, buttons for selecting the tree map implementation, and written questions
* README.md - this file
* test-cases.js - includes very simple test cases for testing tree functions


## References
* I referenced the [Squarified Treemaps](https://www.win.tue.nl/~vanwijk/stm.pdf) paper by Bruls, Huizing, and van Wijk to develop my implementation of the Squarify algorithm.

