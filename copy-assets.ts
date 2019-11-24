import * as shell from "shelljs";

shell.set("-e");
shell.cp("configuration.json", "run/");