# Group assignment: Mulitplayer Game
Make a playable game you think is fun.

## Rules
- Work in groups
- Support multiple simultaneous games with a lobby system

## Required techniques/tools
### Client
- React
- Redux
- JWT
- Netlify

### Server
- PostgreSQL
- Sequelize
- JWT
- Heroku

## Guidelines
- Use the DOM as the GUI
- Be careful about timing. Consider supporting asynchronous play.
- Deploy to GitHub and Heroku regularly
- Use Sequelize and REST, not typeORM and graphQL
- Do not use alert, prompt, or document.getElementById

# The game
We decided to make a pictionary game with a live drawingboard and a chat. To make this possible, we used Socket.IO for the whole game part. Styling is been done with Material UI.
The game supports multiple game rooms. Each room can have unlimited numbers of players. When a room is empty, the first player who joins the room is the drawer. The player who guesses the right answer will be the next drawer.
