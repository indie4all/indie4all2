# INDIe4all2 project
The aim of this project is to bring the power of the Indie4all projects to households with Internet access difficulties. Once you have deployed your Docker container on your computer, you will not need Internet access to create, export, import, preview and generate accessible learning units, all with an easy-to-use interface.
## Prerequisites
- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) installed.
- [Docker Desktop](https://docs.docker.com/desktop/) or [Docker Engine](https://docs.docker.com/engine/install/) installed.
- Tested with Node 14.18.1 and npm 6.14.15 (there are compatibity issues when building with Node 18).
## Steps
- Clone this repository: `git clone https://github.com/indie4all/indie4all2.git`.
- Install the required dependencies: `npm install`.
- Build the docker image: `npm run dockerize`.
- Run a new container `docker run -d -p YOUR_ACCESS_PORT:8000 indie4all2:latest`
- Using your browser, access to `localhost:YOUR_ACCESS_PORT` and enjoy!