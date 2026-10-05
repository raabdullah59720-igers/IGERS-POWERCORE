# IGERS-BD-01 Magazine Integration | Developer Package

This package integrates the Library magazine into the existing IGERS POWERCORE static website without external viewer dependencies.

## Contents
#magazine/index.html: responsive magazine page
#magazine/styles.css: responsive styling
#magazine/IGERS-BD-01-Professional-Engineering-Magazine.pdf: 70-page A4 magazine
#integration/magazine-section.html: homepage card
#integration/magazine.css: homepage card styling

## Deploy
Copy the `magazine/` folder into the existing repository root. The public page becomes `/IGERS-POWERCORE/magazine/`.

Add the markup from `integration/magazine-section.html` to the existing homepage and its CSS to the existing stylesheet. Do not replace the existing index or application files.

## Source identity
Project: IGERS-BD-01
Author / Inventor: Abdullah Al Rafi [BD]
Publication: 09 September 2026
Edition: 2026 Professional Thesis & Engineering Concept Edition

## QA
The PDF is bundled locally, so the viewer does not depend on an external document host. Browser-native PDF rendering provides zoom, page navigation and printing. A direct Open PDF and Download action are included for compatibility.
