import * as http from "http";
import * as redis from "redis";

import Server from "./server";

export default class ServerStarter
{
	protected static SOCKET : string = process.env.SOCKET || "/opt/common/ipc.socket";

	private server : Server;
	private httpServer : http.Server;
	private port : string;

	private redisIn? : redis.RedisClient;
	private redisInReady : boolean = false;
	private redisOut? : redis.RedisClient;
	private redisOutReady : boolean = false;

	private constructor(root? : string)
	{
		this.server = Server.create(root);
		this.port = process.env.PORT || "3000";

		this.server.express.set("port", this.port);

		this.httpServer = http.createServer(this.server.express);
		this.httpServer.on("listening", () => this.onListening(this));
		this.httpServer.on("error", (error) => this.onError(this, error));

		//this.connectToFrontend();
	}

	public getServer() : Server
	{
		return this.server;
	}

	private connectToFrontend()
	{
		console.log("Connecting to the frontend");

		this.redisIn = redis.createClient(ServerStarter.SOCKET);

		this.redisIn.on("ready", () => {
			if (!this.redisIn) return;
			this.redisInReady = true;
			console.log("Subscribing");
			this.redisIn.subscribe("frontend-to-backend:pxserver");
		});
		this.redisIn.on("message", (channel : string, message : string) => {
			console.log("Channel <" + channel + ">: " + message);
			if (this.redisOut && this.redisOutReady)
				this.redisOut.publish("backend-to-frontend:pxserver", "Received your message!");
		});

		this.redisOut = redis.createClient(ServerStarter.SOCKET);
		this.redisOut.on("ready", () => {
			if (!this.redisOut) return;
			this.redisOutReady = true;
			setTimeout(() => {
				if (!this.redisOut) return;
				console.log("Sending a message");
				this.redisOut.publish("backend-to-frontend:pxserver", "Hello from Backend!");
			}, 3000)
		});
	}

	private start() : void
	{
		this.httpServer.listen(this.port);
	}

	private onListening(starter : ServerStarter) : void
	{
		console.log("Listening on http://localhost:" + starter.port);
	}

	private onError(starter : ServerStarter, error : Error) : void
	{
		throw error;
	}

	public static start(root? : string) : ServerStarter
	{
		var starter : ServerStarter = new ServerStarter(root);

		starter.start();

		return starter;
	}
}