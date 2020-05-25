# Notus
*Modeling the spread of COVID-19 to create various safer room layouts.*

## Inspiration

We were inspired by the sudden and wide-scale reopening of companies, stores, and other entities that are beginning to happen. We decided that it would be useful for employers or store managers to be able to visualize their environment and predict how the environment will affect the spread of COVID-19. We had done some math modeling before, but we set out to learn how to do Monte Carlo Simulations. We felt that it would be both challenging and rewarding to learn this.
## What it does

The application takes in user-defined inputs, which include a simple user-drawn layout of the office/rooms that will be simulated, and some constants. The application then uses a Monte Carlo simulation technique to simulate people moving around in the defined layout. This simulation models the spread of COVID-19 in the environment. By modifying some variables, one can find precautions that can help lower the possibility of infection. 
## How we built it

We started by splitting into two teams, one which handled the GUI for the application, and one that focused on the Monte Carlo simulation.  Monte Carlo simulations are a set of methodologies that simulates some situation many times to generate results. Our implementation of a Monte Carlo simulation simulates a user given space and some people inside it. We then simulate the spread of COVID-19 through this environment.

The Monte Carlo simulation was built with two major classes of interactions. We created two classes, Person and Square, which store a simulated person's data and environmental data. We then created the simulation by creating a Population of Persons and a Grid of Squares. Both Person and square classes have a function called _tick()_ which are the functions that are called each tick of the Monte Carlo simulation. The driver function that does the simulation loads in configuration data and runs the simulation by calling the tick() functions. 

The GUI is written in Electron, a cross-platform system that allowed us to write desktop apps with HTML/CSS/JS. We used the React.js framework to allow us to reuse components and handle the complex component states of various elements in the designer. We also extensively modified existing room planning software to fit our needs, including working with the Electron sandbox. This room planner passes the room data via Inter-Process Communication (IPC) to a worker pool, which performs the simulation and returns the computed values, including exposure probabilities, and how much of the time social distancing would be broken with this given layout. 

## Challenges we ran into

There were a few challenges with creating the Monte Carlo simulation. There are many variables to consider when simulating viral spread. Many of these variables are not know, due to the relative novelty of the COVID-19 virus. However, we found some data from various scientific papers to allow us to set sane defaults for the simulation. Furthermore, since Node.JS isn't designed for computationally intensive programs, we had to implement worker pool and multithreading libraries to provide the power needed to perform the simulation.

There were also a few issues with GUI development. Since we are new to React.js and Electron, we had a steep learning curve in learning the lifecycle concept of React components and how their states would interact with our application. Furthermore, the sandboxing of the compute and render processes, which are at the core of Electron made it hard for us to transfer data to and from the Room Designer and the Monte Carlo process. 
## Accomplishments that we're proud of

We're proud that we were able to learn how to develop and then implement a Monte Carlo simulation during this hackathon. We're also proud that the tool requires no programming or mathematical knowledge so that as many people as possible can use it. 
## What we learned

We learned how to use React.JS and Electron to write a user-friendly desktop application. We also learned how to multi-thread applications in JS environments to perform computationally intensive tasks in user-friendly ways, while maintaining the level of performance expected in traditional scientific research environments. 

## What's next for Notus

We would first like to expand on the functionality to allow for the application to model the room layout which has the least potential spread of COVID-19. We would like to take this to various businesses so that they can reopen safely, helping keep our communities safe while aiding the economy. 
