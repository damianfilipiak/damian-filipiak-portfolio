# Cloud-Native Personal Portfolio

Welcome to the repository of my interactive portfolio! This project serves not only as a showcase of my experience as a Junior IT Specialist but, more importantly, as a practical demonstration of my skills in **DevOps, containerization, and cloud infrastructure**.

## Architecture & Technologies

The project was designed according to Cloud-Native best practices, moving away from automated hosting platforms (like Vercel) in favor of full infrastructure control:

* **Frontend:** React + Vite
* **Containerization:** Docker (multi-stage build minimizing image size)
* **Web Server:** Nginx (Alpine version)
* **Infrastructure (IaC):** Terraform + AWS (Work in progress)
* **CI/CD:** GitHub Actions (Work in progress)

## How to run the project locally?

**1. Build the image (Multi-stage build):**
```bash
docker build -t damianfilipiak_portfolio .
```
**2. Run the container in the background (port 8080):**
```bash
docker run -d -p 8080:80 --name damian-portfolio damianfilipiak_portfolio
```
The application will be available at: http://localhost:8080

**Option B: Download image from Docker Hub
```bash
docker run -d -p 8080:80 --name damian-portfolio xxxblacksanta/portfolio:latest
```

# 👨‍💻 About the Author
Damian Filipiak
IT Engineer with hands-on experience in maintaining local production infrastructure, LAN/VLAN networks, and virtualization systems. Currently expanding my expertise towards Cloud Native and DevOps architecture.