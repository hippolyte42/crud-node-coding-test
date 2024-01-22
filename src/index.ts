import { http } from "./transport/HTTP/http.transport";

let danglingConnections: {
  close: () => void;
}[] = [];

const run = async () => {
  const [HTTP] = await Promise.all([
    http().catch((e) => {
      console.error(e);
    }),
  ]);
  if (HTTP) {
    danglingConnections.unshift(HTTP);
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
