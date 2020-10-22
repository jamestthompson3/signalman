## Development Prerequisites

- Node 12.18+
- Yarn / NPM

## Getting started

You can run the application in development mode by cloning the repo, then running `yarn && yarn start` inside the project directory.

## Ideas

✅ = currently in app

### Work Organization
* Expose custom fields like TW, and allow users to operate on those fields. For example, you can have a field called `timeEstimate` that is an estimate of how long the task will take ( or how long you'll work on it ) and then you can set an autofill rule on your calendar like, `WHERE task.timeEstimate <= 15` to auto suggest times to work on things.
* Ability to link tasks together or link to calendar events. Could be implemented with custom fields as described above. You can shift click to select multiple tasks, then right click to take actions on them.
* Save all tasks on small JSON files on disk. This allows users to build tools around the data they generate. ✅
* Browser extension that tells you if the site you’re looking at has a task attached to it. Be able to block certain domains that will have a bunch of tasks like JIRA.
* Different border colors for Operator cards and Output? Cards. Have a stack underneath Operator and Output cards to show which cards are feeding into them.
* Operator tool brings up the “produces” and “expects” labels on every card. Then you connect two congruent cards with this tool.
* Be able to visualize lead vs lag measures
* Be able to visually schedule every minute of the day a la [[Tweek]], or described on [[Deep Work]] pg 219
* Some sort of bulk "Follow Up" card for each day
* Ability to schedule automated backups which compress files
* Ability to check in workspaces to version control - If I'm working on the signalman project, I can get and symlink the current signalman workspace when I clone the git repo.

### Work Philosophies
* Ability to visualize the Rhythmic Philosophy of Deep Work. Being able to see and contribute to a chain of deep work sessions can help in incentivizing and prioritizing tasks.
* The ability to batch seemingly "shallow" tasks into a deep work session. Tasks that seem somewhat tangentially related at the surface in reality have deep dependencies on each other. Being able to batch them together and schedule deep work time to think about them would be awesome.
* External todos. Some task that you don’t control, but after a certain amount of time it becomes a follow up todo for you
* Be able to focus on accomplishable goals. Basically be able to have a control room whose main giant screen is a very short list of "things I will do today" instead of "things I //want// to do today", since we all want to do all our tasks all the time :)
* Be able to associate groups of tasks with a larger and more higher level goals. Example goal, "I want to change the way my team thinks about software architecture".
* Ability to automatically back pressure tasks when not explicitly scheduled. Could fold into EOD follow up category 
* Be able to import tasks from other sources

### General Features
* No server. Share data between devices via P2P over network or bluetooth.
* Highly customizable, fit an evolving workflow
* Be able to address different contexts of task management / creation. For example while in deep work, I want to quickly write down a task that's distracting my focus. Later, I might want to add all the nice details and extra fields, but in the moment, my need is to quickly get into my list and out of my mind.
* vim like bindings, `j,k,h,l` for moving focus, arrow keys for moving the task. 
* View only workspaces where no cards get copied to disk. Requires constant network access to peers or to set up a server.
* Set up a local web server to host PWA on your phone, then use either WebRTC or Websockets to sync when on the same network.
