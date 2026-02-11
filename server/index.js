import { runAppConfig } from "./src/core/core.config.js";
async function main(){
    const {startServer} = runAppConfig()
    startServer()
    
}

main()
.then(() => console.log())
.catch((err) => { throw err });