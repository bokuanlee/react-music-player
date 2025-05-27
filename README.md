# Mindsync Music Website

The Mindsync Music Website dynamically selects the next music album to play based on the listener's physiological state, detected in real-time using Biopac data and processed through a machine learning model.

The system uses AutoHotKey (AHK) to simulate keystrokes (`q`, `w`, `e`, or `r`), which trigger playback of the corresponding music albums:

- `q` → **Relaxation**
- `w` → **Focus**
- `e` → **Stress**
- `r` → **Memory**

Each key corresponds to a curated album that aligns with the listener's current mental or emotional state.

## System Overview

- **Biopac Integration**: Collects real-time physiological data from the listener.
- **ML Model**: Processes the Biopac data and classifies the listener’s status into one of four states.
- **AHK Scripts**: Detect interface triggers (such as red UI areas) and coordinate the next round of data collection and playback control.

## Current Status and Future Plans

Currently, the website runs locally and is in its prototype stage.

**Future improvements include:**
- Development of a portable status-detection device
- A more accurate machine learning model
- A fully-featured and publicly deployed web application

## Getting Started

To run the project locally:

```bash
yarn install
yarn start
