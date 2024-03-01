# Parkway

## Description
The core drivers behind this effort are:
- Provide a replacement for the current accounting package used by the church
- Provide an administrative portal that could serve as a replacement for PlanningCenter
    - Tools to manage members and visitors
    - A way to manage portions of the service without creating a giant to-do over it
- A way to to automated posting to social media (facebook, twitter, tiktok, youtube, instagram, etc.)
- A replacement for the existing web site
- A slew of other projects (security, maintenance, facility automation, slack integration, etc.)

There is interest in taking it public and offering it on a subscription basis to other organizations once the kinks are worked out.

## Table of Contents
- [Parkway](#parkway)
  - [Description](#description)
  - [Table of Contents](#table-of-contents)
  - [Technology](#technology)
  - [Components](#components)
  - [Diagrams](#diagrams)
  - [Roadmap](#roadmap)
  - [Changelog](#changelog)
      - [2024.02.20](#20240220)

## Technology
The application is built on the MERN stack (Mongo - Express - React - Node)

## Components
The application consists of:
- Mongodb Atlas data structure hosted in Azure
- Backend Node.js API (using Mongoose) to connect to and perform CRUD operations on the MongoDb data structure
- Frontend React Vite app for the admin portal
- Frontend React Vite app for the public facing site 

## Diagrams
| Name | Use | Link |
|------|-----|------|
| Diagram 1 | Description of diagram 1 | [Link to diagram 1](https://example.com/diagram1) |
| Diagram 2 | Description of diagram 2 | [Link to diagram 2](https://example.com/diagram2) |
| Diagram 3 | Description of diagram 3 | [Link to diagram 3](https://example.com/diagram3) |


## Roadmap
[Create a roadmap]]

## Changelog
#### 2024.02.20
- Initial push of base architecture
