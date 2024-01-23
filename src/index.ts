import { mongo } from "./repositories/mongo/mongo";
import { http } from "./transport/http/http.transport";
import { initRepositories } from "./repositories/initRepositories";
import { initApplication } from "./application/init.application";

type DanglingConnections = {
  close: () => void;
};
let danglingConnections: DanglingConnections[] = [];

const run = async () => {
  // databse
  const MONGO = await mongo();
  danglingConnections.unshift(MONGO);

  const repositories = initRepositories(MONGO.client);
  const usecases = initApplication(repositories);

  // transport
  const HTTP = await http(usecases);
  danglingConnections.unshift(HTTP);

  console.info("Server started");
};

run().catch((e) => {
  console.log(e);
  process.exit(1);
});

[
  "SIGINT",
  "SIGTERM",
  "SIGQUIT",
  "SIGHUP",
  "uncaughtException",
  "unhandledRejection",
].forEach((signal) => {
  process.on(signal, async () => {
    // Prevents the server from hanging on exit
    setTimeout(() => {
      console.info(
        "[graceful shutown] Forced exit after server hanged on close",
      );
      process.exit(1);
    }, 5000);

    console.info(`[graceful shutdown] Received ${signal}, exiting...`);

    for (const connection of danglingConnections) {
      try {
        connection.close();
      } catch (e) {
        console.log(`[graceful shutdown] Cannot close service`, e);
      }
    }

    process.exit(0);
  });
});
