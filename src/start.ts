import * as redis from "redis";

import Server from "./server";

class ServerStarter
{
	protected static SOCKET : string = process.env.SOCKET || "/opt/common/ipc.socket";

	private redisIn : redis.RedisClient;
	private redisInReady : boolean = false;
	private redisOut : redis.RedisClient;
	private redisOutReady : boolean = false;

	private constructor()
	{
		this.redisIn = redis.createClient(ServerStarter.SOCKET);

		this.redisIn.on("ready", () => {
			this.redisInReady = true;
			console.log("Subscribing");
			this.redisIn.subscribe("frontend-to-backend:pxserver");
		});
		this.redisIn.on("message", (channel : string, message : string) => {
			console.log("Channel <" + channel + ">: " + message);
			if (this.redisOutReady)
				this.redisOut.publish("backend-to-frontend:pxserver", "Received your message!");
		});

		this.redisOut = redis.createClient(ServerStarter.SOCKET);
		this.redisOut.on("ready", () => {
			this.redisOutReady = true;
			setTimeout(() => {
				console.log("Sending a message");
				this.redisOut.publish("backend-to-frontend:pxserver", "Hello from Backend!");
			}, 3000)
		});
	}

	private start() : void
	{
	}

	private onListening(starter : ServerStarter) : void
	{
		console.log("Listening on socket " + ServerStarter.SOCKET);
	}

	private onConnection(starter : ServerStarter) : void
	{
		console.log("Someone connected to " + ServerStarter.SOCKET);
	}

	private onError(starter : ServerStarter, error : Error) : void
	{
		throw error;
	}

	public static start() : void
	{
		var starter : ServerStarter = new ServerStarter();

		starter.start();
	}
}

ServerStarter.start();