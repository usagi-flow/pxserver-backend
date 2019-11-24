"use strict";

import * as express from "express";
import * as path from "path";

import Model from "./model";
import IndexRoute from "./routes/index-route";

export default class Server
{
	public express : express.Application;
	public model : Model;

	private constructor()
	{
		console.log("Initializing server");
		this.express = express();
		this.model = new Model();
		this.configure();
	}

	private configure() : void
	{
		console.log("Setting up view engine for directory: " + path.join(__dirname, "views"));
		this.express.set("views", path.join(__dirname, "views"));
		this.express.set("view engine", "hbs");

		//this.express.use(logger("dev"));
		//this.express.use(bodyParser.json());
		//this.express.use(bodyParser.urlencoded({ extended: false }));
		//this.express.use(cookieParser());

		console.log("Setting up routes");
		this.express.use(express.static(path.join(__dirname, "public")));
		this.express.use("/", new IndexRoute(this.model).getRouter());
		//this.express.use("/context", new TestRoute(this.model).getRouter());
		//this.express.use(this.fallbackHandler);
	}

	private fallbackHandler(request : express.Request, response : express.Response, next : express.NextFunction) : void
	{
		var error : HTTPError = new HTTPError("Not Found");
		error.status = 404;
		next(error);
	}

	public static create() : Server
	{
		return new Server();
	}
}

class HTTPError extends Error
{
	public status : number;
}