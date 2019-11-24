"use strict";

import * as express from "express";
import * as path from "path";
import * as fs from "fs";

import Model from "./model";
import IndexRoute from "./routes/index-route";

export default class Server
{
	protected static SERVER_SIDE_VIEWS : boolean = false;

	public express : express.Application;
	public model : Model;

	protected readonly root : string;

	private constructor(root : string)
	{
		console.log("Initializing server");
		this.express = express.default();
		this.model = new Model();
		this.root = root;
		this.configure();
	}

	private configure() : void
	{
		if (Server.SERVER_SIDE_VIEWS)
		{
			console.log("Setting up view engine for directory: " + path.join(this.root, "views"));
			this.express.set("views", path.join(this.root, "views"));
			this.express.set("view engine", "hbs");

			console.log("Setting up routes");
			this.express.use("/", new IndexRoute(this.model).getRouter());
			this.express.use(express.static(path.join(this.root, "public")));
			this.express.use(this.fallbackHandler);
		}
		else
		{
			console.log("Setting up routes");
			this.express.use(express.static(path.join(this.root, "public")));
			this.express.use(this.fallbackHandler);
		}

		console.log("Server directory: " + this.root);
		fs.readdirSync(this.root).forEach(file => console.log("- " + file));
	}

	private fallbackHandler(request : express.Request, response : express.Response, next : express.NextFunction) : void
	{
		console.log("[HTTP 404] " + request.url);

		response.statusCode = 404;
		response.send("<!DOCTYPE html><html><body>404 - Not found</body></html>");
	}

	public static create(root? : string) : Server
	{
		return new Server(root ? root : process.cwd());
	}
}