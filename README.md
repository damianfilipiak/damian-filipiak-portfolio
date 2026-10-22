# 🚀 Personal Portfolio

[![Docker Pulls](https://img.shields.io/docker/pulls/xxxblacksanta/portfolio)](https://hub.docker.com/r/xxxblacksanta/portfolio)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**🔗 Live:** [damianfilipiak.vercel.app](https://damianfilipiak.vercel.app/)

Welcome to the repository of my interactive portfolio! Beyond the live site, this repo also serves as a practical demonstration of my skills in containerization and cloud infrastructure (Docker, Terraform, AWS) - an area I'm actively building toward a Network/DevOps Engineer role.

## Architecture & Technologies

* **Frontend**: React + Vite
* **Containerization**: Docker (multi-stage build minimizing image size)
* **Web Server**: Nginx (Alpine version)
* **Infrastructure (IaC)**: Terraform + AWS (Work in progress)
* **CI/CD**: GitHub Actions build and browser checks, Dependabot weekly updates, and Vercel deployments

## How to run the project locally

### Option A: Build from source
```bash
docker build -t damianfilipiak_portfolio .
docker run -d -p 8080:80 --name damian-portfolio damianfilipiak_portfolio
```
### Option B: Download image from Docker Hub
```bash
docker run -d -p 8080:80 --name damian-portfolio xxxblacksanta/portfolio:latest
```
The application will be available at: http://localhost:8080

## Updates and deployment checks

GitHub Actions runs a production build and Playwright browser checks for pushes to any branch and pull requests targeting `main`. The browser checks verify that the homepage and 3D model load, the page has no runtime errors, and both CV PDFs are available.

Dependabot checks npm packages and GitHub Actions weekly and opens pull requests with available updates. Updates are not merged automatically.

When the repository is connected to Vercel, pull requests can also receive Preview Deployments for manually checking the site before a change is merged. Production deployment after merging depends on the Vercel project's production branch settings. Review the preview URL and passing workflow check before merging.

## 👨‍💻 About the Author

Damian Filipiak
IT Engineer with hands-on experience in maintaining local production infrastructure, LAN/VLAN networks, and virtualization systems. Currently expanding my expertise towards Cloud Native and DevOps architecture.