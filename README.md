# 🚀 Personal Portfolio

[![Docker Pulls](https://img.shields.io/docker/pulls/xxxblacksanta/portfolio)](https://hub.docker.com/r/xxxblacksanta/portfolio)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**🔗 Live:** [damianfilipiak.vercel.app](https://damianfilipiak.vercel.app/)

Welcome to the repository of my interactive portfolio! Beyond the live site, this repo also serves as a practical demonstration of my skills in containerization and cloud infrastructure (Docker, Terraform, AWS) - an area I'm actively building toward a Network/DevOps Engineer role.

## Architecture & Technologies

* **Frontend**: React + Vite
* **Containerization**: Docker (multi-stage build, Node.js 24)
* **Web Server**: Nginx unprivileged (Alpine)
* **Infrastructure (IaC)**: Terraform + AWS (Work in progress)
* **CI/CD**: GitHub Actions build and browser checks, Dependabot weekly updates, and Vercel deployments

## How to run the project locally

Build and run the production container:
```bash
docker build -t damianfilipiak_portfolio .
docker run --rm -p 8080:8080 --name damian-portfolio damianfilipiak_portfolio
```
The application will be available at: http://localhost:8080. The container uses the same Node.js major version as CI and Vercel, installs dependencies from the lockfile, and serves the built site with an unprivileged Nginx user. Security headers are configured in `nginx.conf` to match `vercel.json`.

This repository does not automatically publish updated images to Docker Hub; build from source to run the current version.

## Updates and deployment checks

GitHub Actions runs the required production build and Playwright browser checks on pushes to `main` and pull requests targeting `main`. The browser checks verify that the 3D model loads, the page has no runtime errors, and both CV PDFs are available. A separate Docker workflow builds and tests the container only when Docker-related files or dependency manifests change, and can also be started manually.

Dependabot checks npm packages and GitHub Actions weekly and opens pull requests with available updates. Updates are not merged automatically.

When the repository is connected to Vercel, pull requests can also receive Preview Deployments for manually checking the site before a change is merged. Production deployment after merging depends on the Vercel project's production branch settings. Review the preview URL and passing workflow check before merging.

## 👨‍💻 About the Author

Damian Filipiak
IT Engineer with hands-on experience in maintaining local production infrastructure, LAN/VLAN networks, and virtualization systems. Currently expanding my expertise towards Cloud Native and DevOps architecture.