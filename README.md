# React Starter
My manual webpack setup for React JS.<br>
If you prefer a comprehensive starter, recommand use the facebook [create-react-app](https://github.com/facebookincubator/create-react-app).

## Add More Module(s)
* Module runs during webpack server or development server<br>
   `npm i -D [module's name]`<br>
* Module that needed in the production<br>
   `npm i -S [module's name]`

## Available Scripts
1. `npm run dev`

   Start webpack server in development mode.

   Should host on [http://localhost:8080/](http://localhost:8080/). If port `8080` is occupied, try port `8081`.
2. `npm run build`

   Build the react app for production (compile application into static) under `public` folder.

## Push this directory to your repository
In the command line: <br>
`git remote set-url origin [your repository url]`<br>
`git add -A`<br>
`git push origin master`
