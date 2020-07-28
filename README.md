# SF Asset Dive

## About

Build and validate parts of a Salesforce asset dependancy tree.

## Supported Asset Dependancies

* Labels/Translations
* Visualforce Pages
* Visualforce Components
* Apex Classes

### Labels/Translations

* Verify there are no duplicate labels
* Verify there are no duplicate translations
* Verify the cound of labels matches the count of translations
* Verify every label has a cooresponding translation
* Verify every translation has a cooresponding label

### Visualforce Pages

* Verify all referenced Visualforce Components exist
* Verify all referenced Labels exist
* Verify all referenced Apex Controllers exist

### Visualforce Components

* Verify all referenced Visualforce Components exist
* Verify all referenced Labels exist

### Apex Classes

*

## Roadmap

* Refactor for modular configuration
* Add LWC support
    * Verify labels exist
* Add Aura Component support
    * Verify labels exist
* Add Package.xml support
    * Verify Apex Classes are listed (or *)
    * Verify LWCs are listed (or *)
    * Verify Aura Components are listed (or *)
    * Verify Visualforce Pages are listed (or *)
    * Verify Visualforce Components are listed (or *)

# Config.json

This file with require configuration per your system.

## rootPath

*String* **required**

This needs to be the `src` directory of your Salesforce site.

## pages

*Array<String>* **required**

List of Visualforce Pages that need to be processed

## components

*Array<String>* **required**

List of Visualforce Components that need to be processed

## classes
*Array<String>* **required**

list of Apex Classes that need to be processed.