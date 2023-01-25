# INDIe4all2 project
The aim of this project is to bring the power of the Indie4all projects to households with Internet access difficulties. Once you have deployed your Docker container on your computer, you will not need Internet access to create, export, import, preview and generate accessible learning units, all with an easy-to-use interface.
## Prerequisites
- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) installed.
- [Docker Desktop](https://docs.docker.com/desktop/) or [Docker Engine](https://docs.docker.com/engine/install/) installed.
- Tested with Node 14+ and npm 6+. Doesn't work on Node 19+.
## Steps
- Clone this repository: `git clone https://github.com/indie4all/indie4all2.git`.
- Go to the indie4all2 directory: `cd indie4all2`.
- Install the required dependencies: `npm install`.
- Build the client JS and CSS: `npx webpack --config webpack.prod.js`.
- Build the docker image: `docker build --pull --rm -f Dockerfile -t [YOUR_DOCKER_REPOSITORY]:latest .`.
  - For example: `docker build --pull --rm -f Dockerfile -t indie4all2/indie4all2:latest .`.
- Run a new container `docker run -d -p [YOUR_ACCESS_PORT]:8000 indie4all2:latest`
- Using your browser, access to `localhost:[YOUR_ACCESS_PORT]` and enjoy!