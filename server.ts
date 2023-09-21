Deno.serve((req) => {
  if (req.headers.get("upgrade") != "websocket") {
    return new Response(null, { status: 501 });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);

  socket.addEventListener("open", () => {
    console.log("a client connected!");
  });

  socket.addEventListener("message", async (event) => {
    const query = event.data;

    const command = new Deno.Command("python", {
      args: ["main.py", query],
    });

    const { stdout, stderr } = await command.output();

    // if (stderr.length > 0) {
    //   console.log("stderr:: ", new TextDecoder().decode(stderr));
    // }

    const ans = new TextDecoder().decode(stdout);
    // ans.split("\r\n")[3];
    // console.log(ans);
    socket.send(ans.split("\r\n").slice(3).join("\n"));
  });

  return response;
});

// const command = new Deno.Command("python", {
//   args: ["main.py", "funactivities in college"],
// });

// const { stdout, stderr } = await command.output();

// if (stderr.length > 0) {
//   console.log("stderr:: ", new TextDecoder().decode(stderr));
// }
// const decoded=new TextDecoder().decode(stdout);
// console.log("stdout:: ", decoded.split("\r\n")[3]);
