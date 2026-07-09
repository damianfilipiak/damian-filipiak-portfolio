# 🚀 Cloud-Native Personal Portfolio

[![Docker Pulls](https://img.shields.io/docker/pulls/xxxblacksanta/portfolio)](https://hub.docker.com/r/xxxblacksanta/portfolio)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**🔗 Live:** [damianfilipiak.vercel.app](https://damianfilipiak.vercel.app/)

Welcome to the repository of my interactive portfolio! Beyond the live site, this repo also serves as a practical demonstration of my skills in containerization and cloud infrastructure (Docker, Terraform, AWS) - an area I'm actively building toward a Network/DevOps Engineer role.

## Architecture & Technologies

* **Frontend**: React + Vite
* **Containerization**: Docker (multi-stage build minimizing image size)
* **Web Server**: Nginx (Alpine version)
* **Infrastructure (IaC)**: Terraform + AWS (Work in progress)
* **CI/CD**: GitHub Actions (Work in progress)

## How to run the project locally

### Option A: Build from source
```bash
docker build -t damianfilipiak_portfolio .
docker run -d -p 8080:80 --name damian-portfolio damianfilipiak_portfolio
```
### Option B: Download image from Docker Hub
```bash
docker run -d -p 8080:80 --name damian-portfolio xxxblacksanta/portfoslio:latest
```
The application will be available at: http://localhost:8080


## 👨‍💻 About the Author

Damian Filipiak
IT Engineer with hands-on experience in maintaining local production infrastructure, LAN/VLAN networks, and virtualization systems. Currently expanding my expertise towards Cloud Native and DevOps architecture.