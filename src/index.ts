import { mongo } from "./repositories/mongo/mongo";
import { http } from "./transport/http/http.transport";
import { initRepositories } from "./repositories/initRepositories";

type DanglingConnections = {
  close: () => void;
};
let danglingConnections: DanglingConnections[] = [];

const run = async () => {
  try {
    const [HTTP, MONGO] = await Promise.all([http(), mongo()]);
    danglingConnections.unshift(HTTP);
    danglingConnections.unshift(MONGO);

    initRepositories(MONGO.client);
  } catch (e) {
    console.error(e);
  }

  console.info("Server started");
};

run().catch((e) => {
  console.error(e);
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
        console.error(`[graceful shutdown] Cannot close service`, e);
      }
    }

    process.exit(0);
  });
});
