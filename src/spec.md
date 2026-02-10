# Brew Board - Home Brewery Tap List App

## Overview
A home brewery tap list application that allows users to manage their beer inventory with detailed information about each brew.

## Core Features

### Beer Management
- Add new beers to the tap list
- Edit existing beer entries with full field editing capability
- Remove beers from the list
- Toggle between "On Tap" and "Bottle" status for each beer

### Beer Information
Each beer entry contains:
- Name
- Style (e.g., IPA, Stout, Lager)
- ABV (Alcohol by Volume percentage)
- IBU (International Bitterness Units)
- Description

### User Interface
- Clean, visually appealing list layout displaying all beers
- Add button for creating new beer entries
- Edit dialog that allows modification of all beer fields (name, style, ABV, IBU, description, and On Tap/Bottle status)
- Edit dialog pre-fills all current values when opened
- Form validation for all editable fields
- Remove options for each beer
- Updates are immediately reflected in the beer list after saving
- Consistent styling between Add Beer and Edit Beer dialogs
- Responsive design for various screen sizes

## Backend Requirements
- Store all beer data persistently
- Support CRUD operations (Create, Read, Update, Delete) for beer entries
- Handle beer status updates (On Tap/Bottle toggle)

## Data Storage
The backend must store:
- Beer inventory with all specified fields (name, style, ABV, IBU, description, status)
- Persistent storage of all user-created beer entries
