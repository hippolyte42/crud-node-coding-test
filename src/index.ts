import { initRepositories } from "./repositories/init.repositories";
import { initApplication } from "./application/init.application";
import { initTransport } from "./transport/init.transport";

type DanglingConnections = {
  close: () => Promise<void> | void;
};
let danglingConnections: DanglingConnections[] = [];

const run = async () => {
  // repositories
  const { close: repositoriesClose, repositories } = await initRepositories();
  danglingConnections.push({ close: repositoriesClose });

  // application
  const usecases = initApplication(repositories);

  // transport
  const { close: transportClose } = await initTransport(usecases);
  danglingConnections.push({ close: transportClose });

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
        await connection.close();
      } catch (e) {
        console.log(`[graceful shutdown] Cannot close service`, e);
      }
    }

    process.exit(0);
  });
});
